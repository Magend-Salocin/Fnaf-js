/**
 * GifPlayer — Pure canvas animated GIF renderer (no DOM hacks).
 *
 * Parses a GIF file from an ArrayBuffer, decodes every frame (LZW + disposal),
 * and exposes a simple API to draw the current frame on any CanvasRenderingContext2D.
 *
 * Usage:
 *   const gif = new GifPlayer();
 *   await gif.load('path/to/animation.gif');
 *   gif.play();                        // starts internal timer
 *   // inside your render loop:
 *   gif.drawFrame(ctx, x, y, w, h);    // draws current frame
 *   gif.stop();                         // stops animation
 */
class GifPlayer {
    /**
     * @param {object} [opts]
     * @param {number} [opts.speed=1]  Playback speed multiplier (2 = twice as fast)
     * @param {number} [opts.fps]      If set, overrides every frame's built-in delay
     *                                 with a fixed framerate (e.g. 12 = 12 fps).
     */
    constructor(opts = {}) {
        this.frames = [];          // { imageData, delay (ms), disposalMethod }
        this.width = 0;
        this.height = 0;
        this.currentFrame = 0;
        this.playing = false;
        this._offscreen = null;     // offscreen canvas for compositing
        this._offCtx = null;
        this._restore = null;       // saved region for disposal method 3

        /** Playback speed multiplier (1 = normal, 0.5 = half speed, 2 = double). */
        this.speed = opts.speed ?? 1;

        /**
         * Optional fixed FPS override.  When set to a number > 0 every frame
         * uses `1000 / fps` ms as its delay instead of the GIF-embedded value.
         * Set to `null` to fall back to the per-frame delays baked in the file.
         */
        this.fps = opts.fps ?? null;

        /** Accumulated time (ms) – drives frame advancement independently of render FPS. */
        this._accumulator = 0;
        this._lastTime = null;
    }

    /* ------------------------------------------------------------------ */
    /*  PUBLIC API                                                         */
    /* ------------------------------------------------------------------ */

    /** Load a GIF from a URL (fetch) or an existing ArrayBuffer. */
    async load(src) {
        let buffer;
        if (src instanceof ArrayBuffer) {
            buffer = src;
        } else {
            const res = await fetch(src);
            buffer = await res.arrayBuffer();
        }
        this._parse(new Uint8Array(buffer));

        // Prepare offscreen compositing canvas
        this._offscreen = document.createElement('canvas');
        this._offscreen.width = this.width;
        this._offscreen.height = this.height;
        this._offCtx = this._offscreen.getContext('2d');
        this._offCtx.clearRect(0, 0, this.width, this.height);
        this.currentFrame = 0;
        this._compositeFrame(0);
    }

    /** Start playback. */
    play() {
        if (this.playing || this.frames.length === 0) return;
        this.playing = true;
        this._accumulator = 0;
        this._lastTime = null;
    }

    /** Pause playback (keeps current frame). */
    stop() {
        this.playing = false;
        this._lastTime = null;
    }

    /** Reset to frame 0 and stop. */
    reset() {
        this.stop();
        this.currentFrame = 0;
        this._accumulator = 0;
        if (this._offCtx) {
            this._offCtx.clearRect(0, 0, this.width, this.height);
            this._compositeFrame(0);
        }
    }

    /**
     * Advance the animation clock.  Call this once per game tick.
     *
     * @param {number} [dt]  Elapsed time in **milliseconds** since last call.
     *                        If omitted the player uses its own high-res clock
     *                        (performance.now()), so you can call update() with
     *                        no arguments from any loop and it Just Works™.
     */
    update(dt) {
        if (!this.playing || this.frames.length === 0) return;

        // Auto-calculate dt when not supplied
        if (dt === undefined) {
            const now = performance.now();
            if (this._lastTime === null) { this._lastTime = now; return; }
            dt = now - this._lastTime;
            this._lastTime = now;
        }

        this._accumulator += dt * this.speed;

        // Advance as many frames as dt warrants (handles slow ticks gracefully)
        let safety = this.frames.length; // prevent infinite loop on 0-delay frames
        while (this._accumulator >= this._frameDelay() && safety-- > 0) {
            this._accumulator -= this._frameDelay();
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this._compositeFrame(this.currentFrame);
        }
    }

