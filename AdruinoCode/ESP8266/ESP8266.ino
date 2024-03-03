#include <Wire.h>
#include "RTClib.h"
#include <LiquidCrystal_I2C.h>
#include <Servo.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncWebServer.h>
// Khai báo LCD, RTC, SERVO
LiquidCrystal_I2C lcd(0x27, 16, 2); 
RTC_DS1307 RTC;
DateTime currentTime;
Servo myservo;  
// LED, BUTTON, BUZZER, SERVO PIN
const int LED_PIN = 13; //D7
const int ALARM_PIN = 12; //D6 (BUZZER)
const int SERVO_PIN = 14; //D5
//const int BTN_LED = 2; //D4 
//const int BTN_SERVO = 0; //D3
const int BTN_ALARM = 2; //D4
const int BTN_MENU = 0; //D3
int servoAngle; //pos
// Biến kiểm tra trạng thái của LED, SERVO, ALARM
bool ledStatus;
bool servoStatus = false;
bool alarmStatus = false;
int field = 0; // 0: ledStatus, 1: servoStatus, 2: alarmStatus, 3: clock
DateTime ledAlarm;
DateTime doorAlarm;
DateTime alarmUp;
// Khai báo WIFI kết nối, địa chỉ WebSocket
const char* ssid = "PBC";
const char* password = "12345678@";
// để đưa đoạn code HTML vào chương trình Arduino, cần chuyển đổi code HTML sang dạng char
const char index_html[] PROGMEM = ""
                                  "<!DOCTYPE HTML>"
                                  "<html>"
                                  "<head>"
                                  " <title>ESP8266 WebSocket</title>"
                                  "</head>"
                                  "<body>"
                                  " <div> Webscoket status <span id=\"status\" style=\"font-weight: bold;\"> disconnected </span> </div>"
                                  " <div> ESP8266 Button Status <input type=\"checkbox\" id=\"btn\" name=\"btn\" /> </div>"
                                  " <div> Control LED <input type=\"checkbox\" id=\"led\" name=\"led\" disabled=\"true\" /> </div>"
                                  " <script type=\"text/javascript\">"
                                  " var button = document.getElementById('btn');"
                                  " var led = document.getElementById('led');"
                                  " var status = document.getElementById('status');"
                                  " var url = window.location.host;"
                                  " var ws = new WebSocket('ws://' + url + '/ws');"
                                  " console.log('ws://' + url + '/ws');"
                                  " ws.onopen = function()"
                                  " {"
                                  " status.text = 'Connected';"
                                  " led.disabled = false;"
                                  " };"
                                  " ws.onmessage = function(evt)"
                                  " {"
                                  " if(evt.data == 'BTN_PRESSED') {"
                                  " button.checked = true;"
                                  " } else if(evt.data == 'BTN_RELEASE') {"
                                  " button.checked = false;"
                                  " }"
                                  " };"
                                  " ws.onclose = function() {"
                                  " led.disabled = true;"
                                  " status.text = 'Disconnected';"
                                  " };"
                                  " led.onchange = function() {"
                                  " var status = 'LED_OFF';"
                                  " if (led.checked) {"
                                  " status = 'LED_ON';"
                                  " }"
                                  " ws.send(status)"
                                  " }"
                                  " </script>"
                                  "</body>"
                                  "</html>";
