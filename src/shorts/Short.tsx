import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Grain} from '../components/primitives';
import {clamp01, easeIn, easeOut, prog, sp} from '../lib';

// Vertical short (1080×1920) cut from a 16:9 episode: the episode plays full-width in a
// card, hook title above, word-by-word Arabic captions below, CTA card at the end.
// Everything comes from props written by scripts/short.mjs; times are in seconds.

type Word = {text: string; t0: number; t1: number; emph: boolean};
type Page = {t0: number; t1: number; words: Word[]};
type Seg = {from: number; src0: number; src1: number; dur: number};
type Brand = {
  name: string;
  logo: string | null;
  bg: string;
  bgDeep: string;
  accent: string;
  red: string;
  text: string;
  muted: string;
};

export type ShortProps = {
  id: string;
  fps: number;
  durationSec: number;
  source: string;
  sfx: string | null;
  brand: Brand;
  cta: {line1: string; line2: string; button: string};
  title: string;
  kicker: string;
  segments: Seg[];
  pages: Page[];
  speechEnd: number;
  ctaAt: number;
};

const AR = '"Cairo", "Geeza Pro", system-ui, sans-serif';

// Layout (px on the 1080×1920 canvas). Shorts/Reels UI covers roughly the top 140 px and
// the bottom 320 px, so everything that must be read sits between them.
const CARD = {x: 40, y: 660, w: 1000, h: 562.5};
const BAR_Y = CARD.y + CARD.h + 28;
const CAPTION_Y = 1300;

const SETTLE = {damping: 16, stiffness: 170, mass: 0.7};
const POP = {damping: 10, stiffness: 220, mass: 0.7};

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

const useCairo = () => {
  const [handle] = useState(() => delayRender('cairo'));
  useEffect(() => {
    Promise.all(
      ['900 80px Cairo', '700 40px Cairo'].flatMap((f) => [
        document.fonts.load(f, 'اختبار'),
        document.fonts.load(f, 'Airbnb 2025'),
      ]),
    ).then(() => continueRender(handle));
  }, [handle]);
};

const parseTitle = (s: string) => {
  const out: {text: string; accent: boolean}[] = [];
  s.split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .forEach((part) => {
      const accent = part.startsWith('*');
      part
        .replace(/\*/g, '')
        .split(/\s+/)
        .filter(Boolean)
        .forEach((text) => {
          // Keep runs of Latin words in one span so RTL doesn't reverse them.
          const prev = out[out.length - 1];
          if (prev && /^[؟?!.…،,:]+$/.test(text)) {
            prev.text += text; // punctuation sticks to the word before it
            return;
          }
          const latin = /^[A-Za-z0-9.&'’-]+$/;
          if (prev && prev.accent === accent && latin.test(prev.text.replace(/ /g, '')) && latin.test(text)) {
            prev.text += ` ${text}`;
          } else out.push({text, accent});
        });
    });
  return out;
};

const Backdrop: React.FC<{t: number; brand: Brand}> = ({t, brand}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill
      style={{background: `linear-gradient(180deg, ${brand.bg} 0%, ${brand.bgDeep} 100%)`}}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 30% at 50% 22%, ${rgba(
            brand.accent,
            0.07,
          )} 0%, ${rgba(brand.accent, 0)} 70%)`,
        }}
      />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern
            id="shortDots"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${-t * 4} ${-t * 6})`}
          >
            <circle cx="20" cy="20" r="1.2" fill="rgba(255,255,255,0.07)" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#shortDots)" />
      </svg>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const Header: React.FC<{t: number; brand: Brand; kicker: string}> = ({t, brand, kicker}) => {
  const k = prog(t, 0.05, 0.6, easeOut);
  return (
    <div
      style={{
        position: 'absolute',
        top: 168,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 22,
        opacity: 0.4 + 0.6 * k,
      }}
    >
      {brand.logo ? (
        <Img src={staticFile(brand.logo)} style={{height: 64}} />
      ) : (
        <div
          style={{
            fontFamily: AR,
            fontSize: 30,
            letterSpacing: '0.2em',
            color: brand.muted,
            fontWeight: 700,
          }}
        >
          {brand.name.toUpperCase()}
        </div>
      )}
      {kicker ? (
        <div
          dir="rtl"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: AR,
            fontWeight: 700,
            fontSize: 34,
            color: brand.text,
            opacity: 0.8,
          }}
        >
          <div style={{width: 12, height: 12, borderRadius: 6, background: brand.red}} />
          {kicker}
        </div>
      ) : null}
    </div>
  );
};

