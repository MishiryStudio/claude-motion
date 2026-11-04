import React from 'react';
import {Brand, rgba, ShortProps, AR} from '../shorts/Short';
import {
  at,
  blur,
  Chip,
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

// E01 short 2: "a 17-year-old mistake in every pitch deck" (market size). Voice from the
// episode; numbers are rebuilt and animated on the spoken words in reels/E01-2.beats.json.

type Beats = {
  scenes: {intro: number; market: number; airbnb: number; why: number; bluejay: number; where: number; score: number; lesson: number; cta: number};
  headlines: [number, string][];
  intro: {ribbons: number; mark: number};
  market: {rings: number; both: number};
  airbnb: {trips: number; narrow: number; finally: number; take: number};
  why: {question: number; noReason: number};
  bluejay: {companies: number; times: number; price: number; equals: number; total: number};
  where: {focus: number; from: number};
  score: {dots: number};
  lesson: {years: number; same: number; big: number; source: number; noSource: number};
  pulses: number[];
  shake: number[];
  ctaHold: number;
};
export type Reel2Props = ShortProps & {beats: Beats};

const ORANGE = SHARDS[1];
const RED = SHARDS[0];
const PANEL = '#3A4049';

type Ctx = {frame: number; fps: number; t: number; b: Beats; brand: Brand};

/** Arabic label with a big Latin number in front of it (reads right to left). */
const Figure: React.FC<{n: React.ReactNode; label: string; size: number; color: string; brand: Brand}> = ({n, label, size, color, brand}) => (
  <div dir="rtl" style={{display: 'flex', alignItems: 'baseline', gap: size * 0.18, whiteSpace: 'nowrap'}}>
    <Num value={n as number} size={size} color={color} />
    <div style={{fontFamily: AR, fontWeight: 900, fontSize: size * 0.42, color: brand.text}}>{label}</div>
  </div>
);

const Hook: React.FC<{t: number; at0: number; brand: Brand}> = ({t, at0, brand}) => {
  const k = prog(t, at0, at0 + 0.4, easeIn);
  if (k >= 1) return null;
  return (
    <div style={at(540, 800, {transform: `translate(-50%,-50%) scale(${1 + 0.6 * k})`, filter: blur(24 * k), opacity: 1 - k})}>
      <div style={{position: 'relative'}}>
        <Num value={72} size={520} color={brand.accent} style={{textShadow: `0 30px 120px ${rgba(brand.accent, 0.35)}`}} />
        <div style={{position: 'absolute', right: -150, top: -50, fontFamily: AR, fontWeight: 900, fontSize: 300, color: RED, transform: 'rotate(12deg)'}}>؟</div>
        <div style={{textAlign: 'center', marginTop: -30, fontFamily: AR, fontWeight: 900, fontSize: 110, color: brand.text}}>مليار</div>
      </div>
    </div>
  );
};

const Market: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const rings = [
    {r: 400, label: 'TAM', color: 'rgba(255,255,255,0.35)'},
    {r: 280, label: 'SAM', color: ORANGE},
    {r: 160, label: 'SOM', color: brand.accent},
  ];
  const ab = fly(frame, fps, b.market.both, FAST);
  const bj = fly(frame, fps, b.market.both + 0.08, FAST);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {rings.map((ring, i) => {
          const k = prog(t, b.market.rings + i * 0.15, b.market.rings + i * 0.15 + 0.7, easeOut);
          const c = 2 * Math.PI * ring.r;
          return (
            <g key={ring.label}>
              <circle cx={540} cy={900} r={ring.r} fill={rgba(i === 2 ? brand.accent : '#FFFFFF', 0.03 * k)} stroke={ring.color} strokeWidth={5} strokeDasharray={c} strokeDashoffset={c * (1 - k)} transform="rotate(-90 540 900)" strokeLinecap="round" />
              <text x={540} y={900 - ring.r + 44} textAnchor="middle" fill={ring.color} fontFamily="Inter Variable, Inter" fontWeight={800} fontSize={34} opacity={k}>
                {ring.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={at(820 + 500 * (1 - ab.k), 1340, {filter: blur(mblur(ab.v, 500)), opacity: clamp01(ab.k * 2)})}>
        <Chip text="Airbnb · 2008" color={ORANGE} brand={brand} size={36} />
      </div>
      <div style={at(260 - 500 * (1 - bj.k), 1340, {filter: blur(mblur(bj.v, 500)), opacity: clamp01(bj.k * 2)})}>
        <Chip text="Bluejay · 2025" color={RED} brand={brand} size={36} />
      </div>
    </>
  );
};

const Airbnb: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const a = b.airbnb;
  const l1 = sp(frame, a.trips - 0.1, FAST, fps);
  const l2 = sp(frame, a.narrow - 0.05, FAST, fps);
  const w2 = lerp(960, 430, sp(frame, a.narrow + 0.15, {damping: 15, stiffness: 120, mass: 0.9}, fps));
  const arrow = prog(t, a.finally, a.finally + 0.4, easeOut);
  const wedge = prog(t, a.take, a.take + 0.6, easeOut);
  const push = 1 + 0.07 * prog(t, a.trips, b.scenes.why, easeInOut);
  const r = 110;
  const ang = 2 * Math.PI * 0.15 * wedge;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: l2}}>
        <polygon points={`60,785 1020,785 ${540 + w2 / 2},845 ${540 - w2 / 2},845`} fill={rgba(ORANGE, 0.14)} />
      </svg>
      <div style={at(540, 700, {width: 960 * l1, height: 170, borderRadius: 28, background: rgba(ORANGE, 0.22), border: `3px solid ${rgba(ORANGE, 0.6)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', opacity: clamp01(l1 * 2)})}>
        <Figure n={rollTo(t, a.trips, a.trips + 0.5, 0, 2)} label="مليار رحلة" size={120} color={brand.text} brand={brand} />
      </div>
      {t >= a.narrow - 0.05 ? (
        <div style={at(540, 930, {width: w2 * l2, height: 170, borderRadius: 28, background: rgba(ORANGE, 0.45), border: `3px solid ${ORANGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', opacity: clamp01(l2 * 2)})}>
          <Figure n={rollTo(t, a.narrow, a.narrow + 0.5, 2000, 84)} label="مليون" size={116} color={brand.text} brand={brand} />
        </div>
      ) : null}
      {t >= a.finally ? (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <line x1={540} y1={1025} x2={540} y2={1025 + 70 * arrow} stroke={brand.accent} strokeWidth={6} strokeLinecap="round" />
          <path d={`M520 ${1025 + 70 * arrow - 12} L540 ${1025 + 70 * arrow + 12} L560 ${1025 + 70 * arrow - 12}`} stroke={brand.accent} strokeWidth={6} fill="none" opacity={arrow} />
        </svg>
      ) : null}
      {t >= a.take - 0.2 ? (
        <>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <circle cx={420} cy={1250} r={r} fill="rgba(255,255,255,0.08)" />
            <path d={`M420 1250 L420 ${1250 - r} A ${r} ${r} 0 ${ang > Math.PI ? 1 : 0} 1 ${420 + r * Math.sin(ang)} ${1250 - r * Math.cos(ang)} Z`} fill={brand.accent} />
          </svg>
          <div style={at(700, 1250, {transform: `translate(-50%,-50%) scale(${1 + 0.3 * Math.exp(-Math.max(0, t - a.take) * 8)})`})}>
            <Num value={`${Math.round(15 * wedge)}%`} size={150} color={brand.accent} />
          </div>
        </>
      ) : null}
    </div>
  );
};

const Why: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const q = sp(frame, b.why.question, {damping: 9, stiffness: 180, mass: 0.8}, fps);
  return (
    <>
      <div style={at(540, 880)}>
        <Glitch t={t} at0={b.why.noReason} amount={90}>
          <Num value="15%" size={400} color={ORANGE} />
        </Glitch>
      </div>
      {t >= b.why.question ? (
        <div style={at(900, 700, {transform: `translate(-50%,-50%) rotate(${lerp(-60, 14, q)}deg) scale(${q})`, fontFamily: AR, fontWeight: 900, fontSize: 280, color: RED})}>؟</div>
      ) : null}
      <div style={at(540, 1200)}>
        <Stamp frame={frame} fps={fps} at={b.why.noReason + 0.05} text="مفيش سبب" color={RED} size={84} rotate={-8} />
      </div>
    </>
  );
};

const Term: React.FC<{children: React.ReactNode; color: string}> = ({children, color}) => (
  <div style={{padding: '26px 48px', borderRadius: 32, background: PANEL, border: `3px solid ${rgba(color, 0.55)}`, boxShadow: '0 26px 60px rgba(0,0,0,0.4)'}}>{children}</div>
);

const Bluejay: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const j = b.bluejay;
  const c = fly(frame, fps, j.companies - 0.08, FAST);
  const x = sp(frame, j.times, SNAP, fps);
  const p = fly(frame, fps, j.price - 0.08, FAST);
  const line = prog(t, j.equals, j.equals + 0.4, easeInOut);
  const tot = sp(frame, j.total, SNAP, fps);
  return (
    <>
      <div style={at(540 + 900 * (1 - c.k), 690, {filter: blur(mblur(c.v, 900))})}>
        <Term color={RED}>
          <Figure n={2} label="مليون شركة" size={124} color={RED} brand={brand} />
        </Term>
      </div>
      {t >= j.times ? (
        <div style={at(540, 850, {transform: `translate(-50%,-50%) scale(${x}) rotate(${(1 - x) * 90}deg)`})}>
          <Num value="×" size={120} color={brand.accent} />
        </div>
      ) : null}
      <div style={at(540 - 900 * (1 - p.k), 1010, {filter: blur(mblur(p.v, 900))})}>
        <Term color={brand.accent}>
          <Figure n={36} label="ألف دولار / سنة" size={116} color={brand.accent} brand={brand} />
        </Term>
      </div>
      {t >= j.equals ? (
        <div style={at(540, 1125, {width: 760 * line, height: 6, borderRadius: 3, background: brand.text, opacity: 0.85})} />
      ) : null}
      {t >= j.total ? (
        <div style={at(540, 1250, {transform: `translate(-50%,-50%) scale(${2.2 - 1.2 * tot})`, filter: blur(16 * (1 - tot)), opacity: clamp01(tot * 2)})}>
          <Figure n={rollTo(t, j.total, j.total + 0.45, 0, 72)} label="مليار دولار" size={150} color={RED} brand={brand} />
        </div>
      ) : null}
    </>
  );
};

