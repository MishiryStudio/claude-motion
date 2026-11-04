import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import {clamp01, easeIn, easeInOut, easeOut, lerp, prog, rand, sp} from '../lib';
import {AR, Brand, LATIN, parseTitle, rgba, SETTLE} from '../shorts/Short';

// Building blocks for the MISHIRY reels: kinetic, rebuilt-in-code shorts (no footage on
// screen). Every helper takes seconds and is a pure function of the frame.

export const SHARDS = ['#E12127', '#EF9121', '#FFCD09'];
export const FAST = {damping: 18, stiffness: 210, mass: 0.7};
export const SNAP = {damping: 12, stiffness: 260, mass: 0.6};

/** Spring progress plus its per-frame change, for velocity-driven motion blur. */
export const fly = (frame: number, fps: number, at: number, cfg = SETTLE) => {
  const k = sp(frame, at, cfg, fps);
  return {k, v: k - sp(frame - 1, at, cfg, fps)};
};
/** Blur in px for something that travels `dist` px with spring velocity `v`. */
export const mblur = (v: number, dist: number) => Math.min(24, Math.abs(v * dist) * 0.35);
const blurCss = (b: number) => (b > 0.4 ? `blur(${b.toFixed(1)}px)` : undefined);

/** Decaying kick after each time in `at` (camera punch, shake). */
export const kick = (t: number, at: number[], decay = 9) =>
  at.reduce((s, p) => (t >= p ? s + Math.exp(-(t - p) * decay) : s), 0);

/** Which entry of a [time, value][] list is active, and how long since it started. */
export const active = <T,>(t: number, list: [number, T][]) => {
  let i = 0;
  list.forEach(([at], j) => {
    if (t >= at) i = j;
  });
  return {i, since: t - list[i][0], item: list[i][1]};
};

export const Backdrop: React.FC<{t: number; brand: Brand; glow?: number}> = ({t, brand, glow = 0}) => {
  const {width, height} = useVideoConfig();
  const cx = width / 2;
  const cy = 900;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 120% 80% at 50% 45%, ${brand.bg} 0%, ${brand.bgDeep} 100%)`}}>
      {/* Concentric rings and spokes, as on the brand card. */}
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.55}}>
        <g transform={`rotate(${t * 2} ${cx} ${cy})`}>
          {[180, 320, 470, 640, 840].map((r) => (
            <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1.5} />
          ))}
          {Array.from({length: 12}).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={cx + Math.cos(a) * 180}
                y1={cy + Math.sin(a) * 180}
                x2={cx + Math.cos(a) * 1300}
                y2={cy + Math.sin(a) * 1300}
                stroke="rgba(255,255,255,0.035)"
                strokeWidth={1.5}
              />
            );
          })}
          <circle cx={cx} cy={cy} r={470} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} strokeDasharray="2 14" />
        </g>
      </svg>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 47%, ${rgba(brand.accent, 0.05 + 0.1 * glow)} 0%, rgba(0,0,0,0) 45%)`,
        }}
      />
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)'}}
      />
    </AbsoluteFill>
  );
};