AsyncWebServer server(8000);
AsyncWebSocket ws("/ws");
// Hàm xử lí sự kiện trên Server khi client là browser phát sự kiện
void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data,
               size_t len) {
  // type: loại sự kiện mà server nhận được. Nếu sự kiện nhận được là từ websocket thì bắt đầu xử lí
  if(type == WS_EVT_CONNECT){ //Sự kiện Connect
      Serial.printf("ws[%s][%u] connect\n", server->url(), client->id());
      ledStatus? ws.textAll("LEDStatus_ON") : ws.textAll("LEDStatus_OFF");
      servoStatus? ws.textAll("SERVOStatus_ON") : ws.textAll("SERVOStatus_OFF");
      alarmStatus? ws.textAll("ALARMStatus_ON") : ws.textAll("ALARMStatus_OFF");
  } 
  if (type == WS_EVT_DATA && len > 0) { //Sự kiện nhận được DATA
    data[len] = 0;
    String data_str = String((char*)data); // ép kiểu, đổi từ kiểu char sang String
    if (data_str == "LED_ON") {
        // Khi server phát sự kiện "LED_ON" thì server sẽ bật LED
        digitalWrite(LED_PIN, HIGH);
        ledStatus = true;
        Serial.println("LED_ON");
        ws.textAll("LEDStatus_ON");
    } else if (data_str == "LED_OFF") {
        // Khi server phát sự kiện "LED_OFF" thì server sẽ tắt LED
        digitalWrite(LED_PIN, LOW);
        ledStatus = false;
        Serial.println("LED_OFF");
        ws.textAll("LEDStatus_OFF");
    }
    if (data_str == "DOOR_ON") {
        // Khi server phát sự kiện "DOOR_ON" thì server sẽ bật SERVO
        myservo.write(180);
        servoStatus = true;
        Serial.print("DOOR_ON");
        ws.textAll("DOORStatus_ON");
    } else if (data_str == "DOOR_OFF") {
        // Khi server phát sự kiện "DOOR_OFF" thì server sẽ tắt SERVO
        myservo.write(0);
        servoStatus = false;
        Serial.print("DOOR_OFF");
        ws.textAll("DOORStatus_OFF");
    }
    if (data_str == "ALARM_ON") {
      // Khi client phát sự kiện "ALARM_ON" thì server sẽ tắt BUZZER
      alarmStatus = true;
      Serial.print("ALARM_ON");
      ws.textAll("ALARMStatus_ON");
      for(int i = 0; i < 5; i++){
        digitalWrite(ALARM_PIN, HIGH); 
        delay(300);
        digitalWrite(ALARM_PIN, LOW);
        delay(300);
        if(data_str == "ALARM_OFF"){
        // Khi client phát sự kiện "ALARM_OFF" thì server sẽ tắt BUZZER
        delay(1000);
        break;
        }
      digitalWrite(ALARM_PIN, LOW);
      alarmStatus = false;
      Serial.print("ALARM_OFF");
      ws.textAll("ALARMStatus_OFF");
      }
    }
  }
}      
void setup()
{
  // Khai báo PIN
  pinMode(LED_PIN, OUTPUT); //LED
  //pinMode(BTN_LED, INPUT_PULLUP); // LED BUTTON
  myservo.attach(SERVO_PIN); //SERVO
  //pinMode(BTN_SERVO, INPUT_PULLUP); // SERVO BUTTON
  pinMode(ALARM_PIN, OUTPUT); //BUZZER
  //Thiết lập màn hình LCD
  field = 0;
  lcd.init();
  lcd.backlight();
  Serial.begin(115200); // Bật cổng Serial
  Wire.begin();
  Wire.beginTransmission(0x68);
  Wire.write(0x07);
  Wire.write(0x10);
  Wire.endTransmission();
  //Thiết lập đồng hồ RTC
  RTC.begin();
  if (RTC.isrunning()) {
    Serial.println("RTC is running!");
  } else {
    Serial.println("RTC lost power");
    RTC.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
  currentTime = RTC.now();
  updateLCD();
  // Kết nối WIFI và WebSocket
  Serial.setDebugOutput(true);
  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(ssid, password);
  if (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.printf("STA: Failed!\n");
    WiFi.disconnect(false);
    delay(1000);
    WiFi.begin(ssid, password);
  }
  ws.onEvent(onWsEvent); // gọi hàm onWsEvent
  server.addHandler(&ws);
  server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send_P(200, "text/html", index_html); // trả về file index.html trên giao diện browser khi browser truy cập vào IP của server
  });
  server.begin(); // khởi động server
}
void loop()
{
  ledStatus = digitalRead(LED_PIN);
  checkButtons();
}

