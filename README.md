# robot-tethys

A mini telepresence robot. The goal of this robot is to be as inexpensive as possible for a complete telepresence solution.

## Assembly

### 3D printed parts

See .stl files in design/. I recommend printing in PETG. PLA sucks.

### Mechanical parts

* [M3 short heat-set inserts](https://www.mcmaster.com/94180a331), M3, OD=5.6mm, L=3.8mm -- [Possible alternative](https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=initeq+m3+long&_sacat=0)
* [M3 long heat-set inserts](https://www.mcmaster.com/94180a333), M3, OD=5.6mm, L=6.4mm -- [Possible alternative](https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=initeq+m3+short&_sacat=0)
* [Pololu 22T track set](https://www.pololu.com/product/1415)
* [Micro metal gearmotors](https://www.pololu.com/category/60/micro-metal-gearmotors) -- If you buy from Pololu, HPCB or HP 75:1 is proboblay the best for this use case but you can go up or down to 30:1 to 150:1 depending on your needs. Get single shaft if you don't plan on even putting encoders in, get dual-shaft if you think you might want encoders later. Get MP instead of HP/HPCB if you want a cheaper motor. Or search eBay/AliExpress for MUCH cheaper alternatives although many suppliers don't provide specs on current and stall torque making it hard to choose. There are also sometimes people on eBay reselling authentic used Pololu motors at cheaper prices.
* [DRV8833 dual motor driver carrier](https://www.pololu.com/product/2130)
* [TinyPICO](https://www.adafruit.com/product/4335)

#### 

* 1 x [Savox SH-0262MG](https://www.amazon.com/gp/product/B004IZSI9S/) for the head
* 4 x [Savox SC-1251MG](https://www.amazon.com/gp/product/B004K3FAJE/) for the rest of the joints

#### Other electronics

* 1 x Raspberry Pi 3 B+
* 1 x [IMX290 USB camera](https://www.amazon.com/gp/product/B07L6TPB35/)
* 1 x [12x5050 Neopixel ring](https://www.adafruit.com/product/1643)
* 1 x [BNO055 breakout](https://www.amazon.com/Adafruit-Absolute-Orientation-Fusion-Breakout/dp/B017PEIGIG)
* 1 x [PCA9685 breakout](https://www.amazon.com/gp/product/B01G61MZF4/)
* 1 x [12V to 6V 3A DC-DC](https://www.amazon.com/gp/product/B00CGQRIFG/) for servos
* 1 x [12V to 5V 3A DC-DC](https://www.amazon.com/gp/product/B00C63TLCC/) for Pi

## Code
