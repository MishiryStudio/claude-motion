import React from 'react';
import {AR, Brand, LATIN, rgba, ShortProps} from '../shorts/Short';
import {
  at,
  blur,
  Chip,
  clamp01,
  CriteriaStrip,
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
  rollTo,
  Scene,
  SHARDS,
  sp,
  SNAP,
} from './kit';

// E01 short 4: "Airbnb: zero numbers" (traction). Voice from the episode; visuals rebuilt
// in code on the words in reels/E01-4.beats.json. The Bluejay line is shown exactly as in
// their published deck ("$XXXk+ ARR in two weeks.").

type Beats = {
  scenes: {intro: number; weight: number; race: number; airbnb: number; bluejay: number; hidden: number; score: number; question: number; cta: number};
  headlines: [number, string][];
  intro: {ribbons: number; mark: number};
  weight: {four: number; weight: number; traction: number};
  race: {y2025: number; wins: number; gap: number};
  airbnb: {opinions: number; press: number; none: number; scan: number; zero: number; score: number};
  bluejay: {slides: number; third: number; focus: number; line: number; weeks: number};
  hidden: {exact: number; hide: number; place: number; third: number; message: number};
  score: {dots: number};
  question: {q: number; first: number; slide: number; which: number; fifth: number; move: number};
  pulses: number[];
  shake: number[];
  ctaHold: number;
};
export type Reel4Props = ShortProps & {beats: Beats};

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
        <Num value={0} size={620} color={RED} style={{textShadow: `0 30px 120px ${rgba(RED, 0.4)}`}} />
        <div style={{fontFamily: AR, fontWeight: 900, fontSize: 120, color: brand.text, marginTop: -40}}>أرقام</div>
      </div>
    </div>
  );
};

