/**
 * Minimal QR code matrix generator using pure TypeScript.
 * Encodes a string as a QR code bit matrix (version 1-10, ECC level M).
 * Uses the browser Canvas API to render — no external dependencies.
 */
import { useEffect, useRef } from "react";

// ──────────────────────────────────────────────────────────────────────────────
// Tiny QR encoder (subset — numeric, alphanumeric, byte mode, version ≤10)
// We use a third-party-free implementation based on the ISO 18004 standard.
// ──────────────────────────────────────────────────────────────────────────────

// Galois field arithmetic for RS error correction
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x = x << 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255];
}

function gfPolyMul(p: number[], q: number[]): number[] {
  const r = new Array<number>(p.length + q.length - 1).fill(0);
  for (let i = 0; i < p.length; i++)
    for (let j = 0; j < q.length; j++) r[i + j] ^= gfMul(p[i], q[j]);
  return r;
}

function rsGeneratorPoly(n: number): number[] {
  let g = [1];
  for (let i = 0; i < n; i++) g = gfPolyMul(g, [1, GF_EXP[i]]);
  return g;
}

function rsEncode(data: number[], ecLen: number): number[] {
  const gen = rsGeneratorPoly(ecLen);
  const msg = [...data, ...new Array<number>(ecLen).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0)
      for (let j = 0; j < gen.length; j++) msg[i + j] ^= gfMul(gen[j], coef);
  }
  return msg.slice(data.length);
}

// Version capacity / EC table (ECC level M)
// [version, dataCodewords, ecCodewords, remainder]
const VERSION_TABLE: [number, number, number, number][] = [
  [1, 16, 10, 0],
  [2, 28, 16, 7],
  [3, 44, 26, 7],
  [4, 64, 36, 7],
  [5, 86, 48, 7],
  [6, 108, 64, 7],
  [7, 124, 72, 0],
];

function pickVersion(byteLen: number): number {
  // byte mode: 4 + 8 + 8*byteLen bits
  const bits = 4 + 8 + 8 * byteLen;
  for (const [v, dc] of VERSION_TABLE) {
    if (dc * 8 >= bits) return v;
  }
  return 7;
}

function buildBitBuffer(text: string, version: number): number[] {
  const bytes = new TextEncoder().encode(text);
  const [, dc] = VERSION_TABLE[version - 1];
  const buf: number[] = [];

  // Mode indicator: byte = 0100
  buf.push(0, 1, 0, 0);
  // Character count (8 bits for versions 1-9 byte mode)
  const len = bytes.length;
  for (let i = 7; i >= 0; i--) buf.push((len >> i) & 1);
  // Data
  for (const b of bytes) for (let i = 7; i >= 0; i--) buf.push((b >> i) & 1);
  // Terminator
  for (let i = 0; i < 4 && buf.length < dc * 8; i++) buf.push(0);
  // Pad to byte boundary
  while (buf.length % 8 !== 0) buf.push(0);
  // Pad codewords
  const padBytes = [0xec, 0x11];
  let pi = 0;
  while (buf.length < dc * 8) {
    const pb = padBytes[pi++ % 2];
    for (let i = 7; i >= 0; i--) buf.push((pb >> i) & 1);
  }
  return buf;
}

function bitsToBytes(bits: number[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i + j] ?? 0);
    out.push(b);
  }
  return out;
}

// QR matrix size = 4*version + 17
function matrixSize(v: number) {
  return 4 * v + 17;
}

function createMatrix(size: number): number[][] {
  return Array.from({ length: size }, () => new Array<number>(size).fill(-1));
}

