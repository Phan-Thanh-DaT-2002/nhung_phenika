#include <Wire.h>
#include <Servo.h>
#include "RTClib.h"
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);  // Địa chỉ của lcd 16x2
#define BUZZER 9
int led = 12;
int btn1 = 3;
int btn2 = 4;
int pos = 0;
bool ledState = false;
bool servoState = false;
bool alarmOn = false;
RTC_DS1307 RTC;
DateTime currentTime;
Servo myservo;

void setup() {
  pinMode(led, OUTPUT);
  pinMode(btn1, INPUT_PULLUP);
  pinMode(btn2, INPUT_PULLUP);
  pinMode(BUZZER, OUTPUT);
  myservo.attach(5);
  lcd.init();
  lcd.backlight();
  Serial.begin(115200);
  Wire.begin();
  Wire.beginTransmission(0x68);
  Wire.write(0x07);
  Wire.write(0x10);
  Wire.endTransmission();
  RTC.begin();
  if (RTC.isrunning()) {
    // Serial.println("RTC is running!");
  } else {
    // Serial.println("RTC lost power");
    RTC.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
  digitalWrite(led, LOW);
  sendStatusToESP();
}

void loop() {
  currentTime = RTC.now();
  updateLCD();
  checkButtons();
  checkAlarm();
}

void checkButtons() {
  if (digitalRead(btn1) == LOW) { // Button 1 pressed
    ledState = !ledState; // Toggle LED state
    digitalWrite(led, ledState);
    Serial.print("LED:");
    Serial.print(ledState);
    delay(1000);
  }

  if (digitalRead(btn2) == LOW) { // Button 2 pressed
    if (servoState) {
      myservo.write(90); // Rotate servo back to initial position
    } else {
      myservo.write(0); // Rotate servo 90 degrees
    }
    servoState = !servoState; // Toggle servo state
    Serial.print("Servo:");
    Serial.println(servoState);
    delay(1000);
  }
}

void updateLCD() {
  String daysOfWeek[] = {"SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"};

  lcd.setCursor(0, 0);
  lcd.print("TIME: ");
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


void printWithLeadingZero(int value) {
  if (value < 10) {
    lcd.print("0");
  }
  lcd.print(value);
}

void checkAlarm() {
  // Check if alarm time is reached
  if (alarmOn) {
    for (int i = 0; i < 5; i++) {
      digitalWrite(BUZZER, HIGH);
      delay(100);
      digitalWrite(BUZZER, LOW);
      delay(100);
    }
  }
  alarmOn = false;
}

void sendStatusToESP() {
  // Send LED and Servo status to ESP8266 via UART
  Serial.print("LED:");
  Serial.print(ledState);
  Serial.print(",Servo:");
  Serial.println(servoState);
}
