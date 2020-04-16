#include <Arduino.h>

#include <TinyPICO.h>

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#include <EEPROM.h>
#include <analogWrite.h>

#define EEPROM_SIZE 1

#define BAUDRATE 115200


#define SERVICE_UUID "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

BLEServer *pServer;
BLEService *pService;
BLECharacteristic *pTxCharacteristic;
BLECharacteristic *pRxCharacteristic;

bool deviceConnected = false;
std::string rxValue = "";

void ble_send(std::string msg) {
  Serial.print("# sending: ");
  Serial.println(msg.c_str());
  pTxCharacteristic->setValue((byte*)msg.c_str(), msg.size());
  pTxCharacteristic->notify();
}

int pinMapping[4] = {22,21,32,33};

unsigned long last_command_time = 0;

void on_ble_receive(std::string msg) {
  // command format: 3 bytes:
  // ['P'] [channel] [value]
  // sets PWM of channel to value

  char str[256];
  strcpy(str, msg.c_str());
  const char* delim = " ";
  char* token;

  token = strtok(str, delim);

  if(strcmp(token,"G")==0) {
    token = strtok(NULL, delim);
    int channel = 0;
    while(token != NULL) {
      Serial.print("channel ");
      Serial.print(channel);
      Serial.print(" -> ");
      int value = atoi(token);
      Serial.println(value);
      analogWrite(pinMapping[channel], value);
      
      token = strtok(NULL, delim);
      channel++;
    }

    last_command_time = millis();
  } else if(strcmp(token, "S")==0) {
    token = strtok(NULL, delim);
    unsigned char robot_id = atoi(token);
    EEPROM.write(0, robot_id);
    EEPROM.commit();
    Serial.print("set robot id -> ");
    Serial.println((int)robot_id);
  }

}


class MyServerCallbacks : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer)
    {
        Serial.println("# connected");
        deviceConnected = true;
    }
    void onDisconnect(BLEServer *pServer)
    {
        Serial.println("# disonnected");
        deviceConnected = false;
    }
};

class MyCallbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic)
    {
        Serial.print("# received: ");
        rxValue = pCharacteristic->getValue();
        Serial.println(rxValue.c_str());
        on_ble_receive(rxValue);
    }
};

void setup() {



    for(int channel=0;channel<4;channel++) {
      pinMode(pinMapping[channel], INPUT);
      digitalWrite(pinMapping[channel], LOW);
    }
    
    EEPROM.begin(EEPROM_SIZE);

    int bot_num = EEPROM.read(0);
    
    Serial.begin(BAUDRATE);

    char robot_name[256];
    sprintf(robot_name, "tethys-%d", bot_num);
    BLEDevice::init(robot_name);
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    pService = pServer->createService(SERVICE_UUID);

    // TX
    pTxCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID_TX,
        BLECharacteristic::PROPERTY_NOTIFY
    );
    pTxCharacteristic->addDescriptor(new BLE2902());

    // RX
    pRxCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID_RX,
        BLECharacteristic::PROPERTY_WRITE
    );
    pRxCharacteristic->setCallbacks(new MyCallbacks());

    pService->start();
    pServer->getAdvertising()->start();
    
    Serial.println("# waiting for client connection ...");

    
}

void loop() {
    static unsigned long millis_last = 0;
    static unsigned long reset_last = 0;

    if (millis() - last_command_time >= 1000) {
      if(millis() - reset_last >= 1000) {
        reset_last = millis();
        for(int channel=0;channel<4;channel++) {
          analogWrite(pinMapping[channel], 0);
        }
      }
    }

    if (millis() - millis_last >= 1000) {
        millis_last = millis();

        if (deviceConnected) {
            char msg[] = "Z\n";
            ble_send(msg);

            Serial.println(touchRead(4));
        }
    }
}
