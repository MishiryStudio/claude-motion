import React from 'react';
import {AR, Brand, LATIN, rgba, ShortProps} from '../shorts/Short';
import {
  at,
  blur,
  clamp01,
  easeIn,
  easeInOut,
  easeOut,
  fly,
  FAST,
  Glitch,
  lerp,
  mblur,
  Num,
  POSE,
  Pose,
  prog,
  ReelShell,
  rollTo,
  Scene,
  SHARDS,
  sp,
  Stamp,
  SNAP,
} from './kit';

// E01 short 3: "don't write this sentence in your deck" (competition). Voice from the
// episode; every visual rebuilt in code on the words in reels/E01-3.beats.json.

type Beats = {
  scenes: {intro: number; criterion: number; airbnb: number; bluejay: number; meeting: number; one: number; dont: number; fix: number; cta: number};
  headlines: [number, string][];
  intro: {ribbons: number; mark: number};
  criterion: {six: number};
  airbnb: {panel: number; axes: number; dots: number; corner: number; score: number};
  bluejay: {vanish: number; zero: number; write: number; type: number; typed: number};
  meeting: {bubble: number; ask: number; crack: number};
  one: {score: number};
  dont: {card: number; strike: number; stamp: number};
  fix: {slide: number; mid: number; count: number; plus: number};
  pulses: number[];
  shake: number[];
  ctaHold: number;
};
export type Reel3Props = ShortProps & {beats: Beats};

const ORANGE = SHARDS[1];
const RED = SHARDS[0];
const PANEL = '#3A4049';
const LINE = 'أول شركة في العالم';
type Ctx = {frame: number; fps: number; t: number; b: Beats; brand: Brand};

const Figure: React.FC<{n: React.ReactNode; label: string; size: number; color: string; brand: Brand}> = ({n, label, size, color, brand}) => (
  <div dir="rtl" style={{display: 'flex', alignItems: 'baseline', gap: size * 0.18, whiteSpace: 'nowrap'}}>
    <Num value={n as number} size={size} color={color} />
    <div style={{fontFamily: AR, fontWeight: 900, fontSize: size * 0.42, color: brand.text}}>{label}</div>
  </div>
);

/** The slide line from the Bluejay deck, optionally typed, struck through or cracked. */
const QuoteCard: React.FC<{brand: Brand; chars?: number; strike?: number; crossed?: boolean}> = ({brand, chars, strike = 0, crossed}) => {
  const text = chars === undefined ? LINE : LINE.slice(0, chars);
  return (
    <div style={{width: 860, padding: '54px 40px 46px', boxSizing: 'border-box', borderRadius: 34, background: '#F4F2EE', boxShadow: '0 30px 80px rgba(0,0,0,0.45)', position: 'relative'}}>
      <div style={{position: 'absolute', left: 32, top: 22, fontFamily: LATIN, fontWeight: 800, fontSize: 26, color: '#4A5361'}}>Bluejay · 2025</div>
      <div dir="rtl" style={{textAlign: 'center', fontFamily: AR, fontWeight: 900, fontSize: 84, color: '#20252B', minHeight: 120, position: 'relative', whiteSpace: 'nowrap'}}>
        {text}
        {chars !== undefined && chars < LINE.length ? <span style={{display: 'inline-block', width: 6, height: 90, background: RED, marginRight: 8, verticalAlign: 'middle'}} /> : null}
        {strike > 0 ? (
          <div style={{position: 'absolute', right: 40, top: '52%', height: 16, width: `${(860 - 160) * strike}px`, background: RED, borderRadius: 8, transform: 'rotate(-3deg)'}} />
        ) : null}
      </div>
      {crossed ? (
        <svg width={170} height={170} viewBox="0 0 170 170" style={{position: 'absolute', right: -50, top: -70}}>
          <circle cx={85} cy={85} r={78} fill={RED} />
          <path d="M52 52 L118 118 M118 52 L52 118" stroke="#fff" strokeWidth={18} strokeLinecap="round" />
        </svg>
      ) : null}
    </div>
  );
};

const Hook: React.FC<{t: number; at0: number; brand: Brand}> = ({t, at0, brand}) => {
  const k = prog(t, at0, at0 + 0.4, easeIn);
  if (k >= 1) return null;
  return (
    <div style={at(540, 800, {transform: `translate(-50%,-50%) rotate(-4deg) scale(${1 + 0.5 * k})`, filter: blur(24 * k), opacity: 1 - k})}>
      <QuoteCard brand={brand} strike={1} crossed />
    </div>
  );
};

