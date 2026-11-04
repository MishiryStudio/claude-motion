import React from 'react';
import {AR, Brand, LATIN, rgba, ShortProps} from '../shorts/Short';
import {
  at,
  blur,
  Chip,
  clamp01,
  Dots5,
  easeIn,
  easeInOut,
  easeOut,
  Figure,
  fly,
  FAST,
  lerp,
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

// E01 short 5: "asked for 2.5M, closed at 4M" (the ask). Voice from the episode; visuals
// rebuilt in code on the words in reels/E01-5.beats.json. The 4M close is attributed on
// screen to the investor's announcement, as in the episode.

type Beats = {
  scenes: {intro: number; ask: number; use: number; score: number; both: number; note: number; round: number; fair: number; ceiling: number; cta: number};
  headlines: [number, string][];
  intro: {ribbons: number; mark: number};
  ask: {amount: number};
  use: {revenue: number; team: number; growth: number; pct: number; month: number};
  score: {dots: number};
  both: {amount: number; target: number; check: number};
  note: {flip: number};
  round: {asked: number; closed: number; four: number; source: number};
  fair: {not: number; deck: number; cause: number};
  ceiling: {number: number; asked: number; not: number; break: number};
  pulses: number[];
  shake: number[];
  ctaHold: number;
};
export type Reel5Props = ShortProps & {beats: Beats};

const ORANGE = SHARDS[1];
const RED = SHARDS[0];
const PANEL = '#3A4049';
type Ctx = {frame: number; fps: number; t: number; b: Beats; brand: Brand};

const Hook: React.FC<{t: number; at0: number; brand: Brand}> = ({t, at0, brand}) => {
  const k = prog(t, at0, at0 + 0.4, easeIn);
  if (k >= 1) return null;
  return (
    <div style={at(540, 800, {transform: `translate(-50%,-50%) scale(${1 + 0.6 * k})`, filter: blur(24 * k), opacity: 1 - k})}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, direction: 'ltr'}}>
        <div style={{position: 'relative', opacity: 0.55}}>
          <Num value="2.5" size={190} color={brand.text} />
          <div style={{position: 'absolute', left: -8, right: -8, top: '50%', height: 14, borderRadius: 7, background: RED, transform: 'rotate(-8deg)'}} />
        </div>
        <svg width="110" height="60" viewBox="0 0 110 60"><path d="M4 30 H92 M70 8 L100 30 L70 52" stroke={brand.muted} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <Num value={4} size={520} color={brand.accent} style={{textShadow: `0 30px 120px ${rgba(brand.accent, 0.4)}`}} />
      </div>
      <div style={{textAlign: 'center', fontFamily: AR, fontWeight: 900, fontSize: 110, color: brand.text, marginTop: -40}}>مليون دولار</div>
    </div>
  );
};

const Ask: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const k = sp(frame, b.ask.amount, FAST, fps);
  const v = lerp(0, 2.5, prog(t, b.ask.amount, b.ask.amount + 0.6, easeOut));
  return (
    <>
      <div style={at(540, 760, {opacity: prog(t, b.scenes.ask, b.scenes.ask + 0.3, easeOut)})}>
        <Chip text="المعيار 8 · طلب التمويل" color={brand.accent} brand={brand} size={36} />
      </div>
      {t >= b.ask.amount ? (
        <div style={at(540, 980, {transform: `translate(-50%,-50%) scale(${1.8 - 0.8 * k})`, filter: blur(16 * (1 - k)), opacity: clamp01(k * 2)})}>
          <Figure n={v.toFixed(1)} label="مليون $" size={260} color={brand.accent} brand={brand} />
        </div>
      ) : null}
    </>
  );
};

