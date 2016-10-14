import math, wave, array

raw = [math.sin(i/10.0) for i in range(20000)]
# print raw
buf = array.array('h')
for samp in raw:
    i = int(samp*10000)
    buf.append(i)
print buf[:222]
f=wave.open("wave.wav", 'w')
f.setnchannels(1)
f.setsampwidth(2)
f.setframerate(22050)
f.writeframes(buf)
f.close()