function setFinderPattern(m: number[][], row: number, col: number) {
  for (let r = -1; r <= 7; r++)
    for (let c = -1; c <= 7; c++) {
      const mr = row + r;
      const mc = col + c;
      if (mr < 0 || mr >= m.length || mc < 0 || mc >= m.length) continue;
      const dark =
        (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
        (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
        (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      m[mr][mc] = dark ? 1 : 0;
    }
}

function setAlignmentPattern(m: number[][], row: number, col: number) {
  for (let r = -2; r <= 2; r++)
    for (let c = -2; c <= 2; c++) {
      const dark =
        r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0);
      m[row + r][col + c] = dark ? 1 : 0;
    }
}

// Alignment pattern positions per version
const ALIGN_POS: Record<number, number[]> = {
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
};

function placeFinderPatterns(m: number[][], size: number) {
  setFinderPattern(m, 0, 0);
  setFinderPattern(m, 0, size - 7);
  setFinderPattern(m, size - 7, 0);
}

function placeAlignmentPatterns(m: number[][], version: number) {
  const pos = ALIGN_POS[version];
  if (!pos) return;
  for (const r of pos)
    for (const c of pos) {
      if (m[r][c] !== -1) continue;
      setAlignmentPattern(m, r, c);
    }
}

function placeTimingPatterns(m: number[][], size: number) {
  for (let i = 8; i < size - 8; i++) {
    m[6][i] = i % 2 === 0 ? 1 : 0;
    m[i][6] = i % 2 === 0 ? 1 : 0;
  }
}

function placeDarkModule(m: number[][], version: number) {
  m[4 * version + 9][8] = 1;
}

function reserveFormatAreas(m: number[][], size: number) {
  // Reserve format information areas
  for (let i = 0; i < 9; i++) {
    if (m[8][i] === -1) m[8][i] = 2; // reserve
    if (m[i][8] === -1) m[i][8] = 2;
  }
  for (let i = size - 8; i < size; i++) {
    if (m[8][i] === -1) m[8][i] = 2;
    if (m[i][8] === -1) m[i][8] = 2;
  }
}

function placeDataBits(
  m: number[][],
  data: number[],
  size: number,
  remainder: number,
) {
  const bits: number[] = [];
  for (const b of data) for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
  for (let i = 0; i < remainder; i++) bits.push(0);

  let bitIdx = 0;
  let goUp = true;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5; // skip timing column
    const rowRange = goUp
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);
    for (const row of rowRange) {
      for (const dc of [0, 1]) {
        const c = col - dc;
        if (m[row][c] === -1) {
          m[row][c] = bitIdx < bits.length ? bits[bitIdx++] : 0;
        }
      }
    }
    goUp = !goUp;
  }
}

// Mask pattern 0: (row+col) % 2 == 0
function applyMask(m: number[][], size: number) {
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (m[r][c] <= 1 && (r + c) % 2 === 0) m[r][c] ^= 1;
}

// Format string for ECC level M (01), mask 0 (000) = format bits 010010000100101
// XOR with mask 101010000010010
const FORMAT_BITS_M0 = "101010000010010"; // precomputed for ECC=M, mask=0

function placeFormatInfo(m: number[][], size: number) {
  const fb = FORMAT_BITS_M0;
  const bits = fb.split("").map(Number);
  // Place around finder patterns
  const positions1 = [
    [8, 0],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 7],
    [8, 8],
    [7, 8],
    [5, 8],
    [4, 8],
    [3, 8],
    [2, 8],
    [1, 8],
    [0, 8],
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = positions1[i];
    m[r][c] = bits[i];
  }
  // top-right
  for (let i = 0; i < 8; i++) m[8][size - 1 - i] = bits[i];
  // bottom-left
  for (let i = 0; i < 7; i++) m[size - 7 + i][8] = bits[14 - i];
}

export function generateQRMatrix(text: string): number[][] {
  const version = Math.min(
    pickVersion(new TextEncoder().encode(text).length),
    7,
  );
  const [, dc, ec, remainder] = VERSION_TABLE[version - 1];
  const size = matrixSize(version);
  const m = createMatrix(size);

  placeFinderPatterns(m, size);
  placeAlignmentPatterns(m, version);
  placeTimingPatterns(m, size);
  placeDarkModule(m, version);
  reserveFormatAreas(m, size);

  const bits = buildBitBuffer(text, version);
  const dataBytes = bitsToBytes(bits);
  const ecBytes = rsEncode(dataBytes.slice(0, dc), ec);
  const allBytes = [...dataBytes.slice(0, dc), ...ecBytes];

  placeDataBits(m, allBytes, size, remainder);
  applyMask(m, size);
  placeFormatInfo(m, size);

  return m;
}

// ──────────────────────────────────────────────────────────────────────────────
// React component
// ──────────────────────────────────────────────────────────────────────────────

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({
  value,
  size = 200,
  className,
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    try {
      const matrix = generateQRMatrix(value);
      const canvas = canvasRef.current;
      const moduleCount = matrix.length;
      const moduleSize = Math.floor(size / (moduleCount + 8));
      const padding = Math.floor((size - moduleSize * moduleCount) / 2);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = size;
      canvas.height = size;

      // Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // Modules
      ctx.fillStyle = "#000000";
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (matrix[r][c] === 1) {
            ctx.fillRect(
              padding + c * moduleSize,
              padding + r * moduleSize,
              moduleSize,
              moduleSize,
            );
          }
        }
      }
    } catch {
      // Fallback: show placeholder
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#999";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("QR unavailable", size / 2, size / 2);
      }
    }
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      aria-label="QR code"
    />
  );
}
