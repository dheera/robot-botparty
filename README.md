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
* M3 countersunk screws
* M3 hex head screws

### Electronics
* used Google Pixel 1 -- search eBay. You can get them for under $65. The charging cord just barely fits so if you buy any bigger phone you may need to extend the charging cable.
* 2 x [Micro metal gearmotors](https://www.pololu.com/category/60/micro-metal-gearmotors) -- If you buy from Pololu, HPCB or HP 75:1 is proboblay the best for this use case but you can go up or down to 30:1 to 150:1 depending on your needs. Get single shaft if you don't plan on even putting encoders in, get dual-shaft if you think you might want encoders later. Get MP instead of HP/HPCB if you want a cheaper motor. Or search eBay/AliExpress for MUCH cheaper alternatives although many suppliers don't provide specs on current and stall torque making it hard to choose. There are also sometimes people on eBay reselling authentic used Pololu motors at cheaper prices.
* Portable charger: [YPLANG 9000mAh](https://www.amazon.com/Powerbank-9000mAh-Portable-Charger-External/dp/B07JMTSPC3) or [Elephant Story 9000mAh](http://www.elephantstory.net/product/ds01/) -- They are the same charger under 2 different brand names). Make sure you get the version with 1 USB-C out + 1 lightning+microUSB combination out, and not their older version with 1 microUSB + 1 lightning. The chassis and 3D printed parts are designed to match this charger, which allows charging+discharging at the same time, and has two charging ports, one of which can be used for a Qi charger sticker.
* [2A Qi fast charging receiver USB-C](https://www.aliexpress.com/item/4000239832349.html?spm=a2g0o.productlist.0.0.35b368d0CEJ0jH&algo_pvid=8c201542-8113-476a-9f66-177729616d19&algo_expid=8c201542-8113-476a-9f66-177729616d19-2&btsid=0be3746c15870616127626599eba46&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) if you want wireless charging where the robot can just drive up onto a charger (optional)
* 1 x DRV8833 carrier [No-name cheap 5 for $8 carrier](https://www.amazon.com/KOOBOOK-DRV8833-Module-Bridge-Controller/dp/B07S4FVY9M/) or [Pololu 1 for $4.95 DRV8833 carrier](https://www.pololu.com/product/2130) or any other DRV8833 carrier
* [TinyPICO](https://www.adafruit.com/product/4335) or other ESP32 board of your choice
* [24 AWG hookup wire](https://www.amazon.com/gp/product/B0791B1YPS/)
* [1x2 female Dupont connectors and crimps](https://www.amazon.com/gp/product/B078RRPRQZ/) for motors (or use whatever you prefer)
* [JST-EH](https://www.digikey.com/catalog/en/partgroup/eh-series/) connectors for ESP32 board and ESP-DRV8833 connection (or use whatever you prefer)

## Code

WebRTC data channels [don't seem to renegotiate](https://stackoverflow.com/questions/61179293/renegotiating-sdp-withaudiovideodata-webrtc) so I use socket.io for driving and WebRTC for audio/video. Clunky but WebRTC documentation is lacking and all the examples suck at illustrating proper SDP renegotiation.

**server/** contains server code. Run with node and proxy through nginx for https.
