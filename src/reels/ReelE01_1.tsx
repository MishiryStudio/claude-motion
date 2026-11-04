import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Grain} from '../components/primitives';
import {AR, Brand, Captions, LATIN, rgba, ShortProps, useCairo} from '../shorts/Short';
import {
  active,
  Backdrop,
  blur,
  Camera,
  Chip,
  clamp01,
  easeIn,
  easeInOut,
  easeOut,
  fly,
  FAST,
  Headline,
  kick,
  lerp,
  MarkBuild,
  mblur,
  Num,
  prog,
  Pulse,
  Ribbons,
  rollTo,
  Scene,
  SHARDS,
  sp,
  Stamp,
} from './kit';

// E01 short 1: "7 investors rejected Airbnb". Voice from the episode; every visual is
// rebuilt in code and keyed to the spoken words in reels/E01-1.beats.json.

type Beats = {
  scenes: Record<'intro' | 'decks' | 'investors' | 'y2025' | 'criteria' | 'lower' | 'result' | 'cta', number>;
  headlines: [number, string][];
  intro: {ribbons: number; mark: number};
  decks: {in: number; focus2008: number; year2008: number};
  investors: {land: number; rejected: number; recede: number; airbnb: number};
  y2025: {card: number; year: number; ai: number; small: number};
  criteria: {chips: number; orbit: number; nine: number};
  lower: {bars: number; less: number};
  result: {
    word: number;
    airbnb: number;
    airbnbLand: number;
    bluejay: number;
    bluejayLand: number;
    threshold: number;
    thresholdLabel: number;
    notReady: number;
  };
  pulses: number[];
  ctaHold: number;
};
export type ReelProps = ShortProps & {beats: Beats};

const C2008 = SHARDS[1];
const C2025 = SHARDS[0];
const CRITERIA = ['المشكلة', 'حجم السوق', 'الحل', 'التراكشن', 'نموذج الربح', 'المنافسين', 'الفريق', 'طلب التمويل', 'التصميم'];

