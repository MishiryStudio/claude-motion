"""Sound for reel E01-4 (traction). Bed and hits from reels/sfx_kit.py.

    python3 reels/sfx_e01_4.py public/shorts/E01-4/timeline.json public/shorts/E01-4/sfx.wav
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
    K.music(mix, tl["duration"], groove_from=s["weight"], cta=s["cta"], breaks=[(tl["airbnb"]["scan"], tl["airbnb"]["zero"] + 0.6), (s["question"], tl["question"]["first"])])
    K.intro(mix, tl["intro"]["ribbons"], tl["intro"]["mark"])
    for i, c in enumerate([s["airbnb"], s["bluejay"], s["question"], s["cta"]]):
        K.cut(mix, c, i)

    w = tl["weight"]
    for i in range(9):
        mix.put(s["weight"] + i * 0.04, K.click(1400 + 80 * i, 0.03), 0.04)
    mix.put(s["weight"] + 0.15, K.pop(700, 1050), 0.1)
    mix.put(w["weight"], K.pop(500, 800), 0.1)
    mix.put(w["traction"], K.impact(0.6), 0.12)

    r = tl["race"]
    mix.put(r["y2025"], K.whoosh(1.4, 300, 2600, peak=0.8), 0.1, pan=-0.3)
    mix.put(r["y2025"] + 0.2, K.whoosh(1.2, 300, 1800, peak=0.8), 0.07, pan=0.3)
    mix.put(r["gap"], K.pop(700, 1000), 0.1)

    a = tl["airbnb"]
    K.fly_in(mix, a["opinions"], pan=-0.6)
    K.fly_in(mix, a["opinions"] + 0.15, pan=0.6)
    K.fly_in(mix, a["press"], pan=-0.6)
    K.fly_in(mix, a["press"] + 0.15, pan=0.6)
    for k in range(5):
        mix.put(a["scan"] + k * 0.22, K.click(3000, 0.02), 0.04, pan=-0.6 + 0.3 * k)
    K.stamp(mix, a["zero"], big=True)
    for i in range(2):
        f = K.D_MINOR[i + 2] * 2
        mix.put(a["score"] + i * 0.09, K.pop(f, f * 1.2), 0.07)

    j = tl["bluejay"]
    for i in range(3):
        mix.put(j["slides"] + i * 0.08, K.pop(600 + 100 * i, 800 + 100 * i), 0.06)
    mix.put(j["third"], K.blip(K.D_MINOR[4], 0.35), 0.08)
    mix.put(j["focus"], K.whoosh(0.6, 400, 3000, peak=0.6), 0.14)
    mix.put(j["line"], K.whoosh(0.3, 700, 2400, peak=0.7), 0.06)
    mix.put(j["weeks"], K.chime([K.D_MINOR[2], K.D_MINOR[4], K.D_MINOR[7]], 1.0), 0.1)

    h = tl["hidden"]
    mix.put(h["hide"], scratch(0.35), 0.14)
    mix.put(h["place"], K.whoosh(0.6, 3000, 500, peak=0.4), 0.1)
    mix.put(h["third"], K.blip(K.D_MINOR[4], 0.35), 0.08)
    mix.put(h["message"], K.pop(700, 1000), 0.1)

    d = tl["score"]["dots"]
    for i in range(4):
        f = K.D_MINOR[i + 1] * 2
        mix.put(d + i * 0.09, K.pop(f, f * 1.2), 0.07)
    mix.put(d, K.impact(0.6), 0.1)

    q = tl["question"]
    for i in range(10):
        mix.put(q["q"] + 0.1 + i * 0.05, K.click(1600 + 60 * i, 0.03), 0.04)
    mix.put(q["first"], K.pop(800, 1200), 0.1)
    mix.put(q["which"], K.pop(500, 300), 0.1)
    mix.put(q["fifth"], scratch(0.4), 0.12)
    mix.put(q["move"], K.whoosh(0.55, 500, 3200, peak=0.5), 0.16)
    mix.put(q["move"] + 0.55, K.chime([K.D_MINOR[0], K.D_MINOR[2], K.D_MINOR[4]], 1.2), 0.12)

    K.cta(mix, s["cta"])


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: python3 reels/sfx_e01_4.py <timeline.json> <out.wav>")
    with open(sys.argv[1]) as fh:
        tl = json.load(fh)
    random.seed(8)
    mix = Mix(tl["duration"], seed=8)
    score(mix, tl)
    mix.master(target_lufs=-18.0)
    mix.write(sys.argv[2])
    print("sfx: {} sounds -> {}".format(mix.count, sys.argv[2]))


if __name__ == "__main__":
    main()
