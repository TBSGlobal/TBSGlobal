"""Soundtrack for the 'Register your school' reel (35 s): message pops, typing ticks, a light beat, an end swell."""
import sys
import wave
import numpy as np

SR, DUR = 44100, 35.0
N = int(SR * DUR)
t = np.arange(N) / SR
mix = np.zeros(N)
rng = np.random.default_rng(5)


def add(sig, at, g=1.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if i < N: mix[i:j] += sig[: j - i] * g


def env(n, a, d):
    x = np.arange(n) / SR
    return np.minimum(1, x / a) * np.exp(-x / d)


def pop(f0=900, f1=1500):            # message "bloop"
    n = int(SR * .16); x = np.arange(n) / SR
    f = f0 + (f1 - f0) * np.minimum(1, x / .05)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .003, .05)


def tick():                           # keyboard tap
    n = int(SR * .03)
    return rng.standard_normal(n) * env(n, .0005, .006) * .5


def kick():
    n = int(SR * .4); x = np.arange(n) / SR
    f = 100 * np.exp(-x * 20) + 48
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, .15)


def hat():
    n = int(SR * .05); s = np.diff(np.concatenate([[0], rng.standard_normal(n)]))
    return s * env(n, .0005, .01) * .45


def chord(freqs, dur, a=.4, d=2.5):
    n = int(SR * dur); x = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * x) for f in freqs) / len(freqs)
    return s * np.minimum(1, x / a) * np.exp(-x / d)


# received (left) vs sent (right) messages
for at, side in [(0.5, 'l'), (1.7, 'l'), (3.0, 'l'), (4.3, 'l'), (5.6, 'r'), (7.0, 'l'), (8.0, 'l'), (9.5, 'r'), (10.6, 'l'),
                 (24.6, 'r'), (25.8, 'r'), (27.0, 'l')]:
    add(pop(700, 1100) if side == 'l' else pop(1100, 1700), at, .55)

# soft pad under the chat scenes
pad = (np.sin(2 * np.pi * 110 * t) + np.sin(2 * np.pi * 164.8 * t) + .5 * np.sin(2 * np.pi * 220 * t)) * .035
mix += pad * ((t < 12.2) | ((t > 24.3) & (t < 29)))

# walkthrough: whoosh in, steady beat, typing ticks while fields fill
wh = (t > 11.8) & (t < 12.6)
mix += wh * rng.standard_normal(N) * np.sin(np.pi * np.clip((t - 11.8) / .8, 0, 1)) * .18
at = 12.5
while at < 24.2:
    add(kick(), at, .45); add(hat(), at + .25, .3); at += .5
for a, b in [(12.9, 14.0), (16.4, 17.2), (17.5, 18.4)]:
    for x in np.arange(a, b, .09): add(tick(), x + rng.uniform(-.015, .015), .6)
for x in [14.8, 18.7, 19.3, 21.6]: add(pop(1300, 1900), x, .5)        # select, tick box, press, share
for i in range(3): add(pop(1500, 2100), 22.0 + i * .5, .4)              # "sent to" pings

# end card: rising swell then a warm chord
rz = (t > 28.4) & (t < 29.8)
k = np.clip((t - 28.4) / 1.4, 0, 1)
mix += rz * (rng.standard_normal(N) * k ** 2 * .16)
add(chord([130.8, 196.0, 261.6, 329.6, 392.0], 5.5), 29.6, .9)
at = 30.1
while at < 34.0:
    add(kick(), at, .4); add(hat(), at + .25, .25); at += .5

fade = np.clip((DUR - t) / 1.5, 0, 1)
mix *= np.where(t > DUR - 1.5, fade, 1)
mix = np.tanh(mix * 1.3); mix /= np.max(np.abs(mix)) + 1e-9; mix *= .89
st = (np.stack([mix, np.roll(mix, int(SR * .007))], 1) * 32767).astype(np.int16)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
print('wrote', sys.argv[1])