const Dots5: React.FC<{frame: number; fps: number; at0: number; filled: number; color: string; y: number}> = ({frame, fps, at0, filled, color, y}) => (
  <>
    {[0, 1, 2, 3, 4].map((i) => {
      const k = i < filled ? sp(frame, at0 + i * 0.09, SNAP, fps) : 0;
      return (
        <div key={i} style={at(748 - i * 104, y, {width: 76, height: 76, borderRadius: 38, border: `4px solid ${i < filled ? color : 'rgba(255,255,255,0.18)'}`, boxSizing: 'border-box'})}>
          <div style={{width: '100%', height: '100%', borderRadius: 38, background: color, transform: `scale(${k})`}} />
        </div>
      );
    })}
  </>
);

const Criterion: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const lit = sp(frame, b.criterion.six, SNAP, fps);
  return (
    <>
      {Array.from({length: 9}).map((_, i) => {
        const e = fly(frame, fps, b.scenes.criterion + i * 0.04, FAST);
        const six = i === 5;
        return (
          <div
            key={i}
            style={at(940 - i * 100, 880 - (six ? 40 * lit : 0), {
              width: 80,
              height: 80,
              borderRadius: 22,
              background: six && lit > 0.5 ? brand.accent : PANEL,
              border: `3px solid ${six ? brand.accent : 'rgba(255,255,255,0.12)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: clamp01(e.k * 2),
              transform: `translate(-50%,-50%) translateY(${120 * (1 - e.k)}px) scale(${six ? 1 + 0.35 * lit : 1})`,
              fontFamily: LATIN,
              fontWeight: 900,
              fontSize: 40,
              color: six && lit > 0.5 ? brand.bgDeep : 'rgba(255,255,255,0.55)',
            })}
          >
            {i + 1}
          </div>
        );
      })}
      <div style={at(540, 1100, {opacity: clamp01(lit * 2), transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * lit})`, fontFamily: AR, fontWeight: 900, fontSize: 120, color: brand.text})}>المنافسين</div>
    </>
  );
};

/** The usual 2x2 competitor matrix, drawn on the beat. */
const Matrix: React.FC<{frame: number; fps: number; t: number; axes: number; dots: number; corner: number; vanish?: number; brand: Brand; hero?: boolean; scale?: number}> = ({
  frame,
  fps,
  t,
  axes,
  dots,
  corner,
  vanish,
  brand,
  hero = true,
  scale = 1,
}) => {
  const size = 760;
  const ax = prog(t, axes, axes + 0.5, easeInOut);
  const others = [
    {x: -0.55, y: 0.5},
    {x: 0.45, y: 0.6},
    {x: -0.6, y: -0.45},
    {x: -0.25, y: 0.2},
    {x: 0.2, y: 0.35},
  ];
  const h = sp(frame, corner, {damping: 11, stiffness: 160, mass: 0.8}, fps);
  return (
    <div style={at(540, 900, {width: size, height: size, transform: `translate(-50%,-50%) scale(${scale})`, borderRadius: 40, background: rgba(PANEL, 0.7), border: '2px solid rgba(255,255,255,0.08)'})}>
      <svg width={size} height={size} style={{position: 'absolute', inset: 0}}>
        <line x1={size / 2} y1={size / 2} x2={size / 2} y2={size / 2 - (size / 2 - 50) * ax} stroke="rgba(255,255,255,0.5)" strokeWidth={5} />
        <line x1={size / 2} y1={size / 2} x2={size / 2} y2={size / 2 + (size / 2 - 50) * ax} stroke="rgba(255,255,255,0.5)" strokeWidth={5} />
        <line x1={size / 2} y1={size / 2} x2={size / 2 - (size / 2 - 50) * ax} y2={size / 2} stroke="rgba(255,255,255,0.5)" strokeWidth={5} />
        <line x1={size / 2} y1={size / 2} x2={size / 2 + (size / 2 - 50) * ax} y2={size / 2} stroke="rgba(255,255,255,0.5)" strokeWidth={5} />
      </svg>
      {others.map((o, i) => {
        const k = sp(frame, dots + i * 0.07, SNAP, fps);
        const gone = vanish === undefined ? 0 : prog(t, vanish + i * 0.1, vanish + i * 0.1 + 0.2, easeIn);
        return (
          <div
            key={i}
            style={at(size / 2 + o.x * (size / 2 - 60), size / 2 + o.y * (size / 2 - 60), {
              width: 64,
              height: 64,
              borderRadius: 32,
              background: `hsl(210,9%,${50 + i * 4}%)`,
              transform: `translate(-50%,-50%) scale(${k * (1 + 0.6 * gone)})`,
              opacity: 1 - gone,
              filter: blur(10 * gone),
            })}
          />
        );
      })}
      {hero ? (
        <>
          <div style={at(size / 2 + 0.62 * (size / 2 - 60), size / 2 - 0.62 * (size / 2 - 60), {width: 96, height: 96, borderRadius: 48, background: ORANGE, boxShadow: `0 0 ${60 * h}px ${rgba(ORANGE, 0.8)}`, transform: `translate(-50%,-50%) scale(${h})`})} />
          <div style={at(size / 2 + 0.62 * (size / 2 - 60), size / 2 - 0.62 * (size / 2 - 60) + 90, {fontFamily: LATIN, fontWeight: 900, fontSize: 40, color: brand.text, opacity: h})}>Airbnb</div>
        </>
      ) : null}
    </div>
  );
};

const Airbnb: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const a = b.airbnb;
  const panel = sp(frame, a.panel, FAST, fps);
  const sc = prog(t, a.score - 0.3, a.score + 0.2, easeInOut);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: clamp01(panel * 2), transform: `translateY(${-210 * sc}px) scale(${lerp(0.92, 0.7, sc) + 0.08 * panel})`}}>
        <Matrix frame={frame} fps={fps} t={t} axes={a.axes} dots={a.dots} corner={a.corner} brand={brand} />
      </div>
      {t >= a.score - 0.2 ? (
        <>
          <Dots5 frame={frame} fps={fps} at0={a.score} filled={3} color={ORANGE} y={1200} />
          <div style={at(540, 1320, {opacity: prog(t, a.score, a.score + 0.3, easeOut)})}>
            <Figure n={3} label="من 5" size={110} color={ORANGE} brand={brand} />
          </div>
        </>
      ) : null}
    </>
  );
};

