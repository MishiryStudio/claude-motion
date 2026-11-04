"""Shared sound kit for the MISHIRY reels: the code-made music bed and the signature hits.

Every reel's cue sheet (reels/sfx_<episode>_<n>.py) imports from here so all shorts share
one sonic identity: D minor, 100 BPM, ribbon whooshes on cuts, stamps, counter ticks.
"""

import math
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

from sfx.synth import SR, bandnoise, blip, chime, click, envelope, impact, pad, pop, riser, whoosh  # noqa: E402,F401

BEAT = 0.6  # 100 BPM
CHORDS = [  # Dm  Bb  F  C, one per bar, root an octave down for weight
    [73.42, 146.83, 174.61, 220.0],
    [58.27, 116.54, 146.83, 174.61],
    [87.31, 174.61, 220.0, 261.63],
    [65.41, 130.81, 164.81, 196.0],
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


def music(mix, end, groove_from, cta, breaks=()):
    """Pad bed for the whole reel plus a kick/hat groove; `breaks` are (start, end) gaps."""
    pts = [(0.0, 0.0), (0.6, 1.0)]
    for a, b in breaks:
        pts += [(a, 1.0), (a + 0.3, 0.55), (b - 0.2, 0.55), (b, 1.0)]
    pts += [(cta, 1.0), (cta + 0.4, 1.8), (end - 0.4, 1.8), (end, 0.0)]
    level = envelope(pts)
    bar = 4 * BEAT
    chords = [(i * bar, CHORDS[i % 4]) for i in range(int(end / bar) + 1)]
    mix.put_stereo(0, *pad(end, chords, volume=level, tremolo=1 / bar), gain=0.03)
    t, i = groove_from, 0
    while t < end - 0.3:
        if not any(a <= t < b for a, b in breaks):
            g = level(t)
            mix.put(t, kick(), 0.10 * g)
            mix.put(t + BEAT / 2, hat(), 0.03 * g, pan=0.3 if i % 2 else -0.3)
            if i % 4 == 2:
                mix.put(t, hat(), 0.022 * g, pan=-0.2)
        t += BEAT
        i += 1


def intro(mix, ribbons, mark):
    for i in range(3):
        mix.put(ribbons + i * 0.06, whoosh(0.5, 300, 4200, peak=0.55), 0.16, pan=-0.6 + i * 0.6)
    mix.put(mark + 0.08, impact(0.7), 0.16)
    mix.put(mark + 0.1, chime([D_MINOR[0], D_MINOR[2], D_MINOR[4]], 1.4), 0.08)


def cut(mix, t, i):
    """Ribbon whoosh riding a scene cut (alternating direction)."""
    up = i % 2 == 0
    mix.put(t - 0.32, whoosh(0.5, 400 if up else 3600, 3600 if up else 400, peak=0.6), 0.22, pan=-0.4 if up else 0.4)


def fly_in(mix, t, pan=0.0, gain=0.14):
    mix.put(t - 0.05, whoosh(0.35, 600, 2600, peak=0.7), gain, pan=pan)


def roll(mix, t0, dur, gain=0.045, land_note=None):
    """Counter ticks rising in pitch, optional landing note."""
    n = max(3, int(dur / 0.045))
    for k in range(n):
        mix.put(t0 + k * dur / n, click(2200 + 1500 * k / n, 0.03), gain)
    if land_note:
        mix.put(t0 + dur, blip(land_note, 0.4), 0.09)


def stamp(mix, t, gain=0.14, big=False):
    mix.put(t, kick(), gain)
    mix.put(t, click(900, 0.06), gain)
    if big:
        mix.put(t - 0.45, riser(0.45, 250, 5000), 0.09)
        mix.put(t, impact(1.3), 0.3)


def glitch(mix, t, dur=0.5):
    """Digital stutter for a number that breaks."""
    k, tt = 0, t
    while tt < t + dur:
        mix.put(tt, click(400 + 3000 * ((k * 7) % 5) / 5, 0.025), 0.07 * (1 - (tt - t) / dur), pan=0.5 if k % 2 else -0.5)
        tt += 0.03 + 0.02 * (k % 3)
        k += 1


def cta(mix, t):
    mix.put(t + 0.2, impact(0.6), 0.1)
    mix.put(t + 0.3, chime([D_MINOR[0], D_MINOR[2], D_MINOR[4], D_MINOR[7]], 2.2), 0.12)
    mix.put(t + 0.75, pop(800, 1100), 0.09)
