# robot-tethys

A mini telepresence robot. At about $130 total for all parts (including the pictured used Pixel 1 phone), the goal of this robot is to be as inexpensive as possible for a complete telepresence solution.

![robot](/images/robot.jpg?raw=true "robot")

## Assembly

### 3D printed parts

See .stl files in design/. I recommend printing in PETG. PLA sucks.

### Mechanical parts

* [M3 short heat-set inserts](https://www.mcmaster.com/94180a331), M3, OD=5.6mm, L=3.8mm -- [Possible alternative](https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=initeq+m3+long&_sacat=0)
* [M3 long heat-set inserts](https://www.mcmaster.com/94180a333), M3, OD=5.6mm, L=6.4mm -- [Possible alternative](https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=initeq+m3+short&_sacat=0)
* [Pololu 22T track set](https://www.pololu.com/product/3030)
* [Micro metal gearmotors](https://www.pololu.com/category/60/micro-metal-gearmotors) -- If you buy from Pololu, HPCB or HP 75:1 is proboblay the best for this use case but you can go up or down to 30:1 to 150:1 depending on your needs. Get single shaft if you don't plan on even putting encoders in, get dual-shaft if you think you might want encoders later. Get MP instead of HP/HPCB if you want a cheaper motor. Or search eBay/AliExpress for MUCH cheaper alternatives although many suppliers don't provide specs on current and stall torque making it hard to choose. There are also sometimes people on eBay reselling authentic used Pololu motors at cheaper prices.
* [DRV8833 dual motor driver carrier](https://www.pololu.com/product/2130)
* [TinyPICO](https://www.adafruit.com/product/4335)

## Code

WebRTC data channels [don't seem to renegotiate](https://stackoverflow.com/questions/61179293/renegotiating-sdp-withaudiovideodata-webrtc) so I use socket.io for driving and WebRTC for audio/video. Clunky but WebRTC documentation is lacking and all the examples suck at illustrating proper SDP renegotiation.

**server/** contains server code. Run with node and proxy through nginx for https.
