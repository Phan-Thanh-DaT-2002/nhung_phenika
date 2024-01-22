#include <Wire.h>
#include <IRremote.h>
#include "RTClib.h"
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);  // Địa chỉ của lcd 16x2
#define BUZZER 5

RTC_DS1307 RTC;
int led = 11;
int btn1 = 10;
int btn2 = 9;
int value;
int valueHourOn;
int valueMinutedOn;
int valueSecondOn;
int valueDOn;
int valueMOn;
int valueYOn;
bool isAlarm=true;
int digit;
int valueHourOff;
int valueMinutedOff;
int valueSecondOff;
bool state = true;
const int receiverPin = 12;  // Chân digital 12 dùng để đọc tín hiệu IR
IRrecv irrecv(receiverPin);  // Tạo đối tượng IRrecv mới
decode_results results;      // Lưu giữ kết quả giải mã tín hiệu
bool stage = true;
bool lcd_active = true; // trạng thái của lcd
bool editingTime = false;  // Biến để kiểm tra xem đang trong chế độ chỉnh sửa thời gian hay không
DateTime currentTime;
DateTime currentTimeOn = DateTime(2063, 1, 1, 0, 0, 0);
DateTime currentTimeOff = DateTime(2063, 1, 1, 0, 0, 0);

int editField = 0;  // Biến để xác định trường nào đang được chỉnh sửa (0: giờ, 1: phút, 2: giây, 3: ngày, 4: tháng, 5: năm)
DateTime editedTimeOn;
DateTime editedTimeOff;

bool blink = false;           // Biến để kiểm tra trạng thái nhấp nháy
unsigned long lastBlinkTime;  // Biến để lưu thời gian cuối cùng nhấp nháy
bool isMenu = false;    