    /**
     * Draw the current composited frame onto a target context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} dx  destination X
     * @param {number} dy  destination Y
     * @param {number} [dw] destination width  (defaults to gif width)
     * @param {number} [dh] destination height (defaults to gif height)
     */
    drawFrame(ctx, dx, dy, dw, dh) {
        if (!this._offscreen) return;
        ctx.drawImage(
            this._offscreen,
            dx, dy,
            dw !== undefined ? dw : this.width,
            dh !== undefined ? dh : this.height
        );
    }

    /** Returns true when at least one frame has been decoded. */
    get ready() {
        return this.frames.length > 0;
    }

    /* ------------------------------------------------------------------ */
    /*  TIMING HELPERS                                                     */
    /* ------------------------------------------------------------------ */

    /** Effective delay (ms) for the current frame. */
    _frameDelay() {
        if (this.fps !== null && this.fps > 0) return 1000 / this.fps;
        return Math.max(this.frames[this.currentFrame].delay, 20);
    }

    /* ------------------------------------------------------------------ */
    /*  FRAME COMPOSITING (handles disposal methods)                      */
    /* ------------------------------------------------------------------ */

    _compositeFrame(index) {
        const f = this.frames[index];
        const ctx = this._offCtx;

        // --- disposal of PREVIOUS frame ---
        if (index === 0) {
            ctx.clearRect(0, 0, this.width, this.height);
        }
        const prev = index > 0 ? this.frames[index - 1] : null;
        if (prev) {
            switch (prev.disposalMethod) {
                case 2: // restore to background (clear the prev frame area)
                    ctx.clearRect(prev.left, prev.top, prev.w, prev.h);
                    break;
                case 3: // restore to previous — put back saved snapshot
                    if (this._restore) {
                        ctx.putImageData(this._restore, prev.left, prev.top);
                    }
                    break;
                // 0 or 1: do nothing (leave as‑is)
            }
        }

        // Save region BEFORE drawing (for disposal method 3 of THIS frame)
        if (f.disposalMethod === 3) {
            this._restore = ctx.getImageData(f.left, f.top, f.w, f.h);
        }

        // Draw current frame patch
        ctx.putImageData(f.imageData, f.left, f.top);
    }

    /* ================================================================== */
    /*  GIF BINARY PARSER                                                  */
    /* ================================================================== */