const Title: React.FC<{frame: number; fps: number; brand: Brand; title: string}> = ({
  frame,
  fps,
  brand,
  title,
}) => {
  const t = frame / fps;
  const words = parseTitle(title);
  const under = prog(t, 0.3, 0.85, easeOut);
  return (
    <div
      dir="rtl"
      style={{
        position: 'absolute',
        top: 330,
        left: 60,
        right: 60,
        height: 290,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        columnGap: 24,
        fontFamily: AR,
        fontWeight: 900,
        fontSize: 92,
        lineHeight: 1.32,
        color: brand.text,
      }}
    >
      {words.map((w, i) => {
        const k = sp(frame, i * 0.035, SETTLE, fps);
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              color: w.accent ? brand.accent : brand.text,
              transform: `translateY(${(1 - k) * 24}px)`,
            }}
          >
            {w.accent ? (
              <span
                style={{
                  position: 'absolute',
                  left: -6,
                  right: -6,
                  bottom: 14,
                  height: 18,
                  borderRadius: 4,
                  background: rgba(brand.accent, 0.22),
                  transform: `scaleX(${under})`,
                  transformOrigin: 'right center',
                }}
              />
            ) : null}
            <span style={{position: 'relative'}}>{w.text}</span>
          </span>
        );
      })}
    </div>
  );
};

const SegVideo: React.FC<{seg: Seg; index: number; source: string; fps: number}> = ({
  seg,
  index,
  source,
  fps,
}) => {
  const f = useCurrentFrame();
  const n = Math.round(seg.dur * fps);
  // Slow push-in through the segment; a small punch when we jump to a new part.
  const scale = 1 + 0.035 * (f / n) + (index > 0 ? 0.045 * Math.exp(-f / 5) : 0);
  const flash = index > 0 ? 0.22 * Math.exp(-f / 2.5) : 0;
  const fadeN = 4;
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(source)}
        trimBefore={Math.round(seg.src0 * fps)}
        volume={(v) => (v >= n ? 0 : clamp01(Math.min(v / fadeN, (n - v) / fadeN, 1)))}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

