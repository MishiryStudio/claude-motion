"""Sound for reel E01-3 (competition). Bed and hits from reels/sfx_kit.py.

    python3 reels/sfx_e01_3.py public/shorts/E01-3/timeline.json public/shorts/E01-3/sfx.wav
"""

import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

import sfx_kit as K  # noqa: E402
from sfx.mix import Mix  # noqa: E402
from sfx.synth import key, scratch  # noqa: E402


def score(mix, tl):
    s = tl["scenes"]
    K.music(mix, tl["duration"], groove_from=s["criterion"], cta=s["cta"], breaks=[(s["meeting"], s["one"]), (s["dont"], s["fix"])])
    K.intro(mix, tl["intro"]["ribbons"], tl["intro"]["mark"])
    for i, c in enumerate([s["airbnb"], s["bluejay"], s["dont"], s["cta"]]):
        K.cut(mix, c, i)

    for i in range(9):
        mix.put(s["criterion"] + i * 0.04, K.click(1400 + 80 * i, 0.03), 0.04)
    mix.put(tl["criterion"]["six"], K.pop(700, 1050), 0.12)

    a = tl["airbnb"]
    K.fly_in(mix, a["panel"], gain=0.1)
    mix.put(a["axes"], scratch(0.5), 0.1)
    for i in range(5):
        mix.put(a["dots"] + i * 0.07, K.pop(500 + 60 * i, 640 + 60 * i), 0.06, pan=-0.5 + 0.25 * i)
    mix.put(a["corner"], K.chime([K.D_MINOR[0], K.D_MINOR[2], K.D_MINOR[4]], 1.2), 0.11)
    for i in range(3):
        f = K.D_MINOR[i + 2] * 2
        mix.put(a["score"] + i * 0.09, K.pop(f, f * 1.2), 0.07)

    j = tl["bluejay"]
    for i in range(5):
        mix.put(j["vanish"] + i * 0.1, K.pop(900 - 90 * i, 500 - 50 * i), 0.07, pan=0.5 - 0.25 * i)
    mix.put(j["zero"], K.impact(0.6), 0.12)
    K.fly_in(mix, j["write"], pan=0.6)
    n = 18
    for k in range(n):
        mix.put(j["type"] + k * (j["typed"] - j["type"]) / n, key(), 0.12, pan=-0.2 + 0.4 * random.random())

    m = tl["meeting"]
    mix.put(m["bubble"], K.pop(600, 900), 0.1)
    for k in range(14):
        mix.put(m["ask"] + k * 1.1 / 14, key(), 0.09)
    K.glitch(mix, m["crack"], 0.6)
    mix.put(m["crack"], K.impact(0.8), 0.14)

    o = tl["one"]["score"]
    K.stamp(mix, o, big=True)

    d = tl["dont"]
    mix.put(d["card"], K.whoosh(0.4, 2500, 600, peak=0.4), 0.1)
    mix.put(d["strike"], scratch(0.45), 0.16)
    K.stamp(mix, d["stamp"])

    f = tl["fix"]
    K.fly_in(mix, f["slide"], gain=0.1)
    mix.put(f["mid"], K.pop(700, 1000), 0.08)
    K.roll(mix, f["count"], f["plus"] + 0.2 - f["count"])
    mix.put(f["plus"], K.chime([K.D_MINOR[2], K.D_MINOR[4], K.D_MINOR[7]], 1.2), 0.13)

    K.cta(mix, s["cta"])


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: python3 reels/sfx_e01_3.py <timeline.json> <out.wav>")
    with open(sys.argv[1]) as fh:
        tl = json.load(fh)
    random.seed(7)
    mix = Mix(tl["duration"], seed=7)
    score(mix, tl)
    mix.master(target_lufs=-18.0)
    mix.write(sys.argv[2])
    print("sfx: {} sounds -> {}".format(mix.count, sys.argv[2]))


if __name__ == "__main__":
    main()
