"""Sound for reel E01-5 (the ask). Bed and hits from reels/sfx_kit.py.

    python3 reels/sfx_e01_5.py public/shorts/E01-5/timeline.json public/shorts/E01-5/sfx.wav
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
    r = tl["round"]
    c = tl["ceiling"]
    K.music(mix, tl["duration"], groove_from=s["ask"], cta=s["cta"], breaks=[(s["note"], r["closed"]), (c["not"] - 0.6, c["break"])])
    K.intro(mix, tl["intro"]["ribbons"], tl["intro"]["mark"])
    for i, cut in enumerate([s["use"], s["both"], s["round"], s["ceiling"], s["cta"]]):
        K.cut(mix, cut, i)

    K.roll(mix, tl["ask"]["amount"], 0.6, land_note=K.D_MINOR[4])

    u = tl["use"]
    K.fly_in(mix, u["revenue"], pan=-0.6)
    K.fly_in(mix, u["team"], pan=0.6)
    for i in range(12):
        f = K.D_MINOR[i % 8] * (1 if i < 8 else 2)
        mix.put(u["pct"] + i * 0.06, K.pop(f, f * 1.15), 0.05, pan=-0.6 + 0.1 * i)

    d = tl["score"]["dots"]
    for i in range(4):
        f = K.D_MINOR[i + 1] * 2
        mix.put(d + i * 0.09, K.pop(f, f * 1.2), 0.07)
    mix.put(d, K.impact(0.6), 0.1)

    bo = tl["both"]
    K.fly_in(mix, s["both"] + 0.1, pan=0.6)
    K.fly_in(mix, s["both"] + 0.22, pan=-0.6)
    mix.put(bo["target"], K.whoosh(0.3, 800, 2400, peak=0.7), 0.07)
    mix.put(bo["check"], K.chime([K.D_MINOR[2], K.D_MINOR[4]], 0.8), 0.09)
    mix.put(bo["check"] + 0.1, K.chime([K.D_MINOR[4], K.D_MINOR[7]], 0.8), 0.09)

    mix.put(tl["note"]["flip"], K.whoosh(0.4, 1500, 600, peak=0.4), 0.1)
    mix.put(tl["note"]["flip"] + 0.2, scratch(0.3), 0.06)

    K.roll(mix, r["asked"] - 0.4, 0.8)
    mix.put(r["closed"], K.riser(r["four"] + 0.25 - r["closed"], 300, 5000), 0.12)
    mix.put(r["four"], K.impact(1.3), 0.32)
    K.glitch(mix, r["four"], 0.4)
    mix.put(r["four"] + 0.05, K.chime([K.D_MINOR[0], K.D_MINOR[2], K.D_MINOR[4], K.D_MINOR[7]], 1.6), 0.12)
    mix.put(r["source"], K.pop(600, 800), 0.07)

    f = tl["fair"]
    K.fly_in(mix, f["deck"] - 0.2, pan=0.6)
    mix.put(f["not"], K.pop(400, 250), 0.12)
    K.fly_in(mix, f["cause"] - 0.2, pan=-0.6)

    mix.put(c["number"], K.pop(700, 1000), 0.08)
    mix.put(c["not"] - 0.1, K.riser(c["break"] - c["not"] + 0.1, 300, 4000), 0.1)
    K.stamp(mix, c["break"], big=True)
    K.glitch(mix, c["break"], 0.5)

    K.cta(mix, s["cta"])


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: python3 reels/sfx_e01_5.py <timeline.json> <out.wav>")
    with open(sys.argv[1]) as fh:
        tl = json.load(fh)
    random.seed(9)
    mix = Mix(tl["duration"], seed=9)
    score(mix, tl)
    mix.master(target_lufs=-18.0)
    mix.write(sys.argv[2])
    print("sfx: {} sounds -> {}".format(mix.count, sys.argv[2]))


if __name__ == "__main__":
    main()
