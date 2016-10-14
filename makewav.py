import math, wave, sys, array

# raw = [math.sin(i/10.0) for i in range(20000)]

raw = []
f=open(sys.argv[1])
start = False
for li in f.readlines():
    if li.strip()=="START":
        print "GO"
        start = True
        continue
    if li.strip()=="DONE":
        break
    if start:
        i = int(float(li.strip())*1000)
        print i
        raw.append(i)
f.close()
mx=max(raw)
mn=min(raw)
print "max:", mx, "min:", mn, "len:", len(raw)
# print raw
buf = array.array('h')
for samp in raw:
    buf.append(samp)
print buf[:222]
print "buf len:", len(buf)
f=wave.open("wave.wav", 'w')
f.setnchannels(1)
f.setsampwidth(2)
f.setframerate(22050)
f.setnframes(len(buf)*2)        #why?
for i in range(2):
    f.writeframesraw(buf)
f.close()