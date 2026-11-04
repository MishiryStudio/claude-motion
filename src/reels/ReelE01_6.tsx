import React from 'react';
import {AR, Brand, LATIN, rgba, ShortProps} from '../shorts/Short';
import {
  at,
  blur,
  Chip,
  clamp01,
  easeIn,
  easeInOut,
  fly,
  FAST,
  mblur,
  Num,
  POSE,
  Pose,
  prog,
  ReelShell,
  Scene,
  SHARDS,
  sp,
  SNAP,
} from './kit';

// E01 short 6: "the investor wants two things before the story" (order of the deck).
// Voice from the episode; visuals rebuilt in code on the words in reels/E01-6.beats.json.

type Beats = {
  scenes: {intro: number; order: number; compare: number; investor: number; cta: number};
  headlines: [number, string][];
  intro: {ribbons: number; mark: number};
  order: {slots: number};
  compare: {airbnb: number; aProblem: number; bluejay: number; team: number; money: number; problem: number; link: number; chip: number};
  investor: {who: number; pays: number; story: number};
  pulses: number[];
  shake: number[];
  ctaHold: number;
};
export type Reel6Props = ShortProps & {beats: Beats};

const ORANGE = SHARDS[1];
const RED = SHARDS[0];
const PANEL = '#3A4049';
const SLOTS = [810, 1010, 1210];
type Ctx = {frame: number; fps: number; t: number; b: Beats; brand: Brand};

const Hook: React.FC<{t: number; at0: number; brand: Brand}> = ({t, at0, brand}) => {
  const k = prog(t, at0, at0 + 0.4, easeIn);
  if (k >= 1) return null;
  return (
    <div style={at(540, 790, {transform: `translate(-50%,-50%) scale(${1 + 0.6 * k})`, filter: blur(24 * k), opacity: 1 - k})}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Num value={2} size={600} color={brand.accent} style={{textShadow: `0 30px 120px ${rgba(brand.accent, 0.4)}`}} />
        <div style={{fontFamily: AR, fontWeight: 900, fontSize: 120, color: brand.text, marginTop: -40}}>حاجتين</div>
      </div>
    </div>
  );
};

const Card: React.FC<{text: string; color: string; brand: Brand; dim?: boolean; glow?: number; w?: number}> = ({text, color, brand, dim, glow = 0, w = 400}) => (
  <div
    dir="rtl"
    style={{
      width: w,
      height: 140,
      borderRadius: 30,
      background: dim ? 'rgba(58,64,73,0.45)' : PANEL,
      border: `3px ${dim ? 'dashed' : 'solid'} ${dim ? 'rgba(255,255,255,0.15)' : rgba(color, 0.8)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: AR,
      fontWeight: 900,
      fontSize: 46,
      color: dim ? 'rgba(255,255,255,0.45)' : brand.text,
      boxShadow: glow ? `0 0 ${60 * glow}px ${rgba(color, 0.7)}` : '0 20px 50px rgba(0,0,0,0.35)',
      boxSizing: 'border-box',
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </div>
);

/** Numbered rail in the middle: the order everything else is measured against. */
const Rail: React.FC<{frame: number; fps: number; at0: number; brand: Brand}> = ({frame, fps, at0, brand}) => (
  <>
    {SLOTS.map((y, i) => {
      const k = sp(frame, at0 + i * 0.1, SNAP, fps);
      return (
        <div key={y} style={at(540, y, {width: 70, height: 70, borderRadius: 35, background: brand.accent, color: brand.bgDeep, fontFamily: LATIN, fontWeight: 900, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translate(-50%,-50%) scale(${k})`})}>
          {i + 1}
        </div>
      );
    })}
  </>
);

const Order: React.FC<Ctx> = ({frame, fps, b, brand}) => (
  <>
    <Rail frame={frame} fps={fps} at0={b.order.slots} brand={brand} />
    {SLOTS.map((y, i) => {
      const k = sp(frame, b.order.slots + 0.1 + i * 0.1, FAST, fps);
      return (
        <React.Fragment key={y}>
          <div style={at(790, y, {opacity: k})}>
            <Card text="؟" color={brand.text} brand={brand} dim w={410} />
          </div>
          <div style={at(290, y, {opacity: k})}>
            <Card text="؟" color={brand.text} brand={brand} dim w={410} />
          </div>
        </React.Fragment>
      );
    })}
  </>
);