    _parse(data) {
        let pos = 0;

        const read = (n) => { const s = data.subarray(pos, pos + n); pos += n; return s; };
        const u8  = () => data[pos++];
        const u16 = () => { const v = data[pos] | (data[pos + 1] << 8); pos += 2; return v; };

        // ---- Header ----
        const sig = String.fromCharCode(...read(6));
        if (sig !== 'GIF87a' && sig !== 'GIF89a') throw new Error('Not a GIF file');

        // ---- Logical Screen Descriptor ----
        this.width = u16();
        this.height = u16();
        const packed = u8();
        const bgIndex = u8();
        /* pixelAspect = */ u8();

        const gctFlag = (packed >> 7) & 1;
        const gctSize = 1 << ((packed & 7) + 1);

        let gct = null;
        if (gctFlag) {
            gct = this._readColorTable(data, pos, gctSize);
            pos += gctSize * 3;
        }

        // ---- Blocks ----
        let gce = null; // pending Graphic Control Extension

        while (pos < data.length) {
            const intro = u8();

            if (intro === 0x3B) break; // Trailer

            if (intro === 0x21) {
                // Extension
                const label = u8();
                if (label === 0xF9) {
                    // Graphic Control Extension
                    /* blockSize = */ u8(); // always 4
                    const gcPacked = u8();
                    const delayCs = u16();
                    const transIdx = u8();
                    /* terminator = */ u8();
                    gce = {
                        disposalMethod: (gcPacked >> 2) & 7,
                        transparentFlag: gcPacked & 1,
                        transparentIndex: transIdx,
                        delay: delayCs * 10 // centiseconds → ms
                    };
                } else {
                    // Skip other extensions (comment, application, etc.)
                    pos = this._skipSubBlocks(data, pos);
                }
                continue;
            }

            if (intro === 0x2C) {
                // Image Descriptor
                const left = u16();
                const top = u16();
                const w = u16();
                const h = u16();
                const imgPacked = u8();
                const lctFlag = (imgPacked >> 7) & 1;
                const interlaced = (imgPacked >> 6) & 1;
                const lctSize = 1 << ((imgPacked & 7) + 1);

                let ct = gct; // active color table
                if (lctFlag) {
                    ct = this._readColorTable(data, pos, lctSize);
                    pos += lctSize * 3;
                }

                // LZW Minimum Code Size
                const minCodeSize = u8();

                // Collect sub‑blocks into a single stream
                const lzwData = this._readSubBlocks(data, pos);
                pos = lzwData.newPos;

                // Decompress
                const pixels = this._lzwDecode(minCodeSize, lzwData.bytes, w * h);

                // Build ImageData
                const imageData = new ImageData(w, h);
                const transFlag = gce ? gce.transparentFlag : 0;
                const transIdx = gce ? gce.transparentIndex : -1;

                for (let i = 0; i < w * h; i++) {
                    let pi = interlaced ? this._interlaceMap(i, w, h) : i;
                    const colorIdx = pixels[i];
                    const dst = pi * 4;
                    if (transFlag && colorIdx === transIdx) {
                        imageData.data[dst + 3] = 0; // fully transparent
                    } else {
                        const c = ct[colorIdx] || [0, 0, 0];
                        imageData.data[dst]     = c[0];
                        imageData.data[dst + 1] = c[1];
                        imageData.data[dst + 2] = c[2];
                        imageData.data[dst + 3] = 255;
                    }
                }

                this.frames.push({
                    imageData,
                    left,
                    top,
                    w,
                    h,
                    delay: gce ? gce.delay : 100,
                    disposalMethod: gce ? gce.disposalMethod : 0
                });

                gce = null; // consumed
                continue;
            }

            // Unknown block — try to skip
            pos = this._skipSubBlocks(data, pos);
        }
    }

    /* ---- helpers ---- */

    _readColorTable(data, pos, count) {
        const table = [];
        for (let i = 0; i < count; i++) {
            table.push([data[pos], data[pos + 1], data[pos + 2]]);
            pos += 3;
        }
        return table;
    }

    _readSubBlocks(data, pos) {
        const chunks = [];
        while (true) {
            const size = data[pos++];
            if (size === 0) break;
            chunks.push(data.subarray(pos, pos + size));
            pos += size;
        }
        // merge
        let total = 0;
        for (const c of chunks) total += c.length;
        const bytes = new Uint8Array(total);
        let offset = 0;
        for (const c of chunks) { bytes.set(c, offset); offset += c.length; }
        return { bytes, newPos: pos };
    }

    _skipSubBlocks(data, pos) {
        while (true) {
            const size = data[pos++];
            if (size === 0) break;
            pos += size;
        }
        return pos;
    }

    /* ---- LZW Decoder ---- */