/** Whole-stage camera: slow 3D drift, plus punch-in and shake on hits. */
export const Camera: React.FC<{t: number; punch: number; shake?: number; children: React.ReactNode}> = ({
  t,
  punch,
  shake = 0,
  children,
}) => {
  const sx = shake * (rand(Math.floor(t * 30)) - 0.5) * 26;
  const sy = shake * (rand(Math.floor(t * 30) + 99) - 0.5) * 26;
  return (
    <AbsoluteFill style={{perspective: 1900}}>
      <AbsoluteFill
        style={{
          transform: `translate(${sx}px, ${sy}px) rotateX(${Math.sin(t * 0.35) * 2.5}deg) rotateY(${
            Math.cos(t * 0.27) * 3.5
          }deg) scale(${1 + 0.035 * punch})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A scene that whips in (zoom up from behind, blurred) and whips out (zoom past camera). */
export const Scene: React.FC<{t: number; from: number; to: number; children: React.ReactNode}> = ({
  t,
  from,
  to,
  children,
}) => {
  if (t < from - 0.02 || t > to + 0.22) return null;
  const inK = prog(t, from, from + 0.3, easeOut);
  const outK = prog(t, to, to + 0.2, easeIn);
  const scale = (0.84 + 0.16 * inK) * (1 + 0.28 * outK);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        filter: blurCss(18 * (1 - inK) + 20 * outK),
        opacity: clamp01(inK * 1.8) * (1 - outK),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Signature transition: three logo-coloured ribbons tearing across the frame. */
export const Ribbons: React.FC<{t: number; at: number; dir?: 1 | -1; tilt?: number}> = ({
  t,
  at,
  dir = 1,
  tilt = -16,
}) => {
  if (t < at - 0.05 || t > at + 0.8) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', transform: `rotate(${tilt}deg)`}}>
      {SHARDS.map((c, i) => {
        const k = prog(t, at + i * 0.06, at + i * 0.06 + 0.5, easeInOut);
        const k0 = prog(t - 1 / 30, at + i * 0.06, at + i * 0.06 + 0.5, easeInOut);
        const x = lerp(-1900, 1900, k) * dir;
        const h = [96, 74, 56][i];
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: -310,
              top: 860 + (i - 1) * 150,
              width: 1700,
              height: h,
              transform: `translateX(${x}px) skewX(${-28 * dir}deg)`,
              background: `linear-gradient(${dir > 0 ? 90 : 270}deg, ${rgba(c, 0)} 0%, ${rgba(c, 0.85)} 55%, ${c} 100%)`,
              filter: blurCss(Math.min(10, Math.abs(k - k0) * 3800 * 0.004)),
              borderRadius: 6,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** The MISHIRY mark built from its three pieces; each arrives with a fading trail. */
export const MarkBuild: React.FC<{frame: number; fps: number; at: number; parts: string[]; size: number}> = ({
  frame,
  fps,
  at,
  parts,
  size,
}) => {
  const w = (size * 416) / 460;
  return (
    <div style={{position: 'relative', width: w, height: size}}>
      {parts.map((src, i) => {
        const {k} = fly(frame, fps, at + i * 0.07, FAST);
        const dx = [-1, 1, -1][i] * 420 * (1 - k);
        const dy = [-0.4, 0, 0.5][i] * 300 * (1 - k);
        return [3, 2, 1, 0].map((j) => (
          <Img
            key={`${i}-${j}`}
            src={staticFile(src)}
            style={{
              position: 'absolute',
              inset: 0,
              width: w,
              height: size,
              opacity: j === 0 ? clamp01(k * 3) : clamp01(k * 3) * (1 - k) * (0.55 / j),
              transform: `translate(${dx * (1 + j * 0.22)}px, ${dy * (1 + j * 0.22)}px)`,
            }}
          />
        ));
      })}
    </div>
  );
};

/** Expanding ring from a point, one per hit. */
export const Pulse: React.FC<{t: number; at: number[]; x: number; y: number; r: number; color: string}> = ({
  t,
  at,
  x,
  y,
  r,
  color,
}) => (
  <>
    {at
      .filter((p) => t >= p && t < p + 0.8)
      .map((p) => {
        const k = prog(t, p, p + 0.8, easeOut);
        const rr = r * (1 + 1.8 * k);
        return (
          <div
            key={p}
            style={{
              position: 'absolute',
              left: x - rr,
              top: y - rr,
              width: rr * 2,
              height: rr * 2,
              borderRadius: '50%',
              border: `${4 * (1 - k) + 1}px solid ${color}`,
              opacity: 0.9 * (1 - k),
            }}
          />
        );
      })}
  </>
);

/** Top headline: swaps word by word with blur at each entry of `list`. */
export const Headline: React.FC<{t: number; list: [number, string][]; brand: Brand; top?: number; holdFirst?: boolean}> = ({
  t,
  list,
  brand,
  top = 300,
  holdFirst = false,
}) => {
  const {i, since} = active(t, list);
  const next = list[i + 1];
  const out = next ? prog(t, next[0] - 0.16, next[0], easeIn) : 0;
  const words = parseTitle(list[i][1]);
  return (
    <div
      dir="rtl"
      style={{
        position: 'absolute',
        top,
        left: 50,
        right: 50,
        height: 210,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        columnGap: 22,
        fontFamily: AR,
        fontWeight: 900,
        fontSize: 78,
        lineHeight: 1.3,
        color: brand.text,
      }}
    >
      {words.map((w, j) => {
        // The first headline can be fully set on frame 0: it is the thumbnail.
        const k = holdFirst && i === 0 ? 1 : prog(since, j * 0.06, j * 0.06 + 0.32, easeOut);
        return (
          <span
            key={`${i}-${j}`}
            style={{
              display: 'inline-block',
              color: w.accent ? brand.accent : brand.text,
              opacity: k * (1 - out),
              transform: `translateY(${(1 - k) * 34 - out * 26}px) scale(${1 + 0.12 * (1 - k)})`,
              filter: blurCss(12 * (1 - k) + 10 * out),
              textShadow: '0 8px 30px rgba(0,0,0,0.45)',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/** A number that rolls from `from` to `to` between t0 and t1. */
export const rollTo = (t: number, t0: number, t1: number, from: number, to: number) =>
  Math.round(lerp(from, to, prog(t, t0, t1, easeOut)));

/** Rubber-stamp label that slams in. */
export const Stamp: React.FC<{
  frame: number;
  fps: number;
  at: number;
  text: string;
  color: string;
  size?: number;
  rotate?: number;
}> = ({frame, fps, at, text, color, size = 40, rotate = -10}) => {
  if (frame / fps < at) return null;
  const k = sp(frame, at, SNAP, fps);
  return (
    <div
      dir="rtl"
      style={{
        padding: `${size * 0.15}px ${size * 0.45}px`,
        border: `${Math.max(3, size * 0.1)}px solid ${color}`,
        borderRadius: size * 0.25,
        color,
        fontFamily: AR,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.25,
        whiteSpace: 'nowrap',
        background: 'rgba(20,22,26,0.55)',
        opacity: clamp01(k * 3),
        transform: `rotate(${rotate}deg) scale(${2.4 - 1.4 * k})`,
        boxShadow: `0 0 ${30 * (1 - k)}px ${rgba(color.startsWith('#') ? color : '#E12127', 0.6)}`,
      }}
    >
      {text}
    </div>
  );
};

export const Chip: React.FC<{text: string; color: string; brand: Brand; size?: number}> = ({
  text,
  color,
  brand,
  size = 34,
}) => (
  <div
    dir="rtl"
    style={{
      padding: `${size * 0.32}px ${size * 0.7}px`,
      borderRadius: 999,
      background: 'rgba(58,64,73,0.92)',
      border: `2px solid ${rgba(color, 0.7)}`,
      color: brand.text,
      fontFamily: AR,
      fontWeight: 700,
      fontSize: size,
      whiteSpace: 'nowrap',
      boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
    }}
  >
    {text}
  </div>
);

export const Num: React.FC<{value: number | string; size: number; color: string; style?: React.CSSProperties}> = ({
  value,
  size,
  color,
  style,
}) => (
  <div
    style={{
      fontFamily: LATIN,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1,
      color,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.03em',
      ...style,
    }}
  >
    {value}
  </div>
);

export const blur = blurCss;
export {easeIn, easeInOut, easeOut, prog, clamp01, lerp, sp};