/** A pitch-deck slide, drawn rather than filmed. */
const Deck: React.FC<{year: string; color: string; brand: Brand}> = ({year, color, brand}) => (
  <div
    style={{
      width: 440,
      height: 290,
      borderRadius: 22,
      background: '#3A4049',
      border: `2px solid ${rgba(color, 0.55)}`,
      boxShadow: '0 30px 70px rgba(0,0,0,0.45)',
      padding: 26,
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div style={{display: 'flex', gap: 8, marginBottom: 22}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.18)'}} />
      ))}
    </div>
    <div style={{width: 230, height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.85)', marginBottom: 18}} />
    {[300, 260, 190].map((w) => (
      <div key={w} style={{width: w, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.2)', marginBottom: 12}} />
    ))}
    <div style={{position: 'absolute', right: 26, bottom: 26, display: 'flex', alignItems: 'flex-end', gap: 10}}>
      {[40, 64, 52, 88].map((h, i) => (
        <div key={i} style={{width: 22, height: h, borderRadius: 5, background: i === 3 ? color : 'rgba(255,255,255,0.22)'}} />
      ))}
    </div>
    <div
      style={{
        position: 'absolute',
        left: 26,
        bottom: 22,
        fontFamily: LATIN,
        fontWeight: 800,
        fontSize: 40,
        color,
      }}
    >
      {year}
    </div>
    <div style={{position: 'absolute', inset: 0, borderRadius: 22, boxShadow: `inset 0 0 0 1px ${rgba(brand.text, 0.04)}`}} />
  </div>
);

const Investor: React.FC<{i: number}> = ({i}) => (
  <div
    style={{
      width: 200,
      height: 250,
      borderRadius: 24,
      background: '#3A4049',
      border: '2px solid rgba(255,255,255,0.07)',
      boxShadow: '0 22px 50px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 30,
      boxSizing: 'border-box',
      gap: 16,
    }}
  >
    <div
      style={{
        width: 82,
        height: 82,
        borderRadius: 41,
        background: `linear-gradient(160deg, hsl(${210 + i * 9},10%,${58 - i * 2}%), hsl(${210 + i * 9},12%,32%))`,
      }}
    />
    <div style={{width: 120, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.55)'}} />
    <div style={{width: 84, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.2)'}} />
    <div
      style={{
        marginTop: 6,
        padding: '4px 16px',
        borderRadius: 999,
        border: '2px solid rgba(255,255,255,0.15)',
        color: 'rgba(255,255,255,0.6)',
        fontFamily: LATIN,
        fontWeight: 700,
        fontSize: 22,
      }}
    >
      VC
    </div>
  </div>
);

const at = (x: number, y: number, style: React.CSSProperties = {}): React.CSSProperties => ({
  position: 'absolute',
  left: x,
  top: y,
  transform: 'translate(-50%, -50%)',
  ...style,
});

const DecksScene: React.FC<{frame: number; fps: number; t: number; b: Beats; brand: Brand}> = ({frame, fps, t, b, brand}) => {
  const a = fly(frame, fps, b.decks.in, FAST);
  const c = fly(frame, fps, b.decks.in + 0.08, FAST);
  const focus = prog(t, b.decks.focus2008, b.decks.focus2008 + 0.6, easeInOut);
  const gone = prog(t, b.decks.focus2008, b.decks.focus2008 + 0.32, easeIn);
  const yr = fly(frame, fps, b.decks.year2008, FAST);
  return (
    <>
      <div
        style={at(lerp(-430 + 720 * a.k, 540, focus), lerp(900, 820, focus), {
          transform: `translate(-50%,-50%) rotateY(${lerp(24, 0, focus)}deg) scale(${lerp(1, 1.5, focus)})`,
          filter: blur(mblur(a.v, 720)),
        })}
      >
        <Deck year="2008" color={C2008} brand={brand} />
      </div>
      <div
        style={at(1500 - 720 * c.k + 1000 * gone, 900, {
          transform: `translate(-50%,-50%) rotateY(-24deg) scale(1)`,
          filter: blur(mblur(c.v, 720) + 18 * gone),
          opacity: 1 - gone,
        })}
      >
        <Deck year="2025" color={C2025} brand={brand} />
      </div>
      {t >= b.decks.year2008 ? (
        <div style={at(540, 1200, {transform: `translate(-50%,-50%) scale(${1.9 - 0.9 * yr.k})`, filter: blur(22 * (1 - yr.k)), opacity: clamp01(yr.k * 2)})}>
          <Num value={rollTo(t, b.decks.year2008, b.decks.year2008 + 0.5, 1990, 2008)} size={230} color={C2008} />
        </div>
      ) : null}
    </>
  );
};

const InvestorsScene: React.FC<{frame: number; fps: number; t: number; b: Beats; brand: Brand}> = ({frame, fps, t, b, brand}) => {
  const recede = prog(t, b.investors.recede, b.investors.recede + 0.8, easeInOut);
  const slots = [0, 1, 2, 3, 4, 5, 6].map((i) =>
    i < 4 ? {x: 540 + (i - 1.5) * 232, y: 770} : {x: 540 + (i - 5) * 232, y: 1060},
  );
  const landed = slots.filter((_, i) => t >= b.investors.land + i * 0.09).length;
  const ab = fly(frame, fps, b.investors.airbnb, {damping: 16, stiffness: 150, mass: 0.9});
  return (
    <>
      <div style={at(540, 910, {opacity: 0.1 * (1 - recede)})}>
        <Num value={landed} size={760} color={brand.accent} />
      </div>
      <AbsoluteFill
        style={{
          transform: `translateY(${-140 * recede}px) scale(${1 - 0.45 * recede})`,
          filter: blur(6 * recede),
          opacity: 1 - 0.65 * recede,
        }}
      >
        {slots.map((s, i) => {
          const f = fly(frame, fps, b.investors.land + i * 0.09 - 0.12, FAST);
          const side = i % 2 ? 1 : -1;
          const rej = i < 5;
          return (
            <div
              key={i}
              style={at(s.x + side * 900 * (1 - f.k), s.y, {
                transform: `translate(-50%,-50%) rotate(${side * 14 * (1 - f.k)}deg)`,
                filter: blur(mblur(f.v, 900)),
              })}
            >
              <Investor i={i} />
              <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)'}}>
                <Stamp
                  frame={frame}
                  fps={fps}
                  at={b.investors.rejected + i * 0.085}
                  text={rej ? 'رفض' : 'ما ردّش'}
                  color={rej ? '#E12127' : '#9AA3AD'}
                  size={rej ? 46 : 34}
                  rotate={i % 2 ? 9 : -11}
                />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      {t >= b.investors.airbnb ? (
        <div style={at(540, 1000, {transform: `translate(-50%,-50%) scale(${3.4 - 2.4 * ab.k})`, filter: blur(26 * (1 - ab.k)), opacity: clamp01(ab.k * 2.2)})}>
          <div style={{fontFamily: LATIN, fontWeight: 900, fontSize: 180, color: brand.text, letterSpacing: '-0.03em', textShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>
            Airbnb
          </div>
        </div>
      ) : null}
      {t >= b.investors.airbnb ? (
        <AbsoluteFill style={{background: '#fff', opacity: 0.25 * Math.exp(-(t - b.investors.airbnb) * 12)}} />
      ) : null}
    </>
  );
};

const Y2025Scene: React.FC<{frame: number; fps: number; t: number; b: Beats; brand: Brand}> = ({frame, fps, t, b, brand}) => {
  const card = fly(frame, fps, b.y2025.card, FAST);
  const yr = fly(frame, fps, b.y2025.year, FAST);
  const ai = fly(frame, fps, b.y2025.ai, FAST);
  const sm = fly(frame, fps, b.y2025.small, FAST);
  return (
    <>
      <div
        style={at(540 + 900 * (1 - card.k), 780, {
          transform: `translate(-50%,-50%) rotateY(${-30 * (1 - card.k) - 6}deg) scale(1.2)`,
          filter: blur(mblur(card.v, 900)),
        })}
      >
        <Deck year="2025" color={C2025} brand={brand} />
      </div>
      {t >= b.y2025.year ? (
        <div style={at(540, 1120, {transform: `translate(-50%,-50%) scale(${1.9 - 0.9 * yr.k})`, filter: blur(22 * (1 - yr.k)), opacity: clamp01(yr.k * 2)})}>
          <Num value={rollTo(t, b.y2025.year, b.y2025.year + 0.5, 2008, 2025)} size={230} color={C2025} />
        </div>
      ) : null}
      <div style={{position: 'absolute', top: 1290, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20, direction: 'rtl'}}>
        <div style={{opacity: clamp01(ai.k * 2), transform: `translateX(${-500 * (1 - ai.k)}px)`, filter: blur(mblur(ai.v, 500))}}>
          <Chip text="شركة ذكاء اصطناعي" color={C2025} brand={brand} size={42} />
        </div>
        <div style={{opacity: clamp01(sm.k * 2), transform: `scale(${0.4 + 0.6 * sm.k})`}}>
          <Chip text="صغيرة" color={brand.accent} brand={brand} size={42} />
        </div>
      </div>
    </>
  );
};

const CriteriaScene: React.FC<{frame: number; fps: number; t: number; b: Beats; brand: Brand}> = ({frame, fps, t, b, brand}) => {
  const nine = fly(frame, fps, b.criteria.nine, {damping: 10, stiffness: 220, mass: 0.7});
  return (
    <>
      {CRITERIA.map((label, i) => {
        const f = fly(frame, fps, b.criteria.chips + i * 0.07, FAST);
        const ang = (i / 9) * Math.PI * 2 - Math.PI / 2 + (t - b.criteria.chips) * 0.22;
        const x = 540 + Math.cos(ang) * 335;
        const y = 910 + Math.sin(ang) * 375;
        const side = i % 2 ? 1 : -1;
        const lit = t >= b.criteria.orbit + i * 0.05;
        return (
          <div
            key={label}
            style={at(lerp(540 + side * 1100, x, f.k), lerp(y + 200 * side, y, f.k), {
              filter: blur(mblur(f.v, 1100)),
              opacity: clamp01(f.k * 2),
            })}
          >
            <Chip text={label} color={lit ? brand.accent : '#6B7480'} brand={brand} size={36} />
          </div>
        );
      })}
      {t >= b.criteria.nine ? (
        <div style={at(540, 1110, {transform: `translate(-50%,-50%) scale(${nine.k})`})}>
          <Chip text="9 معايير · نفس الميزان" color={brand.accent} brand={brand} size={34} />
        </div>
      ) : null}
    </>
  );
};

const Bar: React.FC<{
  x: number;
  value: number;
  color: string;
  label: string;
  sub: string;
  brand: Brand;
  enter: number;
  count?: React.ReactNode;
  max?: number;
}> = ({x, value, color, label, sub, brand, enter, count, max = 600}) => {
  const base = 1290;
  const h = (max * value) / 100;
  return (
    <div style={{opacity: clamp01(enter * 2), transform: `translateY(${120 * (1 - enter)}px)`}}>
      <div style={{position: 'absolute', left: x - 85, top: base - max, width: 170, height: max, borderRadius: 26, background: 'rgba(255,255,255,0.06)'}} />
      <div
        style={{
          position: 'absolute',
          left: x - 85,
          top: base - h,
          width: 170,
          height: h,
          borderRadius: 26,
          background: `linear-gradient(180deg, ${color} 0%, ${rgba(color, 0.65)} 100%)`,
          boxShadow: `0 0 50px ${rgba(color, 0.35)}`,
        }}
      />
      {count ? <div style={at(x, base - max - 78)}>{count}</div> : null}
      <div style={at(x, base + 56, {fontFamily: LATIN, fontWeight: 800, fontSize: 42, color: brand.text})}>{label}</div>
      <div style={at(x, base + 104, {fontFamily: LATIN, fontWeight: 700, fontSize: 30, color})}>{sub}</div>
    </div>
  );
};

const LowerScene: React.FC<{frame: number; fps: number; t: number; b: Beats; brand: Brand}> = ({frame, fps, t, b, brand}) => {
  const e = sp(frame, b.lower.bars, FAST, fps);
  const h08 = 69 * prog(t, b.lower.bars + 0.15, b.lower.bars + 1.1, easeOut);
  const h25 = 66 * prog(t, b.lower.bars + 0.3, b.lower.bars + 1.25, easeOut);
  const less = fly(frame, fps, b.lower.less, {damping: 10, stiffness: 220, mass: 0.7});
  return (
    <>
      <Bar x={720} value={h08} color={C2008} label="2008" sub="" brand={brand} enter={e} />
      <Bar x={360} value={h25} color={t >= b.lower.less ? C2025 : '#8A929C'} label="2025" sub="" brand={brand} enter={e} />
      {t >= b.lower.less ? (
        <div style={at(360, 1290 - 6 * 66 - 120, {transform: `translate(-50%,-50%) scale(${less.k})`})}>
          <svg width="110" height="120" viewBox="0 0 110 120">
            <path d="M55 112 L8 58 L36 58 L36 6 L74 6 L74 58 L102 58 Z" fill={C2025} />
          </svg>
        </div>
      ) : null}
    </>
  );
};

const ResultScene: React.FC<{frame: number; fps: number; t: number; b: Beats; brand: Brand}> = ({frame, fps, t, b, brand}) => {
  const r = b.result;
  const e = sp(frame, r.word, FAST, fps);
  const vA = 69 * prog(t, r.airbnb, r.airbnbLand, easeOut);
  const vB = 66 * prog(t, r.bluejay, r.bluejayLand, easeOut);
  const line = prog(t, r.threshold, r.threshold + 0.5, easeInOut);
  const lbl = fly(frame, fps, r.thresholdLabel, FAST);
  const yLine = 1290 - 600 * 0.8;
  const pop = (land: number) => 1 + 0.25 * Math.exp(-Math.max(0, t - land) * 10) * (t >= land ? 1 : 0);
  const count = (v: number, land: number, color: string) => (
    <div style={{transform: `scale(${pop(land)})`}}>
      <Num value={Math.round(v)} size={110} color={t >= land ? color : brand.text} />
    </div>
  );
  return (
    <>
      <Bar x={720} value={vA} color={C2008} label="Airbnb" sub="2008" brand={brand} enter={e} count={t >= r.airbnb ? count(vA, r.airbnbLand, C2008) : null} />
      <Bar
        x={360}
        value={vB}
        color={C2025}
        label="Bluejay"
        sub="2025"
        brand={brand}
        enter={sp(frame, r.word + 0.1, FAST, fps)}
        count={t >= r.bluejay ? count(vB, r.bluejayLand, C2025) : null}
      />
      {t >= r.threshold ? (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <line x1={960} y1={yLine} x2={960 - 840 * line} y2={yLine} stroke={brand.accent} strokeWidth={6} strokeDasharray="18 12" />
        </svg>
      ) : null}
      {t >= r.thresholdLabel ? (
        <div style={at(935, yLine - 58, {opacity: clamp01(lbl.k * 2), transform: `translate(-50%,-50%) translateX(${200 * (1 - lbl.k)}px)`})}>
          <Chip text="80 = جاهز" color={brand.accent} brand={brand} size={28} />
        </div>
      ) : null}
      <div style={at(540, 1000)}>
        <Stamp frame={frame} fps={fps} at={r.notReady} text="مش جاهزين" color="#E12127" size={96} rotate={-9} />
      </div>
    </>
  );
};

const CtaScene: React.FC<{frame: number; fps: number; t: number; at0: number; brand: Brand; cta: ShortProps['cta']}> = ({
  frame,
  fps,
  t,
  at0,
  brand,
  cta,
}) => {
  const k = sp(frame, at0 + 0.75, {damping: 10, stiffness: 220, mass: 0.7}, fps);
  if (t < at0 + 0.7) return null;
  return (
    <div
      dir="rtl"
      style={at(540, 1180, {
        transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`,
        opacity: clamp01(k * 1.6),
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '24px 58px',
        borderRadius: 999,
        background: brand.accent,
        color: brand.bgDeep,
        fontFamily: AR,
        fontWeight: 900,
        fontSize: 50,
        whiteSpace: 'nowrap',
        boxShadow: `0 20px 60px ${rgba(brand.accent, 0.35)}`,
      })}
    >
      <svg width="34" height="38" viewBox="0 0 34 38" style={{transform: 'scaleX(-1)'}}>
        <path d="M4 3 L31 19 L4 35 Z" fill={brand.bgDeep} />
      </svg>
      {cta.line1}
    </div>
  );
};

/** The mark: centre stage in the intro, the criteria orbit and the CTA; small up top otherwise. */
/** Frame 0 is the thumbnail: a giant 7 that the arriving mark blows away. */
const IntroSeven: React.FC<{t: number; at0: number; brand: Brand}> = ({t, at0, brand}) => {
  const k = prog(t, at0, at0 + 0.4, easeIn);
  if (k >= 1) return null;
  return (
    <div style={at(540, 820, {transform: `translate(-50%,-50%) scale(${1 + 0.6 * k})`, filter: blur(24 * k), opacity: 1 - k})}>
      <Num value={7} size={760} color={brand.accent} style={{textShadow: `0 30px 120px ${rgba(brand.accent, 0.35)}`}} />
    </div>
  );
};

const markPose = (t: number, s: Beats['scenes']) => {
  const plan: [number, 'center' | 'top'][] = [
    [-1, 'center'],
    [s.decks, 'top'],
    [s.criteria - 0.2, 'center'],
    [s.lower - 0.1, 'top'],
  ];
  const pose = {center: {x: 540, y: 880, size: 300}, top: {x: 540, y: 205, size: 86}};
  const {i, since} = active(t, plan);
  const cur = pose[plan[i][1]];
  const prev = pose[plan[Math.max(0, i - 1)][1]];
  const k = easeInOut(clamp01(since / 0.55));
  return {x: lerp(prev.x, cur.x, k), y: lerp(prev.y, cur.y, k), size: lerp(prev.size, cur.size, k)};
};

export const ReelE01_1: React.FC<ReelProps> = (p) => {
  useCairo();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const b = p.beats;
  const s = b.scenes;
  const parts = p.brand.logoParts ?? [];
  const cta = t >= s.cta;
  const pose = cta ? {x: 540, y: 780, size: 300} : markPose(t, s);
  const punch = kick(t, b.pulses);
  const shake = kick(t, [b.result.notReady], 7) * 0.9;
  const cuts = [s.investors, s.y2025, s.criteria, s.result, s.cta];

  return (
    <AbsoluteFill style={{background: p.brand.bgDeep}}>
      <Backdrop t={t} brand={p.brand} glow={punch} />
      <Camera t={t} punch={punch} shake={shake}>
        <IntroSeven t={t} at0={b.intro.mark} brand={p.brand} />
        <Scene t={t} from={s.decks} to={s.investors}>
          <DecksScene frame={frame} fps={fps} t={t} b={b} brand={p.brand} />
        </Scene>
        <Scene t={t} from={s.investors} to={s.y2025}>
          <InvestorsScene frame={frame} fps={fps} t={t} b={b} brand={p.brand} />
        </Scene>
        <Scene t={t} from={s.y2025} to={s.criteria}>
          <Y2025Scene frame={frame} fps={fps} t={t} b={b} brand={p.brand} />
        </Scene>
        <Scene t={t} from={s.criteria} to={s.lower}>
          <CriteriaScene frame={frame} fps={fps} t={t} b={b} brand={p.brand} />
        </Scene>
        <Scene t={t} from={s.lower} to={s.result}>
          <LowerScene frame={frame} fps={fps} t={t} b={b} brand={p.brand} />
        </Scene>
        <Scene t={t} from={s.result} to={s.cta}>
          <ResultScene frame={frame} fps={fps} t={t} b={b} brand={p.brand} />
        </Scene>

        <div style={{position: 'absolute', left: pose.x, top: pose.y, transform: 'translate(-50%,-50%)'}}>
          <MarkBuild
            key={cta ? 'cta' : 'intro'}
            frame={frame}
            fps={fps}
            at={cta ? s.cta + 0.2 : b.intro.mark}
            parts={parts}
            size={pose.size}
          />
        </div>
        <Pulse t={t} at={b.pulses} x={pose.x} y={pose.y} r={pose.size * 0.55} color={p.brand.accent} />
        <CtaScene frame={frame} fps={fps} t={t} at0={s.cta} brand={p.brand} cta={p.cta} />
      </Camera>

      <Headline holdFirst t={t} list={b.headlines} brand={p.brand} top={lerp(1180, 300, prog(t, s.decks, s.decks + 0.5, easeInOut))} />
      <Captions frame={frame} fps={fps} brand={p.brand} pages={p.pages} top={1450} size={60} />

      <Ribbons t={t} at={b.intro.ribbons} dir={1} />
      {cuts.map((c, i) => (
        <Ribbons key={c} t={t} at={c - 0.3} dir={i % 2 ? 1 : -1} tilt={i % 2 ? -16 : 14} />
      ))}

      {p.segments.map((seg, i) => (
        <Sequence key={i} from={Math.round(seg.from * fps)} durationInFrames={Math.round(seg.dur * fps)}>
          <Audio
            src={staticFile(p.source)}
            trimBefore={Math.round(seg.src0 * fps)}
            volume={(v) => clamp01(Math.min(v / 4, (seg.dur * fps - v) / 4, 1))}
          />
        </Sequence>
      ))}
      {p.sfx ? <Audio src={staticFile(p.sfx)} volume={0.85} /> : null}
      <Grain frame={frame} opacity={0.05} />
    </AbsoluteFill>
  );
};
