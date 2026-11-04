"""Sound for reel E01-2 (market size). Bed and hits from reels/sfx_kit.py.

    python3 reels/sfx_e01_2.py public/shorts/E01-2/timeline.json public/shorts/E01-2/sfx.wav
"""

import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

import sfx_kit as K  # noqa: E402
from sfx.mix import Mix  # noqa: E402


def score(mix, tl):
    s = tl["scenes"]
    K.music(mix, tl["duration"], groove_from=s["market"], cta=s["cta"], breaks=[(s["why"], s["bluejay"]), (s["where"], s["score"])])
    K.intro(mix, tl["intro"]["ribbons"], tl["intro"]["mark"])
    for i, c in enumerate([s["airbnb"], s["bluejay"], s["score"], s["cta"]]):
        K.cut(mix, c, i)

    m = tl["market"]
    for i in range(3):
        mix.put(m["rings"] + i * 0.15, K.whoosh(0.6, 300, 1500, peak=0.5), 0.07, pan=-0.3 + 0.3 * i)
    K.fly_in(mix, m["both"], pan=0.6)
    K.fly_in(mix, m["both"] + 0.08, pan=-0.6)

    a = tl["airbnb"]
    K.roll(mix, a["trips"], 0.5, land_note=K.D_MINOR[4])
    mix.put(a["narrow"] + 0.15, K.whoosh(0.6, 3000, 500, peak=0.4), 0.12)
    K.roll(mix, a["narrow"], 0.5, land_note=K.D_MINOR[2])
    mix.put(a["finally"], K.whoosh(0.4, 1200, 400, peak=0.6), 0.07)
    K.roll(mix, a["take"], 0.6, land_note=K.D_MINOR[7])

    w = tl["why"]
    mix.put(w["question"], K.pop(500, 300), 0.12)
    K.glitch(mix, w["noReason"], 0.6)
    K.stamp(mix, w["noReason"] + 0.05)
    mix.put(w["noReason"], K.impact(0.8), 0.14)

    j = tl["bluejay"]
    K.fly_in(mix, j["companies"], pan=0.6)
    mix.put(j["times"], K.pop(900, 1300), 0.1)
    K.fly_in(mix, j["price"], pan=-0.6)
    mix.put(j["equals"], K.whoosh(0.4, 800, 3000, peak=0.6), 0.08)
    mix.put(j["total"] - 0.3, K.riser(0.3, 400, 4000), 0.07)
    K.roll(mix, j["total"], 0.45)
    mix.put(j["total"], K.impact(0.9), 0.2)

    wh = tl["where"]
    mix.put(wh["focus"], K.whoosh(0.5, 2500, 400, peak=0.3), 0.1)
    mix.put(wh["focus"] + 0.25, K.pop(500, 300), 0.1)
    K.stamp(mix, wh["from"])
    K.glitch(mix, wh["from"] + 0.44, 0.5)

    d = tl["score"]["dots"]
    for r in range(2):
        for i in range(3):
            f = K.D_MINOR[i + 2 * r] * 2
            mix.put(d + r * 0.12 + i * 0.09, K.pop(f, f * 1.2), 0.07, pan=0.4 if r else -0.4)

    le = tl["lesson"]
    K.roll(mix, le["years"], 0.5, land_note=K.D_MINOR[4])
    mix.put(le["big"], K.whoosh(0.4, 600, 3000, peak=0.7), 0.13, pan=0.6)
    for k in range(6):
        mix.put(le["source"] + 0.1 + k * 0.42, K.click(2400, 0.02), 0.03)
    K.glitch(mix, le["noSource"], 0.6)
    K.stamp(mix, le["noSource"], big=True)

    K.cta(mix, s["cta"])


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: python3 reels/sfx_e01_2.py <timeline.json> <out.wav>")
    with open(sys.argv[1]) as f:
        tl = json.load(f)
    random.seed(6)
    mix = Mix(tl["duration"], seed=6)
    score(mix, tl)
    mix.master(target_lufs=-18.0)
    mix.write(sys.argv[2])
    print("sfx: {} sounds -> {}".format(mix.count, sys.argv[2]))


if __name__ == "__main__":
    main()