const Bluejay: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const j = b.bluejay;
  const zero = sp(frame, j.zero, SNAP, fps);
  const away = prog(t, j.write - 0.1, j.write + 0.3, easeIn);
  const card = fly(frame, fps, j.write, FAST);
  const chars = Math.round(LINE.length * prog(t, j.type, j.typed, (x) => x));
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - away, filter: blur(14 * away), transform: `scale(${1 - 0.2 * away})`}}>
        <div style={{position: 'absolute', inset: 0, opacity: 1 - 0.8 * zero, filter: blur(8 * zero)}}>
        <Matrix frame={frame} fps={fps} t={t} axes={b.scenes.bluejay - 0.6} dots={b.scenes.bluejay - 0.5} corner={0} vanish={j.vanish} brand={brand} hero={false} scale={0.85} />
        </div>
        {t >= j.zero ? (
          <div style={at(540, 900, {transform: `translate(-50%,-50%) scale(${2 - zero})`, opacity: clamp01(zero * 2)})}>
            <Figure n={0} label="منافسين" size={190} color={RED} brand={brand} />
          </div>
        ) : null}
      </div>
      {t >= j.write ? (
        <div style={at(540 + 900 * (1 - card.k), 900, {filter: blur(mblur(card.v, 900))})}>
          <QuoteCard brand={brand} chars={chars} />
        </div>
      ) : null}
    </>
  );
};

const Meeting: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const m = b.meeting;
  const bub = sp(frame, m.bubble, {damping: 12, stiffness: 180, mass: 0.8}, fps);
  const q = 'طب ومين تاني بيعمل كده؟';
  const n = Math.round(q.length * prog(t, m.ask, m.ask + 1.1, (x) => x));
  return (
    <>
      <div style={at(540, 720, {transform: 'translate(-50%,-50%) scale(0.82)'})}>
        <Glitch t={t} at0={m.crack} amount={80}>
          <QuoteCard brand={brand} />
        </Glitch>
      </div>
      <div style={at(560, 1110, {transform: `translate(-50%,-50%) scale(${bub})`, transformOrigin: '85% 100%'})}>
        <div style={{position: 'relative', padding: '34px 46px', borderRadius: 40, background: brand.accent, minWidth: 620, boxSizing: 'border-box'}}>
          <div dir="rtl" style={{fontFamily: AR, fontWeight: 900, fontSize: 60, color: brand.bgDeep, textAlign: 'right', minHeight: 80}}>
            {t < m.ask ? (
              <span style={{letterSpacing: '0.2em'}}>{'•'.repeat(1 + (Math.floor(t * 4) % 3))}</span>
            ) : (
              q.slice(0, n)
            )}
          </div>
          <div style={{position: 'absolute', right: 60, bottom: -30, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `34px solid ${brand.accent}`}} />
          <div style={{position: 'absolute', left: 26, top: -24, padding: '6px 18px', borderRadius: 999, background: PANEL, fontFamily: AR, fontWeight: 700, fontSize: 28, color: brand.text}}>المستثمر</div>
        </div>
      </div>
    </>
  );
};

const One: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const k = sp(frame, b.one.score, SNAP, fps);
  return (
    <>
      <Dots5 frame={frame} fps={fps} at0={b.one.score} filled={1} color={RED} y={1180} />
      {t >= b.one.score ? (
        <div style={at(540, 880, {transform: `translate(-50%,-50%) scale(${2.4 - 1.4 * k})`, filter: blur(18 * (1 - k)), opacity: clamp01(k * 2)})}>
          <Figure n={1} label="من 5" size={330} color={RED} brand={brand} />
        </div>
      ) : null}
    </>
  );
};

