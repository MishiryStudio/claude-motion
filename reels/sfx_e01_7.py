"""Sound for reel E01-7 (the takeaway). Bed and hits from reels/sfx_kit.py.

    python3 reels/sfx_e01_7.py public/shorts/E01-7/timeline.json public/shorts/E01-7/sfx.wav
"""

import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

import sfx_kit as K  # noqa: E402
from sfx.mix import Mix  # noqa: E402
from sfx.synth import scratch  # noqa: E402


def score(mix, tl):
    s = tl["scenes"]
    f = tl["final"]
    K.music(mix, tl["duration"], groove_from=s["changed"], cta=s["cta"], breaks=[(f["clearer"] - 0.3, f["sharp"])])
    K.intro(mix, tl["intro"]["ribbons"], tl["intro"]["mark"])
    for i, cut in enumerate([s["same"], s["deal"], s["final"], s["cta"]]):
        K.cut(mix, cut, i)

    c = tl["changed"]
    for i in range(5):
        mix.put(s["changed"] + 0.1 + i * 0.06, K.click(1500 + 100 * i, 0.03), 0.04)
    K.roll(mix, c["shorter"] - 0.3, 0.6, land_note=K.D_MINOR[2])
    mix.put(c["numbersFirst"] - 0.3, K.whoosh(0.6, 500, 2600, peak=0.6), 0.12, pan=0.5)
    mix.put(c["numbersFirst"] + 0.2, K.blip(K.D_MINOR[4], 0.35), 0.08)
    mix.put(c["teamFirst"] - 0.3, K.whoosh(0.6, 500, 2600, peak=0.6), 0.12, pan=0.5)
    mix.put(c["teamFirst"] + 0.2, K.blip(K.D_MINOR[7], 0.35), 0.08)

    sm = tl["same"]
    mix.put(s["same"] + 0.1, K.pop(400, 600), 0.08)
    for i, key in enumerate(["q1", "q2", "q3"]):
        K.fly_in(mix, sm[key] - 0.1, pan=0.6 if i % 2 == 0 else -0.6)
        mix.put(sm[key] + 0.15, K.chime([K.D_MINOR[2 + i], K.D_MINOR[4 + i]], 0.6), 0.06)

    d = tl["deal"]
    K.fly_in(mix, d["decks"] - 0.1, pan=0.6)
    K.fly_in(mix, d["decks"], pan=-0.6)
    mix.put(d["decks"] + 0.4, scratch(0.9), 0.07)
    K.stamp(mix, d["close"])
    mix.put(d["close"], K.impact(0.8), 0.16)

    m = tl["meeting"]
    mix.put(m["start"], K.riser(m["end"] - m["start"], 220, 2600), 0.05)
    mix.put(m["end"], K.chime([K.D_MINOR[0], K.D_MINOR[2], K.D_MINOR[4], K.D_MINOR[7]], 1.4), 0.12)

    mix.put(f["deck"] + 0.3, K.chime([K.D_MINOR[4] * 2, K.D_MINOR[6] * 2, K.D_MINOR[7] * 2], 1.0), 0.05)
    mix.put(f["prettier"], scratch(0.35), 0.16)
    mix.put(f["clearer"], K.whoosh(1.0, 3000, 300, peak=0.8), 0.08)
    mix.put(f["sharp"] - 0.4, K.riser(0.4, 400, 5000), 0.1)
    mix.put(f["sharp"], K.impact(1.4), 0.3)
    mix.put(f["sharp"] + 0.05, K.chime([K.D_MINOR[0], K.D_MINOR[2], K.D_MINOR[4], K.D_MINOR[7]], 2.0), 0.12)

    K.cta(mix, s["cta"])


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: python3 reels/sfx_e01_7.py <timeline.json> <out.wav>")
    with open(sys.argv[1]) as fh:
        tl = json.load(fh)
    random.seed(11)
    mix = Mix(tl["duration"], seed=11)
    score(mix, tl)
    mix.master(target_lufs=-18.0)
    mix.write(sys.argv[2])
    print("sfx: {} sounds -> {}".format(mix.count, sys.argv[2]))


if __name__ == "__main__":
    main()
