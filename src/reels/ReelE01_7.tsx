import React from 'react';
import {AR, Brand, LATIN, rgba, ShortProps} from '../shorts/Short';
import {
  at,
  blur,
  Chip,
  clamp01,
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
  rollTo,
  Scene,
  SHARDS,
  sp,
  SNAP,
} from './kit';

// E01 short 7: "what changed in 17 years?" (the takeaway). Voice from the episode; visuals
// rebuilt in code on the words in reels/E01-7.beats.json. Ends on a focus pull: clearer,
// not prettier.

type Beats = {
  scenes: {intro: number; changed: number; same: number; deal: number; meeting: number; final: number; cta: number};
  headlines: [number, string][];
  intro: {ribbons: number; mark: number};
  changed: {shorter: number; numbers: number; numbersFirst: number; team: number; teamFirst: number};
  same: {title: number; q1: number; q2: number; q3: number};
  deal: {decks: number; close: number};
  meeting: {start: number; end: number};
  final: {deck: number; prettier: number; clearer: number; sharp: number};
  pulses: number[];
  shake: number[];
  ctaHold: number;
};
export type Reel7Props = ShortProps & {beats: Beats};

const ORANGE = SHARDS[1];
const RED = SHARDS[0];
const PANEL = '#3A4049';
type Ctx = {frame: number; fps: number; t: number; b: Beats; brand: Brand};

const Hook: React.FC<{t: number; at0: number; brand: Brand}> = ({t, at0, brand}) => {
  const k = prog(t, at0, at0 + 0.4, easeIn);
  if (k >= 1) return null;
  return (
    <div style={at(540, 790, {transform: `translate(-50%,-50%) scale(${1 + 0.6 * k})`, filter: blur(24 * k), opacity: 1 - k})}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Num value={17} size={560} color={brand.accent} style={{textShadow: `0 30px 120px ${rgba(brand.accent, 0.4)}`}} />
        <div style={{fontFamily: AR, fontWeight: 900, fontSize: 120, color: brand.text, marginTop: -40}}>سنة؟</div>
      </div>
    </div>
  );
};

/** Sections of a deck; numbers then team jump to the front, as the decks did over 17 years. */
const Changed: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const c = b.changed;
  const cards = ['المشكلة', 'الحل', 'السوق', 'الأرقام', 'الفريق'];
  const orders = [
    [0, 1, 2, 3, 4],
    [1, 2, 3, 0, 4],
    [2, 3, 4, 1, 0],
  ];
  const k1 = sp(frame, c.numbersFirst - 0.3, {damping: 16, stiffness: 130, mass: 0.9}, fps);
  const k2 = sp(frame, c.teamFirst - 0.3, {damping: 16, stiffness: 130, mass: 0.9}, fps);
  const chip = sp(frame, c.shorter - 0.4, FAST, fps);
  return (
    <>
      <div style={at(540, 650, {opacity: clamp01(chip * 2), transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * chip})`})}>
        <Figure n={rollTo(t, c.shorter - 0.3, c.shorter + 0.3, 14, 9)} label="سلايدات" size={120} color={brand.accent} brand={brand} />
      </div>
      {cards.map((label, i) => {
        const slot = lerp(lerp(orders[0][i], orders[1][i], k1), orders[2][i], k2);
        const e = sp(frame, b.scenes.changed + 0.1 + i * 0.06, FAST, fps);
        const moving = (i === 3 && k1 > 0.02 && k1 < 0.98) || (i === 4 && k2 > 0.02 && k2 < 0.98);
        const lit = (i === 3 && t >= c.numbers) || (i === 4 && t >= c.team);
        const swing = i === 3 ? Math.sin(k1 * Math.PI) : i === 4 ? Math.sin(k2 * Math.PI) : 0;
        return (
          <div
            key={label}
            dir="rtl"
            style={at(540 + 220 * swing, 830 + slot * 128, {
              width: 560,
              height: 104,
              borderRadius: 26,
              background: lit ? rgba(brand.accent, 0.16) : PANEL,
              border: `3px solid ${lit ? brand.accent : 'rgba(255,255,255,0.1)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '0 30px',
              boxSizing: 'border-box',
              fontFamily: AR,
              fontWeight: 900,
              fontSize: 46,
              color: brand.text,
              opacity: clamp01(e * 2),
              transform: `translate(-50%,-50%) translateX(${300 * (1 - e)}px) scale(${moving ? 1.08 : 1})`,
              zIndex: moving ? 5 : 1,
              boxShadow: moving ? `0 20px 60px ${rgba(brand.accent, 0.35)}` : '0 14px 36px rgba(0,0,0,0.35)',
            })}
          >
            <div style={{width: 54, height: 54, borderRadius: 27, background: lit ? brand.accent : 'rgba(255,255,255,0.12)', color: lit ? brand.bgDeep : brand.muted, fontFamily: LATIN, fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {Math.round(slot) + 1}
            </div>
            {label}
          </div>
        );
      })}
    </>
  );
};

