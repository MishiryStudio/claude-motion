"""Sound for reel E01-1: a code-made music bed plus accents on every visual hit.

    python3 reels/sfx_e01_1.py public/shorts/E01-1/timeline.json public/shorts/E01-1/sfx.wav

Everything is synthesized (no samples, no licences). Key D minor, 100 BPM. The voice is
mixed in Remotion on top; this layer is mastered quiet and the final file goes to -14 LUFS.
"""

import math
import os
import random
import sys
import json

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

from sfx.mix import Mix  # noqa: E402
from sfx.synth import SR, bandnoise, blip, chime, click, envelope, impact, pad, pop, riser, scratch, whoosh  # noqa: E402

BEAT = 0.6  # 100 BPM
D2, F2, A2, BB1, C2 = 73.42, 87.31, 110.0, 58.27, 65.41
CHORDS = [  # Dm  Bb  F  C, one per bar, root an octave down for weight
    [D2, 146.83, 174.61, 220.0],
    [BB1, 116.54, 146.83, 174.61],
    [F2, 174.61, 220.0, 261.63],
    [C2, 130.81, 164.81, 196.0],
]
D_MINOR = [293.66, 329.63, 349.23, 392.0, 440.0, 466.16, 523.25, 587.33]


def kick():
    n = int(0.28 * SR)
    out, ph = [], 0.0
    for k in range(n):
        tt = k / SR
        ph += 2 * math.pi * (45 + 85 * math.exp(-tt / 0.03)) / SR
        out.append(math.sin(ph) * math.exp(-tt / 0.09) * min(1, tt / 0.002))
    return out


def hat():
    n = int(0.05 * SR)
    noise = bandnoise(n, lambda k: 8500, q=0.7)
    return [noise[k] * math.exp(-k / SR / 0.012) for k in range(n)]


def music(mix, tl, end):
    s = tl["scenes"]
    # Bed level: soft under the voice, a dip into the "lower" tension beat, up for the CTA.
    level = envelope([
        (0.0, 0.0), (0.6, 1.0),
        (s["lower"], 1.0), (s["lower"] + 0.3, 0.55), (s["result"] - 0.2, 0.55), (s["result"], 1.0),
        (s["cta"], 1.0), (s["cta"] + 0.4, 1.8), (end - 0.4, 1.8), (end, 0.0),
    ])
    bar = 4 * BEAT
    chords = [(b * bar, CHORDS[b % 4]) for b in range(int(end / bar) + 1)]
    mix.put_stereo(0, *pad(end, chords, volume=level, tremolo=1 / bar), gain=0.03)

    # Groove from the first deck to the CTA, with a break on the "lower" beat.
    t = s["decks"]
    i = 0
    while t < end - 0.3:
        in_break = s["lower"] <= t < s["result"]
        g = level(t)
        if not in_break:
            mix.put(t, kick(), 0.10 * g)
            mix.put(t + BEAT / 2, hat(), 0.03 * g, pan=0.3 if i % 2 else -0.3)
        if i % 4 == 2 and not in_break:
            mix.put(t, hat(), 0.022 * g, pan=-0.2)
        t += BEAT
        i += 1