const Weight: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const w = sp(frame, b.weight.weight, {damping: 10, stiffness: 200, mass: 0.7}, fps);
  const tr = sp(frame, b.weight.traction, FAST, fps);
  return (
    <>
      <CriteriaStrip frame={frame} fps={fps} at0={b.scenes.weight} lit={4} litAt={b.scenes.weight + 0.15} brand={brand} y={820} />
      {t >= b.weight.weight ? (
        <div style={at(640, 690, {transform: `translate(-50%,-50%) scale(${w})`})}>
          <Chip text="الوزن 15 · الأكبر" color={brand.accent} brand={brand} size={34} />
        </div>
      ) : null}
      <div style={at(540, 1070, {opacity: clamp01(tr * 2), transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * tr})`, fontFamily: AR, fontWeight: 900, fontSize: 130, color: brand.text})}>التراكشن</div>
    </>
  );
};

const Race: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const r = b.race;
  const rows = [
    {label: '2025', color: RED, y: 820, v: 4, start: r.y2025},
    {label: '2008', color: ORANGE, y: 1020, v: 2, start: r.y2025 + 0.2},
  ];
  const gap = sp(frame, r.gap, {damping: 10, stiffness: 200, mass: 0.7}, fps);
  return (
    <>
      {rows.map((row) => {
        const k = prog(t, row.start, r.wins + 0.3, easeOut);
        return (
          <React.Fragment key={row.label}>
            <div style={at(930, row.y, {fontFamily: LATIN, fontWeight: 900, fontSize: 60, color: row.color})}>{row.label}</div>
            <div style={{position: 'absolute', right: 230, top: row.y - 45, height: 90, width: 760, borderRadius: 24, background: 'rgba(255,255,255,0.06)'}} />
            <div style={{position: 'absolute', right: 230, top: row.y - 45, height: 90, width: 760 * (row.v / 5) * k, borderRadius: 24, background: row.color, boxShadow: `0 0 40px ${rgba(row.color, 0.4)}`}} />
          </React.Fragment>
        );
      })}
      {t >= r.gap ? (
        <div style={at(320, 1180, {transform: `translate(-50%,-50%) scale(${gap})`})}>
          <Chip text="بفرق كبير" color={RED} brand={brand} size={40} />
        </div>
      ) : null}
    </>
  );
};

const Testimonial: React.FC<{brand: Brand}> = ({brand}) => (
  <div style={{width: 360, padding: 26, boxSizing: 'border-box', borderRadius: 26, background: PANEL, border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)'}}>
    <div style={{fontSize: 34, color: brand.accent, letterSpacing: 6}}>★★★★★</div>
    <div style={{fontFamily: 'Georgia, serif', fontSize: 70, lineHeight: 0.6, color: 'rgba(255,255,255,0.3)', marginTop: 10}}>“</div>
    {[260, 300, 200].map((w) => (
      <div key={w} style={{width: w, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.25)', marginTop: 12}} />
    ))}
  </div>
);

const Press: React.FC = () => (
  <div style={{width: 360, padding: 26, boxSizing: 'border-box', borderRadius: 18, background: '#ECE8E0', boxShadow: '0 20px 50px rgba(0,0,0,0.4)'}}>
    <div style={{fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 40, color: '#2A2A2A', borderBottom: '3px solid #2A2A2A', paddingBottom: 8}}>PRESS</div>
    <div style={{width: 280, height: 18, borderRadius: 4, background: '#3A3A3A', marginTop: 16}} />
    {[300, 270, 240].map((w) => (
      <div key={w} style={{width: w, height: 10, borderRadius: 5, background: 'rgba(0,0,0,0.25)', marginTop: 12}} />
    ))}
  </div>
);

const Airbnb: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const a = b.airbnb;
  const cards = [
    {kind: 'q', x: 300, y: 760, at0: a.opinions, side: -1, rot: -6},
    {kind: 'q', x: 760, y: 700, at0: a.opinions + 0.15, side: 1, rot: 5},
    {kind: 'p', x: 300, y: 1060, at0: a.press, side: -1, rot: 4},
    {kind: 'p', x: 770, y: 1010, at0: a.press + 0.15, side: 1, rot: -5},
  ];
  const scanK = prog(t, a.scan, a.zero, easeInOut);
  const dim = prog(t, a.zero - 0.1, a.zero + 0.3, easeIn);
  const z = sp(frame, a.zero, SNAP, fps);
  const sc = prog(t, a.score - 0.6, a.score - 0.2, easeInOut);
  // Magnifier sweeps the cards looking for a number.
  const mx = lerp(250, 830, (Math.sin(scanK * Math.PI * 1.5 - Math.PI / 2) + 1) / 2);
  const my = lerp(760, 1040, scanK);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - 0.75 * dim, filter: blur(8 * dim), transform: `scale(${1 - 0.08 * dim})`}}>
        {cards.map((c, i) => {
          const f = fly(frame, fps, c.at0, FAST);
          return (
            <div key={i} style={at(c.x + c.side * 900 * (1 - f.k), c.y, {transform: `translate(-50%,-50%) rotate(${c.rot + c.side * 20 * (1 - f.k)}deg)`, filter: blur(mblur(f.v, 900))})}>
              {c.kind === 'q' ? <Testimonial brand={brand} /> : <Press />}
            </div>
          );
        })}
        {t >= a.scan && t < a.zero + 0.2 ? (
          <svg width={180} height={180} viewBox="0 0 180 180" style={{position: 'absolute', left: mx - 70, top: my - 70}}>
            <circle cx={70} cy={70} r={52} fill="rgba(255,255,255,0.08)" stroke={brand.accent} strokeWidth={10} />
            <line x1={108} y1={108} x2={160} y2={160} stroke={brand.accent} strokeWidth={16} strokeLinecap="round" />
          </svg>
        ) : null}
      </div>
      {t >= a.zero ? (
        <div style={at(540, lerp(880, 760, sc), {transform: `translate(-50%,-50%) scale(${(2.4 - 1.4 * z) * lerp(1, 0.7, sc)})`, filter: blur(18 * (1 - z)), opacity: clamp01(z * 2)})}>
          <Figure n={0} label="أرقام" size={300} color={RED} brand={brand} />
        </div>
      ) : null}
      {t >= a.score - 0.2 ? <Dots5 frame={frame} fps={fps} at0={a.score} filled={2} color={ORANGE} y={1150} /> : null}
    </>
  );
};

const SlideThumb: React.FC<{n: number; w?: number; lit?: boolean; brand: Brand; children?: React.ReactNode}> = ({n, w = 200, lit, brand, children}) => (
  <div style={{width: w, height: w * 0.62, borderRadius: w * 0.07, background: '#F4F2EE', border: `${lit ? 6 : 2}px solid ${lit ? brand.accent : 'rgba(255,255,255,0.15)'}`, boxShadow: lit ? `0 0 50px ${rgba(brand.accent, 0.5)}` : '0 16px 40px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden', boxSizing: 'border-box'}}>
    {children ?? (
      <>
        <div style={{position: 'absolute', left: w * 0.1, top: w * 0.12, width: w * 0.5, height: w * 0.06, borderRadius: 4, background: '#3A4049'}} />
        <div style={{position: 'absolute', left: w * 0.1, top: w * 0.24, width: w * 0.7, height: w * 0.035, borderRadius: 4, background: 'rgba(0,0,0,0.18)'}} />
      </>
    )}
    <div style={{position: 'absolute', right: w * 0.06, bottom: w * 0.03, fontFamily: LATIN, fontWeight: 900, fontSize: w * 0.16, color: '#4A5361'}}>{n}</div>
  </div>
);

/** Bluejay's third slide, as published: "$XXXk+ ARR in two weeks." */
const ArrSlide: React.FC<{brand: Brand; redact: number}> = ({brand, redact}) => (
  <div style={{width: 900, height: 520, borderRadius: 34, background: '#FFFFFF', boxShadow: '0 30px 90px rgba(0,0,0,0.5)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{position: 'absolute', right: 30, top: 24, fontFamily: LATIN, fontWeight: 800, fontSize: 28, color: '#4A5361'}}>Bluejay</div>
    <div style={{padding: '26px 36px', border: `8px solid ${brand.accent}`, borderRadius: 10, fontFamily: LATIN, fontWeight: 900, fontSize: 52, color: '#151515', position: 'relative', whiteSpace: 'nowrap'}}>
      $<span style={{position: 'relative'}}>
        XXX
        <span style={{position: 'absolute', left: -6, right: -6, top: '12%', bottom: '12%', background: '#111', transform: `scaleX(${redact})`, transformOrigin: 'left center'}} />
      </span>
      k+ ARR in two weeks.
    </div>
    <div style={{position: 'absolute', left: 30, bottom: 22, fontFamily: LATIN, fontSize: 24, color: '#C0392B'}}>Do not distribute</div>
  </div>
);

const Bluejay: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const j = b.bluejay;
  const focus = prog(t, j.focus, j.focus + 0.6, easeInOut);
  const line = sp(frame, j.line, FAST, fps);
  const weeks = sp(frame, j.weeks, {damping: 10, stiffness: 200, mass: 0.7}, fps);
  return (
    <>
      {[1, 2, 3].map((n, i) => {
        const f = fly(frame, fps, j.slides + i * 0.08, FAST);
        const third = n === 3;
        const x = lerp(820 - i * 280, third ? 540 : 820 - i * 280 + (i - 1) * 140, third ? focus : 0);
        const lit = third && t >= j.third;
        return (
          <div
            key={n}
            style={at(x, lerp(820, 860, third ? focus : 0), {
              transform: `translate(-50%,-50%) translateY(${200 * (1 - f.k)}px) scale(${third ? lerp(1, 3.75, focus) : 1})`,
              opacity: third ? clamp01(f.k * 2) * (1 - prog(focus, 0.8, 1, easeIn)) : clamp01(f.k * 2) * (1 - focus),
              filter: third ? undefined : blur(8 * focus),
              zIndex: third ? 2 : 1,
            })}
          >
            <SlideThumb n={n} w={240} lit={lit && focus < 0.3} brand={brand} />
          </div>
        );
      })}
      {focus > 0.8 ? (
        <div style={at(540, 860, {transform: 'translate(-50%,-50%) scale(1)', opacity: prog(focus, 0.8, 1, easeOut)})}>
          <ArrSlide brand={brand} redact={0} />
        </div>
      ) : null}
      {t >= j.line ? (
        <div style={at(540, 1225, {opacity: clamp01(line * 2), transform: `translate(-50%,-50%) translateY(${60 * (1 - line)}px)`})}>
          <div dir="rtl" style={{fontFamily: AR, fontWeight: 900, fontSize: 46, color: brand.text, textAlign: 'center', whiteSpace: 'nowrap'}}>اشتراكات سنوية بمئات الآلاف من الدولارات</div>
        </div>
      ) : null}
      {t >= j.weeks ? (
        <div style={at(540, 1340, {transform: `translate(-50%,-50%) scale(${weeks})`})}>
          <Chip text="في أسبوعين بس" color={brand.accent} brand={brand} size={44} />
        </div>
      ) : null}
    </>
  );
};

const Hidden: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const h = b.hidden;
  const redact = prog(t, h.hide - 0.05, h.hide + 0.3, easeInOut);
  const back = prog(t, h.place - 0.2, h.place + 0.4, easeInOut);
  const msg = sp(frame, h.message, {damping: 10, stiffness: 200, mass: 0.7}, fps);
  return (
    <>
      <div style={at(540, lerp(860, 640, back), {transform: `translate(-50%,-50%) scale(${lerp(1, 0.42, back)})`, opacity: 1 - 0.85 * back})}>
        <ArrSlide brand={brand} redact={redact} />
      </div>
      {t >= h.hide ? (
        <div style={at(540, 1240, {opacity: prog(t, h.hide, h.hide + 0.3, easeOut) * (1 - back)})}>
          <Chip text="مخفي في النسخة المنشورة" color={RED} brand={brand} size={40} />
        </div>
      ) : null}
      {t >= h.place - 0.2 ? (
        <div style={{position: 'absolute', inset: 0, opacity: back}}>
          {[1, 2, 3, 4, 5].map((n, i) => (
            <div key={n} style={at(900 - i * 190, 980, {transform: `translate(-50%,-50%) scale(${n === 3 && t >= h.third ? 1.25 : 1})`})}>
              <SlideThumb n={n} w={160} lit={n === 3 && t >= h.third} brand={brand} />
            </div>
          ))}
          {t >= h.message ? (
            <div style={at(520, 1170, {transform: `translate(-50%,-50%) scale(${msg})`})}>
              <Chip text="سلايد 3 = الرسالة" color={brand.accent} brand={brand} size={44} />
            </div>
          ) : null}
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
      <div style={at(540, 1270, {fontFamily: LATIN, fontWeight: 800, fontSize: 44, color: brand.muted})}>Bluejay</div>
    </>
  );
};

/** Ten slides; the first real number sits on slide 7, the line after slide 5, then it moves up. */
const Question: React.FC<Ctx> = ({frame, fps, t, b, brand}) => {
  const q = b.question;
  const pos = (n: number) => ({x: 880 - ((n - 1) % 5) * 180, y: n <= 5 ? 760 : 1000});
  const tok = sp(frame, q.first, SNAP, fps);
  const line = prog(t, q.fifth, q.fifth + 0.4, easeInOut);
  const mv = prog(t, q.move, q.move + 0.55, easeInOut);
  const from = pos(7);
  const to = pos(2);
  const tx = lerp(from.x, to.x, mv);
  const ty = lerp(from.y, to.y, mv) - Math.sin(mv * Math.PI) * 220;
  const which = sp(frame, q.which, {damping: 9, stiffness: 180, mass: 0.8}, fps);
  return (
    <>
      {Array.from({length: 10}).map((_, i) => {
        const n = i + 1;
        const e = sp(frame, q.q + 0.1 + i * 0.05, FAST, fps);
        const p = pos(n);
        const late = n > 5 && t >= q.fifth;
        return (
          <div key={n} style={at(p.x, p.y, {opacity: clamp01(e * 2) * (late ? 0.55 : 1), transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * e})`})}>
            <SlideThumb n={n} w={150} lit={(n === 7 && mv < 0.5 && t >= q.first) || (n === 2 && mv >= 1)} brand={brand} />
          </div>
        );
      })}
      {t >= q.fifth ? (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <line x1={980} y1={880} x2={980 - 900 * line} y2={880} stroke={RED} strokeWidth={7} strokeDasharray="20 12" />
        </svg>
      ) : null}
      {t >= q.fifth ? (
        <div style={at(170, 840, {opacity: line})}>
          <Chip text="بعد الخامسة" color={RED} brand={brand} size={30} />
        </div>
      ) : null}
      {t >= q.first ? (
        <div style={at(tx, ty - 70, {transform: `translate(-50%,-50%) scale(${tok * (1 + 0.25 * Math.sin(mv * Math.PI))})`, filter: blur(mblur(mv > 0 && mv < 1 ? 0.04 : 0, 400))})}>
          <div style={{padding: '10px 22px', borderRadius: 999, background: brand.accent, fontFamily: AR, fontWeight: 900, fontSize: 34, color: brand.bgDeep, whiteSpace: 'nowrap', boxShadow: `0 10px 30px ${rgba(brand.accent, 0.5)}`}}>
            أول رقم حقيقي
          </div>
        </div>
      ) : null}
      {t >= q.which && t < q.fifth ? (
        <div style={at(540, 1220, {transform: `translate(-50%,-50%) rotate(${lerp(-40, 0, which)}deg) scale(${which})`, fontFamily: AR, fontWeight: 900, fontSize: 200, color: brand.accent})}>؟</div>
      ) : null}
      {t >= q.move ? (
        <div style={at(540, 1240, {transform: `translate(-50%,-50%) scale(${sp(frame, q.move + 0.4, SNAP, fps)})`, fontFamily: AR, fontWeight: 900, fontSize: 150, color: brand.accent, textShadow: `0 16px 60px ${rgba(brand.accent, 0.45)}`})}>
          قدّمه!
        </div>
      ) : null}
    </>
  );
};