const Same: React.FC<Ctx> = ({frame, fps, b, brand}) => {
  const s = b.same;
  const qs = [
    {text: 'الرقم ده جاي منين؟', at0: s.q1},
    {text: 'هتكسب إزاي؟', at0: s.q2},
    {text: 'مين منافسك؟', at0: s.q3},
  ];
  const head = sp(frame, b.scenes.same + 0.1, FAST, fps);
  return (
    <>
      <div style={at(540, 680, {transform: `translate(-50%,-50%) scale(${head})`, display: 'flex', alignItems: 'center', gap: 18})}>
        <svg width="90" height="90" viewBox="0 0 150 150">
          <circle cx={75} cy={56} r={34} fill="#8A929C" />
          <path d="M18 146 C 22 100, 128 100, 132 146 Z" fill="#8A929C" />
        </svg>
        <div style={{fontFamily: AR, fontWeight: 900, fontSize: 48, color: brand.muted, whiteSpace: 'nowrap'}}>المستثمر لسه بيسأل</div>
      </div>
      {qs.map((q, i) => {
        const f = fly(frame, fps, q.at0 - 0.1, FAST);
        const side = i % 2 ? -1 : 1;
        const y = 860 + i * 170;
        return (
          <div key={q.text} style={at(540 + side * 1400 * (1 - f.k), y, {filter: blur(mblur(f.v, 1400))})}>
            <div dir="rtl" style={{width: 900, height: 132, borderRadius: 30, background: PANEL, border: `3px solid ${rgba(brand.accent, 0.6)}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', boxSizing: 'border-box'}}>
              <div style={{fontFamily: AR, fontWeight: 900, fontSize: 52, color: brand.text}}>{q.text}</div>
              <div style={{display: 'flex', gap: 10, direction: 'ltr'}}>
                {[['2008', ORANGE], ['2025', RED]].map(([y0, col]) => (
                  <div key={y0} style={{padding: '6px 14px', borderRadius: 12, background: rgba(col, 0.2), border: `2px solid ${col}`, fontFamily: LATIN, fontWeight: 800, fontSize: 26, color: brand.text}}>
                    {y0} ✓
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

const MiniDeck: React.FC<{year: string; color: string}> = ({year, color}) => (
  <div style={{width: 300, height: 200, borderRadius: 20, background: PANEL, border: `3px solid ${rgba(color, 0.6)}`, padding: 22, boxSizing: 'border-box', position: 'relative', boxShadow: '0 22px 50px rgba(0,0,0,0.4)'}}>
    <div style={{width: 160, height: 18, borderRadius: 5, background: 'rgba(255,255,255,0.8)', marginBottom: 14}} />
    {[210, 170].map((w) => (
      <div key={w} style={{width: w, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.2)', marginBottom: 10}} />
    ))}
    <div style={{position: 'absolute', left: 22, bottom: 16, fontFamily: LATIN, fontWeight: 900, fontSize: 40, color}}>{year}</div>
  </div>
);

const Deal: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const d = b.deal;
  const l = fly(frame, fps, d.decks - 0.1, FAST);
  const r = fly(frame, fps, d.decks, FAST);
  const arrows = prog(t, d.decks + 0.4, d.close, easeInOut);
  const x = sp(frame, d.close, SNAP, fps);
  return (
    <>
      <div style={at(760 + 700 * (1 - l.k), 780, {filter: blur(mblur(l.v, 700))})}>
        <MiniDeck year="2008" color={ORANGE} />
      </div>
      <div style={at(320 - 700 * (1 - r.k), 780, {filter: blur(mblur(r.v, 700))})}>
        <MiniDeck year="2025" color={RED} />
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={760} y1={890} x2={lerp(760, 590, arrows)} y2={lerp(890, 1080, arrows)} stroke="rgba(255,255,255,0.45)" strokeWidth={6} strokeDasharray="14 10" />
        <line x1={320} y1={890} x2={lerp(320, 490, arrows)} y2={lerp(890, 1080, arrows)} stroke="rgba(255,255,255,0.45)" strokeWidth={6} strokeDasharray="14 10" />
      </svg>
      <div style={at(540, 1180, {display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: prog(t, d.decks + 0.3, d.decks + 0.7, easeOut)})}>
        <svg width="120" height="130" viewBox="0 0 120 130">
          <rect x={14} y={56} width={92} height={68} rx={14} fill={brand.accent} />
          <path d="M34 56 V36 a26 26 0 0 1 52 0 V56" stroke={brand.accent} strokeWidth={12} fill="none" />
        </svg>
        <div style={{fontFamily: AR, fontWeight: 900, fontSize: 52, color: brand.text}}>قفل الجولة</div>
      </div>
      {t >= d.close ? (
        <div style={at(540, 1000, {transform: `translate(-50%,-50%) scale(${2.2 - 1.2 * x}) rotate(${(1 - x) * 40}deg)`, opacity: clamp01(x * 2)})}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <path d="M40 40 L160 160 M160 40 L40 160" stroke={RED} strokeWidth={26} strokeLinecap="round" />
          </svg>
        </div>
      ) : null}
    </>
  );
};

const Meeting: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const m = b.meeting;
  const p = prog(t, m.start, m.end, (v) => v);
  const done = sp(frame, m.end, {damping: 10, stiffness: 200, mass: 0.7}, fps);
  const w = 860;
  const x0 = 540 + w / 2;
  const xd = x0 - w * p;
  return (
    <>
      <div style={at(540, 860, {fontFamily: AR, fontWeight: 900, fontSize: 70, color: brand.text})}>الاجتماع</div>
      <div style={{position: 'absolute', left: 540 - w / 2, top: 1000, width: w, height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.1)'}} />
      <div style={{position: 'absolute', left: xd, top: 1000, width: x0 - xd, height: 26, borderRadius: 13, background: `linear-gradient(270deg, ${ORANGE}, ${brand.accent})`}} />
      <div style={at(xd, 1013, {width: 70, height: 70, borderRadius: 35, background: brand.accent, boxShadow: `0 0 40px ${rgba(brand.accent, 0.6)}`, opacity: t >= m.start - 0.2 ? 1 : 0})} />
      <div style={at(x0 - 20, 1090, {fontFamily: AR, fontWeight: 700, fontSize: 34, color: brand.muted})}>البداية</div>
      <div style={at(540 - w / 2 + 40, 1090, {fontFamily: AR, fontWeight: 700, fontSize: 34, color: brand.muted})}>النهاية</div>
      {t >= m.end ? (
        <div style={at(540, 1240, {transform: `translate(-50%,-50%) scale(${done})`, display: 'flex', alignItems: 'center', gap: 20})}>
          <svg width="90" height="90" viewBox="0 0 56 56">
            <circle cx={28} cy={28} r={26} fill={brand.accent} />
            <path d="M15 29 L25 38 L42 19" stroke={brand.bgDeep} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{fontFamily: AR, fontWeight: 900, fontSize: 80, color: brand.accent}}>للآخر</div>
        </div>
      ) : null}
    </>
  );
};

/** Prettier gets struck out; clearer pulls into focus. */
const Final: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const f = b.final;
  const lead = sp(frame, f.deck - 0.2, FAST, fps);
  const pretty = sp(frame, f.deck + 0.3, FAST, fps);
  const strike = prog(t, f.prettier, f.prettier + 0.35, easeInOut);
  const gone = prog(t, f.clearer - 0.15, f.clearer + 0.2, easeIn);
  const appear = prog(t, f.clearer, f.clearer + 0.3, easeOut);
  const focus = prog(t, f.sharp - 0.35, f.sharp, easeIn);
  const punch = t >= f.sharp ? 1 + 0.12 * Math.exp(-(t - f.sharp) * 8) : 1;
  return (
    <>
      <div style={at(540, 720, {opacity: clamp01(lead * 2), fontFamily: AR, fontWeight: 900, fontSize: 64, color: brand.muted, whiteSpace: 'nowrap'})}>عرضك مش محتاج يبقى</div>
      <div style={at(540, 950, {opacity: clamp01(pretty * 2) * (1 - gone), transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * pretty - 0.2 * gone})`, filter: blur(14 * gone)})}>
        <div style={{position: 'relative'}}>
          <div style={{fontFamily: AR, fontWeight: 900, fontSize: 210, background: `linear-gradient(90deg, ${SHARDS[0]}, ${SHARDS[1]}, ${SHARDS[2]})`, WebkitBackgroundClip: 'text', color: 'transparent', textShadow: 'none'}}>أحلى</div>
          {[[-40, -20], [440, 10], [400, 230], [-10, 220]].map(([x, y], i) => (
            <div key={i} style={{position: 'absolute', left: x, top: y, fontSize: 60, color: SHARDS[(i + 2) % 3], transform: `rotate(${t * 90 + i * 40}deg)`}}>✦</div>
          ))}
          <div style={{position: 'absolute', left: -20, right: -20, top: '52%', height: 22, borderRadius: 11, background: RED, transform: `scaleX(${strike}) rotate(-4deg)`, transformOrigin: 'right center'}} />
        </div>
      </div>
      {t >= f.clearer ? (
        <div style={at(540, 1020, {opacity: appear, transform: `translate(-50%,-50%) scale(${punch})`, filter: blur(30 * (1 - focus))})}>
          <div style={{fontFamily: AR, fontWeight: 900, fontSize: 260, color: brand.text, textShadow: focus >= 1 ? `0 0 60px ${rgba(brand.accent, 0.35)}` : 'none'}}>أوضح</div>
        </div>
      ) : null}
      {t >= f.sharp ? (
        <div style={at(540, 1250, {opacity: prog(t, f.sharp, f.sharp + 0.3, easeOut)})}>
          <Chip text="الوضوح بيكسب الاجتماع" color={brand.accent} brand={brand} size={40} />
        </div>
      ) : null}
    </>
  );
};

export const ReelE01_7: React.FC<Reel7Props> = (p) => {
  const b = p.beats;
  const s = b.scenes;
  const plan: [number, Pose][] = [
    [-1, POSE.center],
    [s.changed, POSE.top],
  ];
  return (
    <ReelShell p={p} markPlan={plan} cuts={[s.same, s.deal, s.final, s.cta]} hook={(t) => <Hook t={t} at0={b.intro.mark} brand={p.brand} />}>
      {({frame, fps, t}) => {
        const ctx = {frame, fps, t, b, brand: p.brand};
        return (
          <>
            <Scene t={t} from={s.changed} to={s.same}>
              <Changed {...ctx} />
            </Scene>
            <Scene t={t} from={s.same} to={s.deal}>
              <Same {...ctx} />
            </Scene>
            <Scene t={t} from={s.deal} to={s.meeting}>
              <Deal {...ctx} />
            </Scene>
            <Scene t={t} from={s.meeting} to={s.final}>
              <Meeting {...ctx} />
            </Scene>
            <Scene t={t} from={s.final} to={s.cta}>
              <Final {...ctx} />
            </Scene>
          </>
        );
      }}
    </ReelShell>
  );
};