const Captions: React.FC<{frame: number; fps: number; brand: Brand; pages: Page[]}> = ({
  frame,
  fps,
  brand,
  pages,
}) => {
  const t = frame / fps;
  const page = pages.find((p) => t >= p.t0 && t < p.t1);
  if (!page) return null;
  const out = prog(t, page.t1 - 0.1, page.t1, easeIn);
  return (
    <div
      dir="rtl"
      style={{
        position: 'absolute',
        top: CAPTION_Y,
        left: 50,
        right: 50,
        height: 220,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        columnGap: 22,
        fontFamily: AR,
        fontWeight: 900,
        fontSize: 82,
        lineHeight: 1.3,
        opacity: 1 - out,
      }}
    >
      {page.words.map((w, i) => {
        const kin = prog(t, page.t0 + i * 0.045, page.t0 + i * 0.045 + 0.22, easeOut);
        const next = page.words[i + 1];
        const active = t >= w.t0 && (next ? t < next.t0 : true);
        const pop = active ? sp(frame, w.t0, POP, fps) : 0;
        return (
          <span
            key={`${page.t0}-${i}`}
            style={{
              display: 'inline-block',
              color: active ? brand.accent : brand.text,
              opacity: kin * (t >= w.t0 ? 1 : 0.7),
              transform: `translateY(${(1 - kin) * 36}px) scale(${1 + 0.07 * pop * (1 - pop * 0.4)})`,
              textShadow: '0 6px 24px rgba(0,0,0,0.55)',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const Cta: React.FC<{frame: number; fps: number; at: number; brand: Brand; cta: ShortProps['cta']}> = ({
  frame,
  fps,
  at,
  brand,
  cta,
}) => {
  if (frame / fps < at + 0.3) return null;
  // Starts once the card has mostly left, so the two never share the frame.
  const k = (i: number, cfg = SETTLE) => sp(frame, at + 0.38 + i * 0.09, cfg, fps);
  const item = (i: number): React.CSSProperties => ({
    opacity: clamp01(k(i) * 1.4),
    transform: `translateY(${(1 - k(i)) * 40}px)`,
  });
  const btn = k(3, POP);
  return (
    <div
      dir="rtl"
      style={{
        position: 'absolute',
        top: CARD.y - 10,
        left: 60,
        right: 60,
        height: CARD.h + 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        fontFamily: AR,
        color: brand.text,
        textAlign: 'center',
      }}
    >
      <div style={{...item(0), fontWeight: 900, fontSize: 80, lineHeight: 1.25}}>{cta.line1}</div>
      <div style={{...item(1), fontWeight: 700, fontSize: 40, color: brand.muted, lineHeight: 1.4}}>
        {cta.line2}
      </div>
      <div
        style={{
          opacity: clamp01(btn * 1.5),
          transform: `scale(${0.6 + 0.4 * btn})`,
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '20px 52px',
          borderRadius: 999,
          background: brand.accent,
          color: brand.bgDeep,
          fontWeight: 900,
          fontSize: 48,
          boxShadow: `0 18px 50px ${rgba(brand.accent, 0.3)}`,
        }}
      >
        <svg width="34" height="38" viewBox="0 0 34 38" style={{transform: 'scaleX(-1)'}}>
          <path d="M4 3 L31 19 L4 35 Z" fill={brand.bgDeep} />
        </svg>
        {cta.button}
      </div>
    </div>
  );
};

export const Short: React.FC<ShortProps> = (p) => {
  useCairo();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const exit = prog(t, p.ctaAt, p.ctaAt + 0.35, easeIn);
  const fill = clamp01(t / p.speechEnd);
  const last = p.segments.length - 1;

  return (
    <AbsoluteFill style={{background: p.brand.bgDeep}}>
      <Backdrop t={t} brand={p.brand} />
      <Header t={t} brand={p.brand} kicker={p.kicker} />
      <Title frame={frame} fps={fps} brand={p.brand} title={p.title} />

      <div
        style={{
          position: 'absolute',
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: 28,
          overflow: 'hidden',
          background: '#000',
          border: '2px solid rgba(255,255,255,0.10)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
          opacity: 1 - exit,
          transform: `translateY(${-30 * exit}px) scale(${1 - 0.06 * exit})`,
        }}
      >
        {p.segments.map((seg, i) => (
          <Sequence
            key={i}
            from={Math.round(seg.from * fps)}
            // The last segment keeps its picture (muted) while the card leaves.
            durationInFrames={Math.round((seg.dur + (i === last ? 0.6 : 0)) * fps)}
          >
            <SegVideo seg={seg} index={i} source={p.source} fps={fps} />
          </Sequence>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          top: BAR_Y,
          left: CARD.x,
          width: CARD.w,
          height: 8,
          borderRadius: 4,
          background: 'rgba(255,255,255,0.12)',
          opacity: 1 - exit,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: `${fill * 100}%`,
            background: p.brand.accent,
            borderRadius: 4,
          }}
        />
      </div>

      <div style={{opacity: 1 - exit}}>
        <Captions frame={frame} fps={fps} brand={p.brand} pages={p.pages} />
      </div>

      <Cta frame={frame} fps={fps} at={p.ctaAt} brand={p.brand} cta={p.cta} />

      {p.sfx ? <Audio src={staticFile(p.sfx)} volume={0.9} /> : null}
      <Grain frame={frame} opacity={0.05} />
    </AbsoluteFill>
  );
};

export const SHORT_DEFAULTS: ShortProps = {
  id: 'preview',
  fps: 30,
  durationSec: 6,
  source: 'source.mp4',
  sfx: null,
  brand: {
    name: 'MISHIRY Studio',
    logo: null,
    bg: '#2B3238',
    bgDeep: '#1E2329',
    accent: '#F5C518',
    red: '#E5262B',
    text: '#FFFFFF',
    muted: 'rgba(255,255,255,0.62)',
  },
  cta: {line1: 'الحلقة كاملة على القناة', line2: 'شغّل npm run short -- E01 1 --prep', button: 'شاهد الحلقة'},
  title: 'عنوان *تجريبي* للشورت',
  kicker: 'Pitch Deck · 2008 vs 2025',
  segments: [{from: 0, src0: 0, src1: 3, dur: 3}],
  pages: [],
  speechEnd: 3,
  ctaAt: 3,
};