const Dont: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const d = b.dont;
  const c = fly(frame, fps, d.card - 0.1, FAST);
  const strike = prog(t, d.strike, d.strike + 0.45, easeInOut);
  return (
    <>
      <div style={at(540, 880, {transform: `translate(-50%,-50%) scale(${lerp(1.6, 1, c.k)})`, filter: blur(16 * (1 - c.k)), opacity: clamp01(c.k * 2)})}>
        <QuoteCard brand={brand} strike={strike} crossed={t >= d.stamp} />
      </div>
      <div style={at(540, 1170)}>
        <Stamp frame={frame} fps={fps} at={d.stamp} text="متكتبهاش" color={RED} size={90} rotate={-7} />
      </div>
    </>
  );
};

const Fix: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const f = b.fix;
  const slide = sp(frame, f.slide, FAST, fps);
  const mid = sp(frame, f.mid, SNAP, fps);
  const v = rollTo(t, f.count, f.plus + 0.2, 66, 69);
  const plus = sp(frame, f.plus, {damping: 9, stiffness: 200, mass: 0.7}, fps);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: clamp01(slide * 2), transform: `translateY(${-230}px) scale(${0.5 + 0.08 * slide})`}}>
        <Matrix frame={frame} fps={fps} t={t} axes={f.slide} dots={f.slide + 0.3} corner={f.slide + 0.8} brand={brand} hero={false} />
      </div>
      <div style={at(540, 890, {opacity: clamp01(mid * 2), transform: `translate(-50%,-50%) scale(${mid})`, padding: '12px 30px', borderRadius: 999, background: PANEL, border: `2px solid ${brand.accent}`, fontFamily: AR, fontWeight: 900, fontSize: 40, color: brand.text})}>
        سلايد منافسين متوسطة
      </div>
      {t >= f.count - 0.1 ? (
        <>
          <div style={at(540, 1060, {fontFamily: LATIN, fontWeight: 800, fontSize: 42, color: brand.muted})}>Bluejay</div>
          <div style={at(540, 1200, {display: 'flex', alignItems: 'center', gap: 34, direction: 'ltr'})}>
            <div style={{position: 'relative', opacity: 0.6}}>
              <Num value={66} size={120} color={RED} />
              <div style={{position: 'absolute', left: -6, right: -6, top: '50%', height: 10, borderRadius: 5, background: brand.text, transform: `scaleX(${prog(t, f.plus, f.plus + 0.3, easeOut)})`, transformOrigin: 'left center'}} />
            </div>
            <svg width="90" height="50" viewBox="0 0 90 50"><path d="M4 25 H76 M58 8 L80 25 L58 42" stroke={brand.muted} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{position: 'relative'}}>
              <Num value={v} size={220} color={t >= f.plus ? brand.accent : brand.text} />
              <div style={{position: 'absolute', right: -40, top: -70, transform: `scale(${plus}) rotate(${(1 - plus) * -30}deg)`, opacity: clamp01(plus * 2)}}>
                <Num value="+3" size={96} color={brand.accent} style={{textShadow: `0 0 40px ${rgba(brand.accent, 0.6)}`}} />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export const ReelE01_3: React.FC<Reel3Props> = (p) => {
  const b = p.beats;
  const s = b.scenes;
  const plan: [number, Pose][] = [
    [-1, POSE.center],
    [s.criterion, POSE.top],
  ];
  return (
    <ReelShell p={p} markPlan={plan} cuts={[s.airbnb, s.bluejay, s.dont, s.cta]} hook={(t) => <Hook t={t} at0={b.intro.mark} brand={p.brand} />}>
      {({frame, fps, t}) => {
        const ctx = {frame, fps, t, b, brand: p.brand};
        return (
          <>
            <Scene t={t} from={s.criterion} to={s.airbnb}>
              <Criterion {...ctx} />
            </Scene>
            <Scene t={t} from={s.airbnb} to={s.bluejay}>
              <Airbnb {...ctx} />
            </Scene>
            <Scene t={t} from={s.bluejay} to={s.meeting}>
              <Bluejay {...ctx} />
            </Scene>
            <Scene t={t} from={s.meeting} to={s.one}>
              <Meeting {...ctx} />
            </Scene>
            <Scene t={t} from={s.one} to={s.dont}>
              <One {...ctx} />
            </Scene>
            <Scene t={t} from={s.dont} to={s.fix}>
              <Dont {...ctx} />
            </Scene>
            <Scene t={t} from={s.fix} to={s.cta}>
              <Fix {...ctx} />
            </Scene>
          </>
        );
      }}
    </ReelShell>
  );
};