const Compare: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const c = b.compare;
  const aHead = sp(frame, c.airbnb, FAST, fps);
  const bHead = sp(frame, c.bluejay, FAST, fps);
  const blue = [
    {text: 'الفريق', at0: c.team, color: RED},
    {text: 'الفلوس اللي دخلت', at0: c.money, color: RED},
    {text: 'المشكلة', at0: c.problem, color: RED},
  ];
  const link = prog(t, c.link, c.link + 0.7, easeInOut);
  const chip = sp(frame, c.chip, {damping: 10, stiffness: 200, mass: 0.7}, fps);
  const hl = t >= c.link ? 1 : 0;
  // Airbnb's #1 card (right) to Bluejay's #3 card (left).
  const path = 'M 585 810 C 520 920, 560 1100, 495 1210';
  return (
    <>
      <Rail frame={frame} fps={fps} at0={b.scenes.compare - 1} brand={brand} />
      <div style={at(790, 660, {opacity: clamp01(aHead * 2), fontFamily: LATIN, fontWeight: 900, fontSize: 64, color: ORANGE})}>Airbnb</div>
      <div style={at(290, 660, {opacity: clamp01(bHead * 2), fontFamily: LATIN, fontWeight: 900, fontSize: 64, color: RED})}>Bluejay</div>
      {SLOTS.map((y, i) => {
        if (i === 0) {
          const f = fly(frame, fps, c.aProblem - 0.1, FAST);
          return (
            <div key={y} style={at(790 + 700 * (1 - f.k), y, {filter: blur(mblur(f.v, 700))})}>
              <Card text="المشكلة" color={ORANGE} brand={brand} w={410} glow={hl * (0.6 + 0.4 * Math.sin(t * 6))} />
            </div>
          );
        }
        return (
          <div key={y} style={at(790, y)}>
            <Card text="…" color={brand.text} brand={brand} dim w={410} />
          </div>
        );
      })}
      {blue.map((card, i) => {
        const f = fly(frame, fps, card.at0 - 0.1, FAST);
        return (
          <div key={card.text} style={at(290 - 700 * (1 - f.k), SLOTS[i], {filter: blur(mblur(f.v, 700))})}>
            <Card text={card.text} color={card.color} brand={brand} w={410} glow={i === 2 ? hl * (0.6 + 0.4 * Math.sin(t * 6)) : 0} />
          </div>
        );
      })}
      {t >= c.link ? (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <path d={path} fill="none" stroke={brand.accent} strokeWidth={7} strokeDasharray="1000" strokeDashoffset={1000 * (1 - link)} strokeLinecap="round" />
        </svg>
      ) : null}
      {t >= c.chip ? (
        <div style={at(540, 1340, {transform: `translate(-50%,-50%) scale(${chip})`})}>
          <Chip text="1 ← 3 · أول اختلاف جوهري" color={brand.accent} brand={brand} size={42} />
        </div>
      ) : null}
    </>
  );
};

const Investor: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const v = b.investor;
  const head = sp(frame, b.scenes.investor + 0.1, FAST, fps);
  const items = [
    {n: 1, text: 'إنتم مين؟', at0: v.who, side: 1, color: brand.accent, dim: false},
    {n: 2, text: 'في حد بيدفع؟', at0: v.pays, side: -1, color: brand.accent, dim: false},
    {n: 3, text: 'القصة · بعدين', at0: v.story, side: 1, color: brand.text, dim: true},
  ];
  return (
    <>
      <div style={at(540, 740, {transform: `translate(-50%,-50%) scale(${head})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10})}>
        <svg width="220" height="220" viewBox="0 0 150 150">
          <circle cx={75} cy={56} r={34} fill="#8A929C" />
          <path d="M18 146 C 22 100, 128 100, 132 146 Z" fill="#8A929C" />
        </svg>
        <div style={{fontFamily: AR, fontWeight: 900, fontSize: 44, color: brand.muted}}>المستثمر</div>
      </div>
      {items.map((it, i) => {
        const f = fly(frame, fps, it.at0 - 0.08, FAST);
        const y = 1000 + i * 165;
        return (
          <div key={it.n} dir="rtl" style={at(540 + it.side * 900 * (1 - f.k), y, {filter: blur(mblur(f.v, 900)), display: 'flex', alignItems: 'center', gap: 22, opacity: it.dim ? 0.8 : 1})}>
            <div style={{width: 74, height: 74, borderRadius: 37, background: it.dim ? 'rgba(255,255,255,0.15)' : brand.accent, color: brand.bgDeep, fontFamily: LATIN, fontWeight: 900, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{it.n}</div>
            <Card text={it.text} color={it.color} brand={brand} dim={it.dim} w={560} />
          </div>
        );
      })}
    </>
  );
};

export const ReelE01_6: React.FC<Reel6Props> = (p) => {
  const b = p.beats;
  const s = b.scenes;
  const plan: [number, Pose][] = [
    [-1, POSE.center],
    [s.order, POSE.top],
  ];
  return (
    <ReelShell p={p} markPlan={plan} cuts={[s.compare, s.investor, s.cta]} hook={(t) => <Hook t={t} at0={b.intro.mark} brand={p.brand} />}>
      {({frame, fps, t}) => {
        const ctx = {frame, fps, t, b, brand: p.brand};
        return (
          <>
            <Scene t={t} from={s.order} to={s.compare}>
              <Order {...ctx} />
            </Scene>
            <Scene t={t} from={s.compare} to={s.investor}>
              <Compare {...ctx} />
            </Scene>
            <Scene t={t} from={s.investor} to={s.cta}>
              <Investor {...ctx} />
            </Scene>
          </>
        );
      }}
    </ReelShell>
  );
};

