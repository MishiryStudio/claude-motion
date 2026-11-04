"""SFX layer for one short, read from its timeline.json (written by scripts/short.mjs).

    python3 shorts/sfx_short.py public/shorts/E01-1/timeline.json public/shorts/E01-1/sfx.wav

The voice is the star: these are light accents that sit under it. Everything is in
D major. The layer is mastered quiet here; the final mix is normalized to -14 LUFS.
"""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

from sfx.mix import Mix  # noqa: E402
from sfx.synth import blip, chime, pop, riser, whoosh  # noqa: E402

D_MAJOR = [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33]


def score(mix, tl):
    # Title lands on frame 0: one soft airy reveal.
    mix.put(0.02, whoosh(0.45, 500, 2600, peak=0.4), 0.16)
    mix.put(0.30, blip(D_MAJOR[4], 0.4), 0.05)

    # Jump between parts of the episode: whoosh into the cut.
    for t in tl["cuts"]:
        mix.put(max(0.0, t - 0.22), whoosh(0.4, 2600, 400, peak=0.55), 0.18)

    # Numbers in the captions: a small pop, climbing through the scale.
    for i, t in enumerate(tl["emphasis"]):
        f = D_MAJOR[i % len(D_MAJOR)] * 2
        mix.put(t, pop(f, f * 1.25), 0.07, pan=0.2 if i % 2 else -0.2)

    # CTA: short build, then a chord in key.
    cta = tl["cta"]
    mix.put(max(0.0, cta - 0.32), riser(0.7, 300, 3800), 0.07)
    mix.put(cta + 0.38, chime([D_MAJOR[0], D_MAJOR[2], D_MAJOR[4], D_MAJOR[7]], 2.0), 0.16)


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: python3 shorts/sfx_short.py <timeline.json> <out.wav>")
    with open(sys.argv[1]) as f:
        tl = json.load(f)
    mix = Mix(tl["duration"], seed=7)
    score(mix, tl)
    mix.master(target_lufs=-20.0)
    mix.write(sys.argv[2])
    print("sfx: {} sounds -> {}".format(mix.count, sys.argv[2]))


if __name__ == "__main__":
    main()