export const ReelE01_4: React.FC<Reel4Props> = (p) => {
  const b = p.beats;
  const s = b.scenes;
  const plan: [number, Pose][] = [
    [-1, POSE.center],
    [s.weight, POSE.top],
  ];
  return (
    <ReelShell p={p} markPlan={plan} cuts={[s.airbnb, s.bluejay, s.question, s.cta]} hook={(t) => <Hook t={t} at0={b.intro.mark} brand={p.brand} />}>
      {({frame, fps, t}) => {
        const ctx = {frame, fps, t, b, brand: p.brand};
        return (
          <>
            <Scene t={t} from={s.weight} to={s.race}>
              <Weight {...ctx} />
            </Scene>
            <Scene t={t} from={s.race} to={s.airbnb}>
              <Race {...ctx} />
            </Scene>
            <Scene t={t} from={s.airbnb} to={s.bluejay}>
              <Airbnb {...ctx} />
            </Scene>
            <Scene t={t} from={s.bluejay} to={s.hidden}>
              <Bluejay {...ctx} />
            </Scene>
            <Scene t={t} from={s.hidden} to={s.score}>
              <Hidden {...ctx} />
            </Scene>
            <Scene t={t} from={s.score} to={s.question}>
              <Score {...ctx} />
            </Scene>
            <Scene t={t} from={s.question} to={s.cta}>
              <Question {...ctx} />
            </Scene>
          </>
        );
      }}
    </ReelShell>
  );
};