    _lzwDecode(minCodeSize, compData, pixelCount) {
        const clearCode = 1 << minCodeSize;
        const eoiCode = clearCode + 1;
        const output = new Uint8Array(pixelCount);
        let outPos = 0;

        let codeSize = minCodeSize + 1;
        let codeMask = (1 << codeSize) - 1;
        let nextCode = eoiCode + 1;

        // Code table: each entry is an array of pixel indices
        const table = new Array(4096);
        const resetTable = () => {
            for (let i = 0; i < clearCode; i++) table[i] = [i];
            table[clearCode] = []; // clear
            table[eoiCode] = [];   // eoi
            nextCode = eoiCode + 1;
            codeSize = minCodeSize + 1;
            codeMask = (1 << codeSize) - 1;
        };
        resetTable();

        let bitBuf = 0;
        let bitCount = 0;
        let bytePos = 0;

        const nextBits = () => {
            while (bitCount < codeSize) {
                if (bytePos >= compData.length) return -1;
                bitBuf |= compData[bytePos++] << bitCount;
                bitCount += 8;
            }
            const code = bitBuf & codeMask;
            bitBuf >>= codeSize;
            bitCount -= codeSize;
            return code;
        };

        let prevCode = -1;

        while (outPos < pixelCount) {
            const code = nextBits();
            if (code === -1 || code === eoiCode) break;

            if (code === clearCode) {
                resetTable();
                prevCode = -1;
                continue;
            }

            let entry;
            if (code < nextCode) {
                entry = table[code];
            } else if (code === nextCode && prevCode !== -1) {
                entry = table[prevCode].concat(table[prevCode][0]);
            } else {
                // corrupt data — bail out gracefully
                break;
            }

            for (let i = 0; i < entry.length && outPos < pixelCount; i++) {
                output[outPos++] = entry[i];
            }

            if (prevCode !== -1 && nextCode < 4096) {
                table[nextCode++] = table[prevCode].concat(entry[0]);
                if (nextCode > codeMask && codeSize < 12) {
                    codeSize++;
                    codeMask = (1 << codeSize) - 1;
                }
            }

            prevCode = code;
        }
        return output;
    }

    /* ---- Interlace re‑mapping ---- */

    _interlaceMap(sequential, w, h) {
        const row = Math.floor(sequential / w);
        const col = sequential % w;
        let actualRow = 0;
        const passStarts = [0, 4, 2, 1];
        const passSteps  = [8, 8, 4, 2];
        let remaining = row;
        for (let pass = 0; pass < 4; pass++) {
            const rows = Math.ceil((h - passStarts[pass]) / passSteps[pass]);
            if (remaining < rows) {
                actualRow = passStarts[pass] + remaining * passSteps[pass];
                break;
            }
            remaining -= rows;
        }
        return actualRow * w + col;
    }
}


/**
 * Load an animated GIF and register it for canvas rendering.
 * @param {string} id       unique key (e.g. "jumpscare1")
 * @param {string} url      path to the .gif file
 * @param {number} x        destination X on the canvas
 * @param {number} y        destination Y on the canvas
 * @param {number} [w]      destination width  (defaults to gif's native width)
 * @param {number} [h]      destination height (defaults to gif's native height)
 * @param {boolean} [autoPlay=true] start playing immediately
 * @returns {Promise<GifPlayer>}
 */
async function loadGif(id, url, x, y, w, h, autoPlay = true) {
    const player = new GifPlayer();
    await player.load(url);
    gifRegistry[id] = {
        player,
        x: x ?? 0,
        y: y ?? 0,
        w: w ?? player.width,
        h: h ?? player.height,
        visible: true
    };
    if (autoPlay) player.play();
    return player;
}

/** Draw every visible GIF onto the given context (call once per render tick). */
function drawGifs(ctx) {
    for (const key in gifRegistry) {
        const entry = gifRegistry[key];
        if (entry.visible && entry.player.ready) {
            entry.player.update();   // advance on its own clock, independent of game FPS
            entry.player.drawFrame(ctx, entry.x, entry.y, entry.w, entry.h);
        }
    }
}

/** Show / hide a GIF by id. */
function showGif(id)  { 

  document.getElementById('gameCanvasGif').src = id.src;
  document.getElementById('gameCanvas').style.display = 'none';
  document.getElementById('gameCanvasGif').style.display = 'block';
  //if (gifRegistry[id]) gifRegistry[id].visible = true; 
 }
function hideGif()  { 
    document.getElementById('gameCanvasGif').src = "";
  document.getElementById('gameCanvasGif').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  //if (gifRegistry[id]) gifRegistry[id].visible = false; 
}

/** Fully remove a GIF (stops playback & frees memory). */
function removeGif(id) {
    if (!gifRegistry[id]) return;
    gifRegistry[id].player.stop();
    delete gifRegistry[id];
}

function isGif(img) {
  //console.log(url);
 return img.src.toLowerCase().endsWith('.gif');
}