// Hàm hiển thị LCD
void updateLCD() {
  String daysOfWeek[] = {"SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"};
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("TIME:   ");
  printWithLeadingZero(currentTime.hour());
  lcd.print(":");
  printWithLeadingZero(currentTime.minute());
  lcd.print(":");
  printWithLeadingZero(currentTime.second());

  lcd.setCursor(0, 1);
  lcd.print(daysOfWeek[currentTime.dayOfTheWeek()]);
  lcd.print("   ");
  printWithLeadingZero(currentTime.day());
  lcd.print("/");
  printWithLeadingZero(currentTime.month());
  lcd.print("/");
  lcd.print(currentTime.year());
}
// Hàm định dạng thêm số 0 cho các số ở hàng đơn vị (x -> 0x)
void printWithLeadingZero(int value) {
  if (value < 10) {
    lcd.print("0");
  }
  lcd.print(value);
}
// Hàm điều khiển LED, SERVO bằng BUTTON
void checkButtons() {
  //Nếu nhấn LED BUTTON thì toggle LED
  // if (digitalRead(BTN_LED) == LOW) {
  //   ledStatus = !ledStatus;
  //   digitalWrite(LED_PIN, ledStatus ? HIGH : LOW);
  //   Serial.print("Button LED pressed - LED status: ");
  //   Serial.println(ledStatus ? "ON" : "OFF");
  //   ledStatus? ws.textAll("LEDStatus_ON") : ws.textAll("LEDStatus_OFF");
  //   delay(500);
  // }
  // //Nếu nhấn SERVO BUTTON thì toggle SERVO
  // if (digitalRead(BTN_SERVO) == LOW) {
  //   servoStatus ? servoAngle = 180 :  servoAngle = 0;
  //   myservo.write(servoAngle);
  //   servoStatus = !servoStatus;
  //   Serial.print("Button Servo pressed - Servo status: ");
  //   Serial.println(servoStatus ? "ON" : "OFF");
  //   servoStatus? ws.textAll("SERVOStatus_ON") : ws.textAll("SERVOStatus_OFF");
  //   delay(500);
  // }
  //Nếu nhấn ALARM BUTTON thì bật ALARM
  if (digitalRead(BTN_ALARM) == LOW) {
    alarmStatus == true;
    Serial.print("ALARM_ON");
    ws.textAll("ALARMStatus_ON");
    for(int i = 0; i < 5; i++){
          digitalWrite(ALARM_PIN, HIGH); 
          delay(300);
          digitalWrite(ALARM_PIN, LOW);
          delay(300);
          if(digitalRead(BTN_ALARM) == LOW){
            delay(1000);
            break;
          }
    }
      digitalWrite(ALARM_PIN, LOW);
      alarmStatus = false;
      Serial.print("ALARM_OFF");
      ws.textAll("ALARMStatus_OFF");
    delay(500);
  }
  //Nếu nhấn MENU BUTTON thì hiển thị lên LCD
  if (digitalRead(BTN_MENU) == LOW) {
    switch(field){
      case 0: 
        {
          ledStatus? printStatus("LED", "ON") : printStatus("LED", "OFF");
          field += 1;
        }
        break;
      case 1: 
        {
          servoStatus? printStatus("DOOR", "ON") : printStatus("DOOR", "OFF");
          field += 1;
        }
        break;
      case 2: 
        {
          alarmStatus? printStatus("ALARM", "ON") : printStatus("ALARM", "OFF");
          field += 1;
        }
        break;
      case 3: 
        {
          updateLCD();
          field = 0;
        }
        break;
    }
    
    delay(500);
  }
}
// Hàm in giá trị của các thiết bị lên LCD
void printStatus(String device, String status){
    lcd.clear();
    lcd.setCursor(0, 0);
    if (device == "LED") lcd.print("LED  :  ");
    else if (device == "DOOR") lcd.print("DOOR :  ");
    else if (device == "ALARM") lcd.print("ALARM:  ");
    printWithLeadingZero(currentTime.hour());
    lcd.print(":");
    printWithLeadingZero(currentTime.minute());
    lcd.print(":");
    printWithLeadingZero(currentTime.second());

    lcd.setCursor(0, 1);
    status? lcd.print("ON ") : lcd.print("OFF");
    lcd.print("   ");
    printWithLeadingZero(currentTime.day());
    lcd.print("/");
    printWithLeadingZero(currentTime.month());
    lcd.print("/");
    lcd.print(currentTime.year());
}