const Where: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const f = sp(frame, b.where.focus - 0.1, {damping: 16, stiffness: 140, mass: 0.9}, fps);
  const q = sp(frame, b.where.focus + 0.25, {damping: 9, stiffness: 180, mass: 0.8}, fps);
  return (
    <>
      <div style={at(540, 860, {transform: `translate(-50%,-50%) scale(${lerp(2.4, 1.35, f)})`, filter: blur(18 * (1 - f)), opacity: clamp01(f * 2)})}>
        <Glitch t={t} at0={b.where.from + 0.44} amount={50}>
          <Term color={RED}>
            <Figure n={2} label="مليون شركة" size={124} color={RED} brand={brand} />
          </Term>
        </Glitch>
      </div>
      <div style={at(905, 680, {transform: `translate(-50%,-50%) rotate(${lerp(-60, 14, q)}deg) scale(${q})`, fontFamily: AR, fontWeight: 900, fontSize: 240, color: RED, opacity: clamp01(q * 2)})}>؟</div>
      <div style={at(540, 1180)}>
        <Stamp frame={frame} fps={fps} at={b.where.from} text="جايين منين؟" color={RED} size={80} rotate={7} />
      </div>
    </>
  );
};

const Score: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const rows = [
    {name: 'Airbnb', y: 780, color: ORANGE},
    {name: 'Bluejay', y: 1010, color: RED},
  ];
  return (
    <>
      {rows.map((row, ri) => {
        const e = fly(frame, fps, b.scenes.score + 0.05 + ri * 0.08, FAST);
        return (
          <div key={row.name} style={{position: 'absolute', inset: 0, transform: `translateX(${(ri ? -1 : 1) * 900 * (1 - e.k)}px)`, filter: blur(mblur(e.v, 900))}}>
            <div style={at(850, row.y, {fontFamily: 'Inter Variable, Inter', fontWeight: 800, fontSize: 54, color: brand.text})}>{row.name}</div>
            {[0, 1, 2, 3, 4].map((i) => {
              const on = i < 3;
              const k = on ? sp(frame, b.score.dots + ri * 0.12 + i * 0.09, SNAP, fps) : 0;
              const x = 620 - i * 104;
              return (
                <div key={i} style={at(x, row.y, {width: 76, height: 76, borderRadius: 38, border: `4px solid ${on ? row.color : 'rgba(255,255,255,0.18)'}`, boxSizing: 'border-box'})}>
                  <div style={{width: '100%', height: '100%', borderRadius: 38, background: row.color, transform: `scale(${k})`}} />
                </div>
              );
            })}
          </div>
        );
      })}
      <div style={at(540, 1230, {opacity: prog(t, b.score.dots + 0.4, b.score.dots + 0.8, easeOut)})}>
        <Figure n={3} label="من 5" size={130} color={brand.accent} brand={brand} />
      </div>
    </>
  );
};

