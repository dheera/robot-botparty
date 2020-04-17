# robot-tethys

A mini telepresence robot. At about $130 total for all parts (including the pictured used Pixel 1 phone), the goal of this robot is to be as inexpensive as possible for a complete telepresence solution.

![robot](/images/video.gif?raw=true "robot")

![robot](/images/robot.jpg?raw=true "robot")

Completed robot.

![robot](/images/charging-wireless.jpg?raw=true "robot")

If you buy a 5V2A Qi charging sticker, you can charge the robot wirelessly just by driving on top of a wireless charger. Simple and no docking alignment fuss!

![robot](/images/charging-usb.jpg?raw=true "robot")

You can use Anker Powerline micro-USB cables to charge the robot without taking it apart. *Not all micro-USB cables* will clear the outer edge of the sprocket.

![robot](/images/tinypico-drv8833-combo.jpg?raw=true "robot")

The motors are driven by a DRV8833 and a TinyPICO ESP32 microcontroller. The phone talks to the ESP32 over BLE. The ESP32 is super feature packed and also has Wi-Fi, capacitive touch sensing, I2C, SPI, UART, ADC, DAC, and lots of other features so you can build off this design and add whatever sensors and actuators you please. Build a security robot, a robot that roams around sensing VOC gas levels, and more!

## Assembly

### 3D printed parts

See .stl files in design/. I recommend printing in PETG. PLA sucks.

### Mechanical parts

