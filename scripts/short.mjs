#!/usr/bin/env node
// Vertical shorts (1080×1920) cut from a long episode.
//
//   npm run short -- E01 1           full render → out/shorts/E01-1.mp4
//   npm run short -- E01 1 --draft   half resolution, faster
//   npm run short -- E01 all         every clip in shorts/E01.json
//   npm run short -- E01 1 --prep    only write props/timeline/sfx (for `npm run studio`)
//
// Reads shorts/<episode>.json (clips, brand, CTA) and the episode SRT, writes
// public/shorts/<ep>-<id>/{props.json,timeline.json,sfx.wav}, renders the `Short`
// composition, normalizes loudness to -14 LUFS and builds a contact sheet.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 30;
const CTA_HOLD = 2.8;

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return false;
  argv.splice(i, 1);
  return true;
};
const draft = flag('draft');
const prepOnly = flag('prep');
const [episode, which] = argv;
if (!episode || !which) {
  console.error('usage: npm run short -- <episode> <clip id|all> [--draft] [--prep]');
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'shorts', `${episode}.json`), 'utf8'));

// ---------- SRT → cues ----------
const toSec = (s) => {
  const [h, m, rest] = s.trim().split(':');
  return Number(h) * 3600 + Number(m) * 60 + Number(rest.replace(',', '.'));
};
const cues = fs
  .readFileSync(path.join(ROOT, cfg.srt), 'utf8')
  .replace(/\r/g, '')
  .split(/\n\s*\n/)
  .map((block) => block.trim().split('\n'))
  .filter((l) => l.length >= 3 && l[1].includes('-->'))
  .map((l) => {
    const [a, b] = l[1].split('-->');
    return {start: toSec(a), end: toSec(b), text: l.slice(2).join(' ')};
  });

const replacements = Object.entries(cfg.replace ?? {}).sort((a, b) => b[0].length - a[0].length);
const applyReplace = (text) =>
  replacements.reduce((s, [from, to]) => s.split(from).join(to), text);

const BREAK = /[،,.…:؟?!]$/;
const STRIP = /[،,.…:]+$/g;

/** Words of one cue, timed in proportion to their length inside the cue. */
const cueWords = (cue) => {
  const raw = applyReplace(cue.text).split(/\s+/).filter(Boolean);
  const weights = raw.map((w) => Math.max(2, w.replace(STRIP, '').length));
  const total = weights.reduce((a, b) => a + b, 0);
  let t = cue.start;
  return raw.map((w, i) => {
    const d = ((cue.end - cue.start) * weights[i]) / total;
    const word = {
      text: w.replace(STRIP, ''),
      t0: t,
      t1: t + d,
      brk: BREAK.test(w),
      emph: /[0-9٠-٩%]/.test(w),
    };
    t += d;
    return word;
  });
};