const Lesson: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const l = b.lesson;
  const yr = sp(frame, l.years, FAST, fps);
  const away = prog(t, l.big - 0.1, l.big + 0.25, easeIn);
  const tl = prog(t, l.years + 0.1, l.years + 0.9, easeInOut);
  const big = fly(frame, fps, l.big, FAST);
  const field = sp(frame, l.source, FAST, fps);
  const caret = Math.floor(t * 2.4) % 2 === 0;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - away, filter: blur(16 * away), transform: `scale(${1 + 0.2 * away})`}}>
        <div style={at(540, 800, {transform: `translate(-50%,-50%) scale(${1.8 - 0.8 * yr})`, filter: blur(20 * (1 - yr)), opacity: clamp01(yr * 2)})}>
          <Figure n={rollTo(t, l.years, l.years + 0.5, 0, 17)} label="سنة" size={300} color={brand.accent} brand={brand} />
        </div>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <line x1={900} y1={1060} x2={900 - 720 * tl} y2={1060} stroke="rgba(255,255,255,0.4)" strokeWidth={5} />
          <circle cx={900} cy={1060} r={14} fill={ORANGE} opacity={tl > 0 ? 1 : 0} />
          <circle cx={180} cy={1060} r={14} fill={RED} opacity={tl >= 1 ? 1 : 0} />
        </svg>
        <div style={at(900, 1120, {fontFamily: 'Inter Variable, Inter', fontWeight: 800, fontSize: 40, color: ORANGE, opacity: tl > 0 ? 1 : 0})}>2008</div>
        <div style={at(180, 1120, {fontFamily: 'Inter Variable, Inter', fontWeight: 800, fontSize: 40, color: RED, opacity: tl >= 1 ? 1 : 0})}>2025</div>
        <div style={at(540, 1240, {opacity: prog(t, l.same, l.same + 0.4, easeOut)})}>
          <Chip text="والغلطة هي هي" color={RED} brand={brand} size={44} />
        </div>
      </div>
      {t >= l.big ? (
        <div style={at(540 + 900 * (1 - big.k), 760, {filter: blur(mblur(big.v, 900))})}>
          <Glitch t={t} at0={l.noSource} amount={70}>
            <Num value="72,000,000,000" size={118} color={brand.text} />
          </Glitch>
        </div>
      ) : null}
      {t >= l.source ? (
        <div dir="rtl" style={at(540, 960, {transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * field})`, opacity: clamp01(field * 2), display: 'flex', alignItems: 'center', gap: 22, padding: '26px 40px', width: 760, boxSizing: 'border-box', borderRadius: 26, background: PANEL, border: '2px solid rgba(255,255,255,0.12)'})}>
          <div style={{fontFamily: AR, fontWeight: 900, fontSize: 52, color: brand.muted}}>المصدر:</div>
          <div style={{flex: 1, height: 4, background: 'rgba(255,255,255,0.15)', marginTop: 30, position: 'relative'}}>
            <div style={{position: 'absolute', right: 4, bottom: 10, width: 5, height: 56, background: brand.accent, opacity: caret ? 1 : 0}} />
          </div>
        </div>
      ) : null}
      <div style={at(540, 1200)}>
        <Stamp frame={frame} fps={fps} at={l.noSource} text="بدون مصدر" color={RED} size={88} rotate={-8} />
      </div>
    </>
  );
};

export const ReelE01_2: React.FC<Reel2Props> = (p) => {
  const b = p.beats;
  const s = b.scenes;
  const plan: [number, Pose][] = [
    [-1, POSE.center],
    [s.market, {x: 540, y: 900, size: 170}],
    [s.airbnb - 0.1, POSE.top],
  ];
  return (
    <ReelShell
      p={p}
      markPlan={plan}
      cuts={[s.airbnb, s.bluejay, s.score, s.cta]}
      hook={(t) => <Hook t={t} at0={b.intro.mark} brand={p.brand} />}
    >
      {({frame, fps, t}) => {
        const ctx = {frame, fps, t, b, brand: p.brand};
        return (
          <>
            <Scene t={t} from={s.market} to={s.airbnb}>
              <Market {...ctx} />
            </Scene>
            <Scene t={t} from={s.airbnb} to={s.why}>
              <Airbnb {...ctx} />
            </Scene>
            <Scene t={t} from={s.why} to={s.bluejay}>
              <Why {...ctx} />
            </Scene>
            <Scene t={t} from={s.bluejay} to={s.where}>
              <Bluejay {...ctx} />
            </Scene>
            <Scene t={t} from={s.where} to={s.score}>
              <Where {...ctx} />
            </Scene>
            <Scene t={t} from={s.score} to={s.lesson}>
              <Score {...ctx} />
            </Scene>
            <Scene t={t} from={s.lesson} to={s.cta}>
              <Lesson {...ctx} />
            </Scene>
          </>
        );
      }}
    </ReelShell>
  );
};
