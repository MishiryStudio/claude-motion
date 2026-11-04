"""Sound for reel E01-6 (deck order). Bed and hits from reels/sfx_kit.py.

    python3 reels/sfx_e01_6.py public/shorts/E01-6/timeline.json public/shorts/E01-6/sfx.wav
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
    c = tl["compare"]
    K.music(mix, tl["duration"], groove_from=s["order"], cta=s["cta"], breaks=[(c["link"] - 0.2, s["investor"])])
    K.intro(mix, tl["intro"]["ribbons"], tl["intro"]["mark"])
    for i, cut in enumerate([s["compare"], s["investor"], s["cta"]]):
        K.cut(mix, cut, i)

    o = tl["order"]["slots"]
    for i in range(3):
        f = K.D_MINOR[i * 2] * 2
        mix.put(o + i * 0.1, K.pop(f, f * 1.2), 0.07)

    K.fly_in(mix, c["aProblem"] - 0.1, pan=0.6)
    for i, key in enumerate(["team", "money", "problem"]):
        K.fly_in(mix, c[key] - 0.1, pan=-0.6)
        mix.put(c[key], K.blip(K.D_MINOR[2 + 2 * i], 0.35), 0.07)
    mix.put(c["link"], scratch(0.7), 0.12)
    mix.put(c["chip"], K.impact(0.7), 0.14)
    mix.put(c["chip"], K.chime([K.D_MINOR[0], K.D_MINOR[2], K.D_MINOR[4]], 1.2), 0.1)

    v = tl["investor"]
    mix.put(s["investor"] + 0.1, K.pop(400, 600), 0.08)
    K.fly_in(mix, v["who"], pan=0.6)
    mix.put(v["who"] + 0.1, K.blip(K.D_MINOR[4], 0.35), 0.08)
    K.fly_in(mix, v["pays"], pan=-0.6)
    mix.put(v["pays"] + 0.1, K.blip(K.D_MINOR[6], 0.35), 0.08)
    K.fly_in(mix, v["story"], pan=0.6, gain=0.08)
    mix.put(v["story"] + 0.1, K.blip(K.D_MINOR[1], 0.5), 0.06)

    K.cta(mix, s["cta"])


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: python3 reels/sfx_e01_6.py <timeline.json> <out.wav>")
    with open(sys.argv[1]) as fh:
        tl = json.load(fh)
    random.seed(10)
    mix = Mix(tl["duration"], seed=10)
    score(mix, tl)
    mix.master(target_lufs=-18.0)
    mix.write(sys.argv[2])
    print("sfx: {} sounds -> {}".format(mix.count, sys.argv[2]))


if __name__ == "__main__":
    main()