def accents(mix, tl):
    s, b = tl["scenes"], tl

    # Intro: ribbons tear across, the mark lands.
    for i in range(3):
        mix.put(b["intro"]["ribbons"] + i * 0.06, whoosh(0.5, 300, 4200, peak=0.55), 0.16, pan=-0.6 + i * 0.6)
    mix.put(b["intro"]["mark"] + 0.08, impact(0.7), 0.16)
    mix.put(b["intro"]["mark"] + 0.1, chime([D_MINOR[0], D_MINOR[2], D_MINOR[4]], 1.4), 0.08)

    # Every scene cut rides the ribbons.
    for i, c in enumerate([s["investors"], s["y2025"], s["criteria"], s["result"], s["cta"]]):
        mix.put(c - 0.32, whoosh(0.5, 3600 if i % 2 else 400, 400 if i % 2 else 3600, peak=0.6), 0.22, pan=0.4 if i % 2 else -0.4)

    # Decks fly in from both sides; the year rolls.
    d = b["decks"]
    mix.put(d["in"] - 0.05, whoosh(0.35, 600, 2400, peak=0.7), 0.14, pan=-0.6)
    mix.put(d["in"] + 0.03, whoosh(0.35, 600, 2400, peak=0.7), 0.14, pan=0.6)
    mix.put(d["focus2008"], whoosh(0.4, 2400, 500, peak=0.4), 0.12, pan=0.7)
    for k in range(10):
        mix.put(d["year2008"] + k * 0.045, click(2600 + k * 90, 0.03), 0.05)
    mix.put(d["year2008"] + 0.5, blip(D_MINOR[4], 0.4), 0.08)

    # Investors land, then the stamps hit.
    v = b["investors"]
    for i in range(7):
        mix.put(v["land"] + i * 0.09 - 0.05, pop(500 + i * 40, 650 + i * 40), 0.07, pan=0.5 if i % 2 else -0.5)
    for i in range(7):
        tt = v["rejected"] + i * 0.085
        mix.put(tt, kick(), 0.12)
        mix.put(tt, click(900 if i < 5 else 1500, 0.06), 0.12, pan=-0.4 + i * 0.13)
    mix.put(v["recede"], whoosh(0.8, 2000, 300, peak=0.3), 0.08)
    mix.put(v["airbnb"] - 0.25, riser(0.25, 500, 4000), 0.08)
    mix.put(v["airbnb"], impact(0.9), 0.2)

    # 2025: card, year roll, chips.
    y = b["y2025"]
    mix.put(y["card"] - 0.05, whoosh(0.4, 500, 3000, peak=0.7), 0.15, pan=0.6)
    for k in range(10):
        mix.put(y["year"] + k * 0.045, click(2600 + k * 90, 0.03), 0.05)
    mix.put(y["year"] + 0.5, blip(D_MINOR[3], 0.4), 0.08)
    mix.put(y["ai"], whoosh(0.3, 700, 2600, peak=0.7), 0.1, pan=-0.5)
    mix.put(y["small"], pop(700, 900), 0.08)

    # Nine criteria orbit in, climbing the scale.
    c = b["criteria"]
    for i in range(9):
        f = D_MINOR[i % 8] * 2
        mix.put(c["chips"] + i * 0.07, pop(f, f * 1.2), 0.06, pan=0.5 if i % 2 else -0.5)
    mix.put(c["orbit"], chime([D_MINOR[0], D_MINOR[2], D_MINOR[4]], 1.2), 0.07)
    mix.put(c["nine"], blip(D_MINOR[7], 0.35), 0.09)

    # The newer deck scored lower: a falling note.
    lo = b["lower"]
    mix.put(lo["bars"] + 0.1, whoosh(0.9, 300, 1400, peak=0.8), 0.08)
    mix.put(lo["less"], blip(D_MINOR[2], 0.5), 0.1)
    mix.put(lo["less"] + 0.12, blip(D_MINOR[0] / 2 * 1.5, 0.6), 0.1)

    # Result: counters tick up and land; the 80 line draws; the stamp is the hero hit.
    r = b["result"]
    for t0, t1, land, note in ((r["airbnb"], r["airbnbLand"], r["airbnbLand"], D_MINOR[4]), (r["bluejay"], r["bluejayLand"], r["bluejayLand"], D_MINOR[2])):
        n = int((t1 - t0) / 0.05)
        for k in range(n):
            mix.put(t0 + k * 0.05, click(1800 + 1400 * k / max(1, n), 0.025), 0.04)
        mix.put(land, chime([note, note * 1.5], 1.0), 0.1)
    mix.put(r["threshold"] - 0.6, riser(0.6, 300, 3000), 0.06)
    mix.put(r["threshold"], scratch(0.5), 0.12)
    mix.put(r["thresholdLabel"], pop(900, 1200), 0.07, pan=0.6)
    mix.put(r["notReady"] - 0.5, riser(0.5, 250, 5000), 0.09)
    mix.put(r["notReady"], impact(1.4), 0.32)
    mix.put(r["notReady"], kick(), 0.2)

    # CTA: ribbons, the mark rebuilds, the button pops.
    mix.put(s["cta"] + 0.2, impact(0.6), 0.1)
    mix.put(s["cta"] + 0.3, chime([D_MINOR[0], D_MINOR[2], D_MINOR[4], D_MINOR[7]], 2.2), 0.12)
    mix.put(s["cta"] + 0.75, pop(800, 1100), 0.09)


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: python3 reels/sfx_e01_1.py <timeline.json> <out.wav>")
    with open(sys.argv[1]) as f:
        tl = json.load(f)
    random.seed(5)
    mix = Mix(tl["duration"], seed=5)
    music(mix, tl, tl["duration"])
    accents(mix, tl)
    mix.master(target_lufs=-18.0)
    mix.write(sys.argv[2])
    print("sfx: {} sounds -> {}".format(mix.count, sys.argv[2]))


if __name__ == "__main__":
    main()