// Consecutive Latin words ("Pitch Deck", "Y Combinator") stay one token, otherwise the
// RTL layout lays them out right-to-left and they read backwards.
const LATIN = /^[A-Za-z][A-Za-z0-9.&'’-]*$/;
const mergeLatin = (words) =>
  words.reduce((out, w) => {
    const prev = out[out.length - 1];
    if (prev && !prev.brk && LATIN.test(prev.text.split(' ').pop()) && LATIN.test(w.text)) {
      out[out.length - 1] = {...prev, text: `${prev.text} ${w.text}`, t1: w.t1, brk: w.brk};
    } else out.push(w);
    return out;
  }, []);

const buildClip = (clip) => {
  // Map source time → short time, segment by segment.
  let at = 0;
  const segments = clip.segments.map(([s0, s1]) => {
    const seg = {from: at, src0: s0, src1: s1, dur: s1 - s0};
    at += seg.dur;
    return seg;
  });
  const speechEnd = at;
  const ctaAt = speechEnd;
  const duration = ctaAt + CTA_HOLD;

  const words = [];
  for (const seg of segments) {
    for (const cue of cues) {
      const mid = (cue.start + cue.end) / 2;
      if (mid < seg.src0 || mid > seg.src1) continue;
      for (const w of mergeLatin(cueWords(cue))) {
        const t0 = seg.from + (w.t0 - seg.src0);
        const t1 = Math.min(seg.from + (w.t1 - seg.src0), seg.from + seg.dur);
        if (t1 <= seg.from) continue;
        words.push({...w, t0: Math.max(t0, seg.from), t1, seg: segments.indexOf(seg)});
      }
    }
  }

  // Pages: up to 3 words / ~20 chars, break on punctuation and on cue gaps.
  const pages = [];
  let cur = null;
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const gap = prev ? w.t0 - prev.t1 : 0;
    const full =
      cur &&
      (cur.words.length >= 3 ||
        cur.words.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length > 20 ||
        prev.brk ||
        gap > 0.25 ||
        prev.seg !== w.seg);
    if (!cur || full) {
      cur = {t0: w.t0, t1: w.t1, words: []};
      pages.push(cur);
    }
    cur.words.push({text: w.text, t0: w.t0, t1: w.t1, emph: w.emph});
    cur.t1 = w.t1;
  });
  // Hold each page until the next one (short gaps) or a beat after it ends.
  pages.forEach((p, i) => {
    const next = pages[i + 1];
    const hold = next ? Math.min(next.t0, p.t1 + 0.5) : Math.min(p.t1 + 0.5, ctaAt);
    p.t1 = Math.max(hold, Math.min(p.t0 + 0.7, next ? next.t0 : ctaAt));
  });

  const id = `${episode}-${clip.id}`;
  const dir = path.join(ROOT, 'public', 'shorts', id);
  fs.mkdirSync(dir, {recursive: true});

  const props = {
    id,
    fps: FPS,
    durationSec: Number(duration.toFixed(3)),
    source: cfg.source,
    sfx: `shorts/${id}/sfx.wav`,
    brand: cfg.brand,
    cta: cfg.cta,
    title: clip.title,
    kicker: clip.kicker ?? '',
    segments,
    pages,
    speechEnd,
    ctaAt,
  };
  const timeline = {
    fps: FPS,
    duration: props.durationSec,
    title: 0,
    cuts: segments.slice(1).map((s) => Number(s.from.toFixed(2))),
    pages: pages.map((p) => Number(p.t0.toFixed(2))),
    emphasis: words.filter((w) => w.emph).map((w) => Number(w.t0.toFixed(2))),
    cta: Number(ctaAt.toFixed(2)),
    ctaHold: Number((ctaAt + 1.4).toFixed(2)),
  };
  fs.writeFileSync(path.join(dir, 'props.json'), JSON.stringify(props, null, 1));
  fs.writeFileSync(path.join(dir, 'timeline.json'), JSON.stringify(timeline, null, 1));
  return {id, dir, props};
};

const run = (cmd, args) => execFileSync(cmd, args, {cwd: ROOT, stdio: 'inherit'});

const clips = which === 'all' ? cfg.clips : cfg.clips.filter((c) => String(c.id) === String(which));
if (!clips.length) {
  console.error(`no clip "${which}" in shorts/${episode}.json`);
  process.exit(1);
}
if (!fs.existsSync(path.join(ROOT, 'public', cfg.source))) {
  console.error(`missing public/${cfg.source}: copy the episode video there first.`);
  process.exit(1);
}

for (const clip of clips) {
  const {id, dir, props} = buildClip(clip);
  console.log(`\n▶ ${id}: ${props.durationSec.toFixed(1)}s, ${props.pages.length} caption pages`);
  run('python3', ['shorts/sfx_short.py', path.join(dir, 'timeline.json'), path.join(dir, 'sfx.wav')]);
  if (prepOnly) continue;

  fs.mkdirSync(path.join(ROOT, 'out', 'shorts'), {recursive: true});
  const raw = path.join('out', 'shorts', `${id}${draft ? '-draft' : ''}-raw.mp4`);
  const final = path.join('out', 'shorts', `${id}${draft ? '-draft' : ''}.mp4`);
  run('npx', [
    'remotion', 'render', 'src/index.ts', 'Short', raw,
    `--props=${path.join(dir, 'props.json')}`,
    ...(draft ? ['--scale=0.5', '--crf=26'] : []),
  ]);
  run('ffmpeg', [
    '-loglevel', 'error', '-y', '-i', raw,
    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final,
  ]);
  fs.rmSync(path.join(ROOT, raw));
  run('node', [
    'scripts/sheet.mjs', '--video', final, '--timeline', path.join(dir, 'timeline.json'),
    '--name', `${id}${draft ? '-draft' : ''}`, '--size', '360', '--cols', '5', '--rows', '2',
  ]);
  console.log(`✔ ${final}`);
}
