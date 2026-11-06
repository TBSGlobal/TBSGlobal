"""Synthesise the reel's soundtrack (31 s, 44.1 kHz stereo WAV). No samples, all generated."""
import sys
import wave
import numpy as np

SR = 44100
DUR = 31.0
N = int(SR * DUR)
t = np.arange(N) / SR
mix = np.zeros(N)
rng = np.random.default_rng(3)


def add(sig, at, gain=1.0):
    i = int(at * SR)
    j = min(N, i + len(sig))
    if i < N:
        mix[i:j] += sig[: j - i] * gain


def env(n, a=0.002, d=0.08):
    x = np.arange(n) / SR
    return np.minimum(1, x / a) * np.exp(-x / d)


def click(freq=2400, d=0.025):
    n = int(SR * 0.08)
    x = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * x) * env(n, 0.0005, d)


def kick():
    n = int(SR * 0.45)
    x = np.arange(n) / SR
    f = 110 * np.exp(-x * 18) + 45
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(n, 0.001, 0.18)


def hat():
    n = int(SR * 0.06)
    s = rng.standard_normal(n)
    s = np.diff(np.concatenate([[0], s]))  # brighten
    return s * env(n, 0.0005, 0.012) * 0.5


def boom():
    n = int(SR * 2.2)
    x = np.arange(n) / SR
    f = 70 * np.exp(-x * 3) + 32
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-x * 1.6)
    noise = rng.standard_normal(n) * np.exp(-x * 9) * 0.35
    return body + noise


# 0-7 s: ticks that speed up with the mentions counter, over a rising drone
tt = 0.3
while tt < 6.9:
    k = tt / 6.9
    add(click(2200 + 900 * k), tt, 0.35 + 0.25 * k)
    tt += 0.42 * (1 - k) ** 1.6 + 0.045
drone_env = np.clip(t / 6.9, 0, 1) ** 1.5 * (t < 6.95)
drone = (np.sin(2 * np.pi * 55 * t) + 0.5 * np.sin(2 * np.pi * (110 + 40 * np.clip(t / 6.9, 0, 1)) * t)) * drone_env * 0.18
mix += drone

# 6.95 s: everything cuts. A single soft "pop" lands the stat at 7.9 s.
add(click(900, 0.12), 7.9, 0.5)

# 10.4-18.5 s: a calm pulse under the dashboard and the textbook
for i in range(int((18.4 - 10.6) / 0.5)):
    at = 10.6 + i * 0.5
    add(kick(), at, 0.32 if at < 14.6 else 0.22)
    if at < 14.6:
        add(hat(), at + 0.25, 0.25)
# glitch burst as the dashboard breaks (14.2-14.6)
gl = (t > 14.2) & (t < 14.6)
mix += gl * rng.standard_normal(N) * 0.12 * (np.sin(2 * np.pi * 30 * t) > 0)

# 18.6-21.5 s: riser into the title
rz = (t >= 18.6) & (t < 21.5)
k = np.clip((t - 18.6) / 2.9, 0, 1)
noise = rng.standard_normal(N)
riser = noise * k ** 2.2 * 0.22 + np.sin(2 * np.pi * (200 + 900 * k ** 2) * t) * k ** 2 * 0.08
mix += riser * rz

# 21.5 s: impact
add(boom(), 21.5, 0.9)

# 22-31 s: driving beat, 120 bpm, fading out at the end
bpm_step = 0.5
at = 22.0
while at < 30.6:
    add(kick(), at, 0.55)
    add(hat(), at + 0.25, 0.35)
    at += bpm_step
bass_t = (t >= 22) & (t < 31)
bass = np.sin(2 * np.pi * 55 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 2 * t))) * 0.12 * bass_t
mix += bass
fade = np.clip((DUR - t) / 2.0, 0, 1)
mix *= np.where(t > DUR - 2.0, fade, 1)

# master: soft limit and normalise
mix = np.tanh(mix * 1.4)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89
left = mix
right = np.roll(mix, int(SR * 0.008))  # tiny stereo width
stereo = (np.stack([left, right], 1) * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(stereo.tobytes())
print("wrote", sys.argv[1])