* [M3 short heat-set inserts](https://www.mcmaster.com/94180a331), M3, OD=5.6mm, L=3.8mm -- [Possible alternative](https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=initeq+m3+long&_sacat=0)
* [M3 long heat-set inserts](https://www.mcmaster.com/94180a333), M3, OD=5.6mm, L=6.4mm -- [Possible alternative](https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=initeq+m3+short&_sacat=0)
* [Pololu 22T track set](https://www.pololu.com/product/3030)
* [M3 L=5mm countersunk screws](https://www.mcmaster.com/92125a125)
* [M3 L=5mm socket head screws](https://www.mcmaster.com/91292A110)

### Electronics
* [Used Google Pixel 1](https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313.TR9.TRC1.A0.H0.Xpixel+1.TRS2&_nkw=pixel+1&_sacat=0&LH_TitleDesc=0&_osacat=0&_odkw=pixel+1+unlocked) -- You can get them used or "refurbished" for under $65. The charging cord on the portable charger below just barely fits so if you buy any bigger phone than the Pixel 1, you may need an extension on the charging cable. I do **not** recommend using an iPhone as Apple is consistently behind the times in terms of in-browser WebRTC support and doesn't even have bluetooth support from the browser. If you use an iPhone you will have to write an iOS native app from scratch.
* 2 x [Micro metal gearmotors](https://www.pololu.com/category/60/micro-metal-gearmotors) -- If you buy from Pololu, HPCB or HP 75:1 is proboblay the best for this use case but you can go up or down to 30:1 to 150:1 depending on your needs. Get single shaft if you don't plan on even putting encoders in, get dual-shaft if you think you might want encoders later. Get MP instead of HP/HPCB if you want a cheaper motor. Or search eBay/AliExpress for MUCH cheaper alternatives although many suppliers don't provide specs on current and stall torque making it hard to choose. There are also sometimes people on eBay reselling authentic used Pololu motors at cheaper prices.
* Portable charger: [YPLANG 9000mAh](https://www.amazon.com/Powerbank-9000mAh-Portable-Charger-External/dp/B07JMTSPC3) or [BeeFix 9000mAh](https://www.amazon.com/Portable-Charger-9000mAh-External-Battery/dp/B07SNV2B42/) or [Elephant Story 9000mAh](http://www.elephantstory.net/product/ds01/) -- They are the same charger under 2 different brand names). Make sure you get the version with 1 USB-C out + 1 lightning+microUSB combination out, and not their older version with 1 microUSB + 1 lightning. The chassis and 3D printed parts are designed to match this charger, which allows charging+discharging at the same time, and has two charging ports, one of which can be used for a Qi charger sticker.
* [2A Qi fast charging receiver USB-C](https://www.aliexpress.com/item/4000239832349.html?spm=a2g0o.productlist.0.0.35b368d0CEJ0jH&algo_pvid=8c201542-8113-476a-9f66-177729616d19&algo_expid=8c201542-8113-476a-9f66-177729616d19-2&btsid=0be3746c15870616127626599eba46&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) if you want wireless charging where the robot can just drive up onto a charger (optional)
* 1 x DRV8833 carrier [No-name cheap 5 for $8 carrier](https://www.amazon.com/KOOBOOK-DRV8833-Module-Bridge-Controller/dp/B07S4FVY9M/) or [Pololu 1 for $4.95 DRV8833 carrier](https://www.pololu.com/product/2130) or any other DRV8833 carrier
* [TinyPICO](https://www.adafruit.com/product/4335) or other ESP32 board of your choice
* [24 AWG wire](https://www.amazon.com/gp/product/B07G2BWBX8/)
* [1x2 Dupont connector housing](https://www.pololu.com/product/1901) and [crimps](https://www.pololu.com/product/1930) or just get a [kit like this](https://www.amazon.com/gp/product/B078RRPRQZ/). [This crimper](https://www.amazon.com/Crimping-0-08-1-0-18-28AWG-Ratcheting-Connector/dp/B01N1RFZZ4/) has worked well for me for Dupont crimps.
* [JST-EH](https://www.digikey.com/catalog/en/partgroup/eh-series/) connectors for ESP32 board and ESP-DRV8833 connection (or use whatever you prefer). [This crimper](https://www.amazon.com/Engineers-Precision-Crimping-Pliers-Pa-09/dp/B002AVVO7K/) has worked well for me for JST-EH.

## Code

**esp32/** contains firmware for a TinyPICO. (a) Follow TinyPICO's instructions to enable the Arduino IDE (b) install the analogWrite library for ESP32 and then (c) compile it with Arduino. You can then visit the [ESP32 web terminal](https://dheera.github.io/esp32terminal/) to test connectivity. Steps to test:

- Use desktop Chrome on a laptop that has Bluetooth, or Chrome on Android also works. Chrome on iOS will not work.
- Go to chrome://flags/#enable-experimental-web-platform-features and enable.
- Go to the ESP32 web terminal and Connect to "tethys-255" which should be your newly flashed TinyPICO.
- If you connected successfully, you will see "Z" being output every second. That is a heartbeat from the firmware.
- Type "G 0 255 0 255" to drive the motors, and you can try other values as well. They are just PWM values for 2 H-bridges.
- Type "S 4" to set the robot number to 4 or whatever number you want <=255. This is a persistent setting. After a power cycle (unplug and replug the TinyPICO) the device will show up as "tethys-4". This allows you to prevent from connecting the wrong robot phone to the wrong robot ESP32.

**server/** contains server code. Run with node and proxy node through nginx for https (see nginx.conf and sites-available/default). Hacky, to be improved.

You MUST go to chrome://flags/#enable-experimental-web-platform-features on the robot and enable it! This is required for Chrome to be able to talk to BLE devices from a webpage. Only the robot needs this, not your participants.

https://yourserver/robot/#room on the robot with Chrome. You need to set a robot id and a passcode. Then every time you load the page on the robot you need to press the bluetooth button and select the "tethys-###" device. Unfortunately this is a limitation of the web bluetooth API and it cannot auto-connect without a user gesture.

https://yourserver/join/#room is for participants. Chrome on Linux/MacOS/Windows should all work. Issues have been reported on Safari and iOS and I need to get a hold of some Apple hardware to debug these.

WebRTC data channels [don't seem to renegotiate](https://stackoverflow.com/questions/61179293/renegotiating-sdp-withaudiovideodata-webrtc) so I use socket.io for driving and WebRTC for audio/video. Clunky but WebRTC documentation is lacking and all the examples suck at illustrating proper SDP renegotiation.