const Use: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const u = b.use;
  const items = [
    {text: 'إيراد شهري معين · في سنة', at0: u.revenue, y: 660},
    {text: 'نعيّن فريق', at0: u.team, y: 820},
  ];
  const g = sp(frame, u.growth, FAST, fps);
  return (
    <>
      {items.map((it, i) => {
        const f = fly(frame, fps, it.at0, FAST);
        const side = i % 2 ? 1 : -1;
        return (
          <div key={it.text} dir="rtl" style={at(540 + side * 900 * (1 - f.k), it.y, {filter: blur(mblur(f.v, 900)), display: 'flex', alignItems: 'center', gap: 22, padding: '24px 40px', borderRadius: 28, background: PANEL, border: '2px solid rgba(255,255,255,0.1)', width: 820, boxSizing: 'border-box'})}>
            <div style={{width: 64, height: 64, borderRadius: 32, background: rgba(brand.accent, 0.18), border: `3px solid ${brand.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LATIN, fontWeight: 900, fontSize: 30, color: brand.accent}}>{i + 1}</div>
            <div style={{fontFamily: AR, fontWeight: 900, fontSize: 50, color: brand.text}}>{it.text}</div>
          </div>
        );
      })}
      {t >= u.growth ? (
        <div style={{position: 'absolute', inset: 0, opacity: clamp01(g * 2), transform: `translateY(${80 * (1 - g)}px)`}}>
          {/* Twelve months compounding at 15%. */}
          {Array.from({length: 12}).map((_, i) => {
            const h = 34 * Math.pow(1.15, i) * prog(t, u.pct + i * 0.06, u.pct + i * 0.06 + 0.4, easeOut);
            return <div key={i} style={{position: 'absolute', left: 140 + i * 68, top: 1330 - h, width: 48, height: h, borderRadius: 10, background: i === 11 ? brand.accent : rgba(brand.accent, 0.35 + i * 0.05)}} />;
          })}
          <div style={at(540, 1360, {width: 860, height: 4, background: 'rgba(255,255,255,0.2)'})} />
          <div style={at(330, 1010)}>
            <Figure n="15%" label="كل شهر" size={120} color={brand.accent} brand={brand} />
          </div>
        </div>
      ) : null}
    </>
  );
};

const Score: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const k = sp(frame, b.score.dots, SNAP, fps);
  return (
    <>
      {t >= b.score.dots ? (
        <div style={at(540, 860, {transform: `translate(-50%,-50%) scale(${2.2 - 1.2 * k})`, filter: blur(16 * (1 - k)), opacity: clamp01(k * 2)})}>
          <Figure n={4} label="من 5" size={300} color={RED} brand={brand} />
        </div>
      ) : null}
      <Dots5 frame={frame} fps={fps} at0={b.score.dots} filled={4} color={RED} y={1160} />
    </>
  );
};

const Both: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const bo = b.both;
  const rows = [
    {name: 'Airbnb', amount: '500 ألف $', target: '80 ألف حجز · 12 شهر', color: ORANGE, y: 760},
    {name: 'Bluejay', amount: '2.5 مليون $', target: 'إيراد شهري · خلال سنة', color: RED, y: 1060},
  ];
  return (
    <>
      {rows.map((r, i) => {
        const f = fly(frame, fps, b.scenes.both + 0.1 + i * 0.12, FAST);
        const tg = sp(frame, bo.target + i * 0.12, FAST, fps);
        const ok = sp(frame, bo.check + i * 0.1, SNAP, fps);
        return (
          <div key={r.name} style={{position: 'absolute', inset: 0, transform: `translateX(${(i ? -1 : 1) * 900 * (1 - f.k)}px)`, filter: blur(mblur(f.v, 900))}}>
            <div style={at(540, r.y - 120, {fontFamily: LATIN, fontWeight: 900, fontSize: 60, color: r.color})}>{r.name}</div>
            <div dir="rtl" style={at(540, r.y, {display: 'flex', alignItems: 'center', gap: 22})}>
              <Chip text={r.amount} color={r.color} brand={brand} size={46} />
              <svg width="70" height="40" viewBox="0 0 70 40" style={{opacity: tg, transform: 'scaleX(-1)'}}>
                <path d="M4 20 H56 M40 6 L60 20 L40 34" stroke={brand.muted} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{opacity: clamp01(tg * 2), transform: `scale(${0.7 + 0.3 * tg})`}}>
                <Chip text={r.target} color={brand.accent} brand={brand} size={40} />
              </div>
              <svg width="56" height="56" viewBox="0 0 56 56" style={{transform: `scale(${ok})`}}>
                <circle cx={28} cy={28} r={26} fill={brand.accent} />
                <path d="M15 29 L25 38 L42 19" stroke={brand.bgDeep} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        );
      })}
    </>
  );
};

const Note: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const k = sp(frame, b.note.flip, {damping: 13, stiffness: 150, mass: 0.8}, fps);
  return (
    <div style={at(540, 900, {transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - k) * 90}deg) rotate(-3deg)`, opacity: clamp01(k * 2)})}>
      <div style={{width: 720, padding: '50px 54px', boxSizing: 'border-box', borderRadius: 12, background: '#FFE27A', boxShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>
        <div style={{width: 120, height: 24, background: 'rgba(255,255,255,0.6)', margin: '-70px auto 30px', transform: 'rotate(2deg)'}} />
        <div dir="rtl" style={{fontFamily: AR, fontWeight: 900, fontSize: 78, color: '#2A2A2A', textAlign: 'center'}}>معلومة على الهامش</div>
        <div style={{height: 4, background: 'rgba(0,0,0,0.15)', marginTop: 26}} />
        <div style={{height: 4, background: 'rgba(0,0,0,0.15)', marginTop: 26, width: '70%', marginInline: 'auto'}} />
      </div>
    </div>
  );
};

/** The money bar: fills to the 2.5M ask, then punches through it to 4M. */
const Round: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const r = b.round;
  const base = 1340;
  const per = 150; // px per million
  const v = lerp(0, 2.5, prog(t, r.asked - 0.4, r.asked + 0.4, easeOut)) + 1.5 * prog(t, r.closed, r.four + 0.25, easeIn);
  const h = per * v;
  const target = base - per * 2.5;
  const broke = t >= r.four;
  const four = sp(frame, r.four, SNAP, fps);
  const src = sp(frame, r.source, FAST, fps);
  return (
    <>
      <div style={{position: 'absolute', left: 460, top: base - per * 4.4, width: 160, height: per * 4.4, borderRadius: 28, background: 'rgba(255,255,255,0.06)'}} />
      <div style={{position: 'absolute', left: 460, top: base - h, width: 160, height: h, borderRadius: 28, background: broke ? `linear-gradient(180deg, ${brand.accent}, ${ORANGE})` : ORANGE, boxShadow: `0 0 ${broke ? 80 : 30}px ${rgba(broke ? brand.accent : ORANGE, 0.5)}`}} />
      {/* The 2.5M line: whole until the bar hits it, then it splits. */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {broke ? (
          <>
            <line x1={160} y1={target} x2={430 - 120 * four} y2={target + 60 * four} stroke={RED} strokeWidth={7} strokeDasharray="18 12" opacity={1 - 0.5 * four} />
            <line x1={650 + 120 * four} y1={target - 60 * four} x2={920} y2={target} stroke={RED} strokeWidth={7} strokeDasharray="18 12" opacity={1 - 0.5 * four} />
          </>
        ) : (
          <line x1={160} y1={target} x2={920} y2={target} stroke={RED} strokeWidth={7} strokeDasharray="18 12" opacity={prog(t, r.asked - 0.2, r.asked + 0.2, easeOut)} />
        )}
      </svg>
      <div style={at(250, target - 40, {fontFamily: AR, fontWeight: 900, fontSize: 40, color: RED, opacity: prog(t, r.asked, r.asked + 0.3, easeOut)})}>المطلوب</div>
      <div style={at(830, base - h - 10, {})}>
        <Num value={`${v.toFixed(1)}M`} size={broke ? 150 : 110} color={broke ? brand.accent : brand.text} style={{transform: `scale(${broke ? 1 + 0.25 * Math.exp(-(t - r.four) * 8) : 1})`}} />
      </div>
      {broke
        ? SHARDS.map((c, i) =>
            [0, 1, 2].map((j) => {
              const dir = (i * 3 + j) % 2 ? 1 : -1;
              const kk = prog(t, r.four, r.four + 0.9, easeOut);
              return (
                <div key={`${i}-${j}`} style={at(540 + dir * (120 + 260 * kk) * (1 + j * 0.4), target - 200 * kk * (0.6 + 0.3 * i) + 260 * kk * kk, {width: 46, height: 18, background: c, transform: `translate(-50%,-50%) rotate(${dir * 400 * kk}deg)`, opacity: 1 - kk})} />
              );
            }),
          )
        : null}
      {t >= r.source ? (
        <div style={at(540, 1430 - 30, {opacity: clamp01(src * 2), transform: `translate(-50%,-50%) translateY(${40 * (1 - src)}px)`})}>
          <Chip text="المصدر: إعلان المستثمر Homebrew" color="#9AA3AD" brand={brand} size={30} />
        </div>
      ) : null}
    </>
  );
};

const Fair: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const f = b.fair;
  const l = fly(frame, fps, f.deck - 0.2, FAST);
  const r = fly(frame, fps, f.cause - 0.2, FAST);
  const neq = sp(frame, f.not, SNAP, fps);
  return (
    <>
      <div style={at(820 + 600 * (1 - l.k), 900, {filter: blur(mblur(l.v, 600))})}>
        <div style={{padding: '30px 40px', borderRadius: 30, background: PANEL, border: `3px solid ${ORANGE}`, fontFamily: AR, fontWeight: 900, fontSize: 64, color: brand.text}}>العرض</div>
      </div>
      <div style={at(540, 900, {transform: `translate(-50%,-50%) scale(${neq})`})}>
        <svg width="140" height="120" viewBox="0 0 140 120">
          <path d="M20 45 H120 M20 80 H120" stroke={brand.text} strokeWidth={12} strokeLinecap="round" />
          <path d="M95 10 L45 110" stroke={RED} strokeWidth={12} strokeLinecap="round" />
        </svg>
      </div>
      <div style={at(250 - 600 * (1 - r.k), 900, {filter: blur(mblur(r.v, 600))})}>
        <div style={{padding: '30px 40px', borderRadius: 30, background: PANEL, border: `3px solid ${brand.accent}`, fontFamily: AR, fontWeight: 900, fontSize: 64, color: brand.text}}>السبب</div>
      </div>
      <div style={at(540, 1140, {opacity: prog(t, f.cause, f.cause + 0.3, easeOut)})}>
        <Chip text="الجولة الأكبر ≠ دليل إن العرض هو السبب" color="#9AA3AD" brand={brand} size={32} />
      </div>
    </>
  );
};

/** The ask as a glass ceiling that the number breaks through, in logo shards. */
const Ceiling: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const c = b.ceiling;
  const num = sp(frame, c.number, FAST, fps);
  const push = prog(t, c.not - 0.1, c.break, easeIn);
  const broke = t >= c.break;
  const kk = prog(t, c.break, c.break + 0.9, easeOut);
  const y = lerp(1060, 960, num) - 160 * push - (broke ? 110 * kk : 0);
  return (
    <>
      {!broke ? (
        <div style={at(540, 760, {width: 900, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.45)', boxShadow: '0 0 40px rgba(255,255,255,0.15)'})} />
      ) : (
        Array.from({length: 14}).map((_, i) => {
          const dir = i % 2 ? 1 : -1;
          const x = 120 + i * 60;
          return <div key={i} style={at(x + dir * 200 * kk, 760 - 180 * kk + 500 * kk * kk * (0.5 + (i % 3) * 0.3), {width: 54, height: 22, background: SHARDS[i % 3], transform: `translate(-50%,-50%) rotate(${dir * (200 + i * 30) * kk}deg)`, opacity: 1 - kk})} />;
        })
      )}
      {!broke ? <div style={at(860, 712, {fontFamily: AR, fontWeight: 900, fontSize: 40, color: brand.muted, opacity: 1 - push})}>سقف؟</div> : null}
      <div style={at(540, y, {opacity: clamp01(num * 2), transform: `translate(-50%,-50%) scale(${1 + 0.2 * push})`})}>
        <div dir="rtl" style={{padding: '22px 46px', borderRadius: 999, background: brand.accent, fontFamily: AR, fontWeight: 900, fontSize: 64, color: brand.bgDeep, whiteSpace: 'nowrap', boxShadow: `0 20px 60px ${rgba(brand.accent, 0.4)}`}}>
          الرقم اللي طلبته
        </div>
      </div>
      {broke ? (
        <div style={at(540, 1200, {transform: `translate(-50%,-50%) scale(${2 - sp(frame, c.break, SNAP, fps)})`, fontFamily: AR, fontWeight: 900, fontSize: 150, color: brand.text, whiteSpace: 'nowrap', opacity: kk > 0 ? 1 : 0})}>مش سقف</div>
      ) : null}
    </>
  );
};

export const ReelE01_5: React.FC<Reel5Props> = (p) => {
  const b = p.beats;
  const s = b.scenes;
  const plan: [number, Pose][] = [
    [-1, POSE.center],
    [s.ask, POSE.top],
  ];
  return (
    <ReelShell p={p} markPlan={plan} cuts={[s.use, s.both, s.round, s.ceiling, s.cta]} hook={(t) => <Hook t={t} at0={b.intro.mark} brand={p.brand} />}>
      {({frame, fps, t}) => {
        const ctx = {frame, fps, t, b, brand: p.brand};
        return (
          <>
            <Scene t={t} from={s.ask} to={s.use}>
              <Ask {...ctx} />
            </Scene>
            <Scene t={t} from={s.use} to={s.score}>
              <Use {...ctx} />
            </Scene>
            <Scene t={t} from={s.score} to={s.both}>
              <Score {...ctx} />
            </Scene>
            <Scene t={t} from={s.both} to={s.note}>
              <Both {...ctx} />
            </Scene>
            <Scene t={t} from={s.note} to={s.round}>
              <Note {...ctx} />
            </Scene>
            <Scene t={t} from={s.round} to={s.fair}>
              <Round {...ctx} />
            </Scene>
            <Scene t={t} from={s.fair} to={s.ceiling}>
              <Fair {...ctx} />
            </Scene>
            <Scene t={t} from={s.ceiling} to={s.cta}>
              <Ceiling {...ctx} />
            </Scene>
          </>
        );
      }}
    </ReelShell>
  );
};