void setup() {
  pinMode(led, OUTPUT);
  pinMode(btn1, INPUT_PULLUP);
  pinMode(btn2, INPUT_PULLUP);
  pinMode(BUZZER, OUTPUT);
  lcd.init();
  lcd.backlight();
  Serial.begin(9600);
  irrecv.enableIRIn();
  Wire.begin();
  Wire.beginTransmission(0x68);
  Wire.write(0x07);
  Wire.write(0x10);
  Wire.endTransmission();
  RTC.begin();
  if (RTC.isrunning()) {
    // // Serial.println("RTC is running!");
  } else {
    // // Serial.println("RTC lost power");
    RTC.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
  digitalWrite(led, LOW);
}

void loop() {
  currentTime = RTC.now();
  if (irrecv.decode(&results)) {
    Serial.println(results.value, HEX);
    delay(200);
    irrecv.resume();
    switch (results.value) {
      case 0xFFA25D: // nút tự hủy (nguồn) : bật tắt LCD
      {

      if (lcd_active)
      {
        Serial.println("OFF");        
        lcd.clear();
        lcd.noBacklight(); // Tắt LCD backlight
        lcd_active = false;
        digitalWrite(led,LOW);
        digitalWrite(BUZZER, LOW);
      }
      else
      {
        // // Serial.println("ON");
        lcd.backlight(); // Bật LCD backlight
        lcd_active = true;
        currentTimeOn = DateTime(2063, 1, 1, 0, 0, 0);
        currentTimeOff = DateTime(2063, 1, 1, 0, 0, 0);
        stage = true;
        editingTime = false; 
        editField = 0; 
        blink = false;
        isMenu = false;
      }
    }
    break;
      case 0xFF02FD:  // nút up (bat dau chinh sua giờ on )
        {
            // // Serial.println("Set Alarm ON");
            if(!editingTime && !isMenu){
            editingTime = true;
            stage = true;
            valueHourOn = currentTime.hour();
            valueMinutedOn = currentTime.minute();
            valueSecondOn = currentTime.second();
            valueDOn = currentTime.day();
            valueMOn = currentTime.month();
            valueYOn = currentTime.year();

            delay(200);
        }

        }
        break;
      case 0xFF9867:  // nút down (bat dau chinh sua giờ off )
       state = !state;
        editField = 3;
        Serial.println(state);
        break;
      case 0xFF22DD:  //nut test : hoan thanh chinh sua
        {
          if (editingTime && !isMenu) {
            stage ? currentTimeOn = DateTime(valueYOn, valueMOn, valueDOn, valueHourOn, valueMinutedOn, valueSecondOn) : currentTimeOff = DateTime(valueYOn, valueMOn, valueDOn, valueHourOff, valueMinutedOff, valueSecondOff);
            AlarmInfo();
            lcd.clear();
            // // Serial.println("Done!");
            editField = 0;

          }
          editingTime = false;  // Kết thúc chế độ chỉnh sửa thời gian
          break;
        }
      case 0xFFE01F:  //left: chinh giờ.
        if (state){
          if (editingTime ) {
            blink = true;
            editField = 0;
            Serial.print(editField);
            Serial.print(":");
            Serial.println(state);

            break;
          }
        }
        else {
           if (editingTime ) {
            blink = true;
            editField = 3;
            Serial.print(editField);
            Serial.print(":");
            Serial.println(state);
            break;
          }
        }
      case 0xFFA857:  //PAUSE : chinh phút.

       if (state){
          if (editingTime ) {
            blink = true;
            editField = 1;
            Serial.print(editField);
            Serial.print(":");
            Serial.println(state);

            break;
          }
        }
        else {
           if (editingTime ) {
            blink = true;
            editField = 4;
            Serial.print(editField);
            Serial.print(":");
            Serial.println(state);

            break;
          }
        }
        
        break;
      case 0xFF906F:  //right: chinh giây.
             if (state){
          if (editingTime ) {
            blink = true;
            editField = 2;
            Serial.print(editField);
            Serial.print(":");
            Serial.println(state);

            break;
          }
        }
        else {
           if (editingTime ) {
            blink = true;
            editField = 5;
            Serial.print(editField);
            Serial.print(":");
            Serial.println(state);

            break;
          }
        }
        case 0xFF6897: { //0
          digit = 0;
          stage ? setDataOn(digit) : setDataOff(digit);
          break;
        }
        case 0xFF30CF: { //1
          digit = 1;
          stage ? setDataOn(digit) : setDataOff(digit);
          break;
        }
        case 0xFF18E7: { //2
          digit = 2;
        stage ? setDataOn(digit) : setDataOff(digit);
          break;
        }
        case 0xFF7A85: { //3
          digit = 3;
        stage ? setDataOn(digit) : setDataOff(digit);
          break;
        }
        case 0xFF10EF: { //4
          digit = 4;
        stage ? setDataOn(digit) : setDataOff(digit);
          break;
        }
        case 0xFF38C7: { //5
          digit = 5;
        stage ? setDataOn(digit) : setDataOff(digit);
          break;
        }
        case 0xFF5AA5: { //6
          digit = 6;
        stage ? setDataOn(digit) : setDataOff(digit);
          break;
        }
        case 0xFF42BD: { //7
          digit = 7;
        stage ? setDataOn(digit) : setDataOff(digit);
          break;
        }
        case 0xFF4AB5: { //8
          digit = 8;
        stage ? setDataOn(digit) : setDataOff(digit);
          break;
        }
        case 0xFF52AD: { //9
          digit = 9;
        stage ? setDataOn(digit) : setDataOff(digit);
          break;
        }
    case 0xFFE21D: // nút menu (hiển thị/thoát hiển thị thời gian set up.)
    {
      if(!editingTime){
        isMenu = !isMenu;
        if(isMenu) {
          lcd.clear();
          AlarmInfo();
        } else lcd.clear();
      }
    }
    break;
    
    case 0xFFC23D : //back : huy set up (đang set giờ nhưng muốn thoát chương trình)
    {
      if(!isMenu && editingTime) {
        // // Serial.println("Back");
        lcd.clear();
        editingTime = false;
      }
      break;
    }
    case 0xFFB04F : //C (delete): cho giá trị đang setup về thực 
    {
      switch (editField) {
            case 0:  // Editing hours
              stage ?  valueHourOn = currentTime.hour() : valueHourOff = currentTime.hour();
                break;
            case 1:  // Editing minutes
              stage ?  valueMinutedOn = currentTime.minute() : valueMinutedOff = currentTime.minute();
              break;
            case 2:  // Editing seconds
              stage ?  valueSecondOn = currentTime.second() : valueSecondOff = currentTime.second();
              break;
            case 3:  // Editing hours
              stage ?  valueDOn = currentTime.day() : valueHourOff = currentTime.hour();
                break;
            case 4:  // Editing minutes
              stage ?  valueMOn = currentTime.month() : valueMinutedOff = currentTime.minute();
              break;
            case 5:  // Editing seconds
              stage ?  valueYOn = currentTime.year() : valueSecondOff = currentTime.second();
              break;
          }
      break;
    }
    }
  }
  int btn1State = digitalRead(btn1);
  if(btn1State == LOW){
    if(!editingTime){
    isMenu = !isMenu;
    if(isMenu) {
      lcd.clear();
      AlarmInfo();
    } else lcd.clear();
    }
  }

  if(editingTime && stage && lcd_active && !isMenu){
    lcd.setCursor(1, 0);
    lcd.print("ON:  ");
  } else if(editingTime && !stage && lcd_active && !isMenu){
    lcd.setCursor(1, 0);
    lcd.print("OFF: ");
  }
  if(lcd_active && !isMenu){
      lcd.setCursor(6, 0);
  if (editingTime && blink && editField == 0) 
      {
        lcd.print("  ");
      } 
      else if (editingTime)
      {
        stage ? printDigits(valueHourOn) : printDigits(valueHourOff);
      } 
      else {
        printDigits(currentTime.hour());
      }
  lcd.print(":");
  if (editingTime && blink && editField == 1) 
      {
        lcd.print("  ");
      }
      else if (editingTime)
          {
             stage ? printDigits(valueMinutedOn) : printDigits(valueMinutedOff);
          } 
      else {
        printDigits(currentTime.minute());
      }
  lcd.print(":");
  if (editingTime && blink && editField == 2) 
      {
        lcd.print("  ");
      } 
        else if (editingTime){
          stage ? printDigits(valueSecondOn) : printDigits(valueSecondOff);
      } 
        else {
         printDigits(currentTime.second());
         }
  lcd.print(" ");
   lcd.setCursor(5, 1);
  
  // Hiển thị ngày
  if (editingTime && blink && editField == 3) {
    lcd.print("  ");
  } 
   else if (editingTime){
          stage ? printDigits(valueDOn) : printDigits(valueSecondOff);
      } else {
    printDigits(currentTime.day());
  }
  lcd.print("/");

  // Hiển thị tháng
  if (editingTime && blink && editField == 4) {
    lcd.print("  ");
  } 
   else if (editingTime){
          stage ? printDigits(valueMOn) : printDigits(valueSecondOff);
      } else {
    printDigits(currentTime.month());
  }
  lcd.print("/");

  // Hiển thị năm
  if (editingTime && blink && editField == 5) {
    lcd.print("    ");  // Điều chỉnh khoảng trắng để giữ nguyên độ dài của năm
  }
   else if (editingTime){
          stage ? printDigits(valueYOn) : printDigits(valueSecondOff);
      }  else {
    printDigits(currentTime.year());
  }
  lcd.print(" ");
  }

  // Thực hiện hiệu ứng nhấp nháy
  if (editingTime && millis() - lastBlinkTime > 500) {
    blink = !blink;
    lastBlinkTime = millis();
  }

  // // Serial.print("Alarm"); 
  // // Serial.print(editedTimeOff.hour());
  // // Serial.print(":");
  // // Serial.print(editedTimeOff.minute());
  // // Serial.print(":");
  // // Serial.print(editedTimeOff.second());
  // // Serial.print(" | ");
  //// Serial.print("Now");
  //// Serial.print(now.hour());
  //// Serial.print(":");
  //// Serial.print(now.minute());
  //// Serial.print(":");
  //// Serial.println(now.second());
  if (currentTime == currentTimeOn && !editingTime) {
    digitalWrite(led, HIGH);
    alarmOn();
    // // Serial.println("Alarm On");
    //currentTimeOn = DateTime(2063, 1, 1, 0, 0, 0);
    AlarmInfo();
  }
//  if (currentTime == currentTimeOff && !editingTime) {
//    digitalWrite(led, LOW);
    // // Serial.println("Alarm Off");
//    currentTimeOff = DateTime(2063, 1, 1, 0, 0, 0);
//    AlarmInfo();
//  }

  delay(100);
}

void printDigits(int digits) {
  // utility function for digital clock display: prints leading 0
  if (digits < 10)
    lcd.print('0');
  lcd.print(digits);
}

void setDataOn(int digit){
  if (editingTime) {                                       
          //// Serial.print("digit: ");
          //// Serial.println(digit);
          //// Serial.print("editField: ");
          //// Serial.println(editField);

          // Update the corresponding time field based on the current editing field
          switch (editField) {
            case 0:  // Editing hours
              if((valueHourOn*10 + digit)>23){
                //// Serial.println("bạn đã nhập quá 23 giờ");
                valueHourOn = digit;
              }else
                {valueHourOn = valueHourOn*10 + digit;}
                break;
            case 1:  // Editing minutes
             if((valueMinutedOn*10 + digit)>59){
                //// Serial.println("bạn đã nhập quá 59 phút");
                valueMinutedOn = digit;
            }else
              {valueMinutedOn = valueMinutedOn*10 + digit;}
              break;
            case 2:  // Editing seconds
             if((valueSecondOn*10 + digit)>59){
                //// Serial.println("bạn đã nhập quá 59 giây");
                valueSecondOn = digit;
            }else
              {valueSecondOn = valueSecondOn*10 + digit;}
              break;

               case 3:  // Editing D

               if((valueDOn*10 + valueDOn)>31){
                //// Serial.println("bạn đã nhập quá 59 giây");
                valueDOn = digit;
            }else
              {valueDOn = valueDOn*10 + digit;}
              break;
              case 4:  // Editing M

               if((valueMOn*10 + valueMOn)>12){
                //// Serial.println("bạn đã nhập quá 59 giây");
                valueMOn = digit;
            }else
              {valueMOn = valueMOn*10 + digit;}
              break;
               case 5:  // Editing Y

                if((valueYOn*10 + valueYOn)>9999){
                //// Serial.println("bạn đã nhập quá 59 giây");
                valueYOn = digit;
            }else
              {valueYOn = valueYOn*10 + digit;}
              break;
          }
        }
}
void setDataOff(int digit){
 
}
void alarmOn() {
  for (int i = 0; i < 5; ++i) {
    int btn2State = digitalRead(btn2);
    digitalWrite(BUZZER, HIGH); // Set the voltage to high and make a noise
    delay(200);
    digitalWrite(BUZZER, LOW);  // Set the voltage to low and make no noise
    delay(800);
    // Check if the button is pressed to stop the alarm
    if (results.value == 0xFF22DD || results.value == 0xFFE21D || btn2State == LOW) {
      // Button is pressed, break out of the loop
      currentTimeOn = DateTime(2063, 1, 1, 0, 0, 0);
      digitalWrite(led, LOW);
      digitalWrite(BUZZER, LOW);
      return 0;
    } 
    else if (results.value == 0xFFA25D) {
      // Button is pressed, break out of the loop
      currentTimeOn = DateTime(2063, 1, 1, 0, 0, 0);
      digitalWrite(led, LOW);
      digitalWrite(BUZZER, LOW);
      Serial.println("OFF");        
      lcd.clear();
      lcd.noBacklight(); // Tắt LCD backlight
      lcd_active = false;
      return 0;
    } 
    else {
      continue;
    }
  }
  digitalWrite(led, LOW);
  valueMinutedOn += 5;
  // Kiểm tra và điều chỉnh giá trị của phút
  if (valueMinutedOn > 59) {
    valueMinutedOn -= 60;
    valueHourOn += 1;
    // Kiểm tra và điều chỉnh giá trị của giờ
    if (valueHourOn > 23) {
      valueHourOn = 0;  // Quay lại 0 nếu giờ vượt quá 23
    }
  }
  currentTimeOn = DateTime(valueYOn, valueMOn, valueDOn, valueHourOn, valueMinutedOn, valueSecondOn);
}

void AlarmInfo() {
      int y1 = currentTimeOn.year();
        if (!editingTime && lcd_active && (y1 != 2063)&& isMenu)
      {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("ON :  ");
        
        printDigits(currentTimeOn.hour());
        lcd.print(":");
        printDigits(currentTimeOn.minute());
        lcd.print(":");
        printDigits(currentTimeOn.second());



        lcd.setCursor(5, 1);
        printDigits(currentTimeOn.day());
        lcd.print("/");
        printDigits(currentTimeOn.month());
        lcd.print("/");
        printDigits(currentTimeOn.year());
        lcd.print(" ");


      }
      else if (!editingTime && lcd_active && (y1 == 2063)  && isMenu) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Time SET: NULL");
      }
}
