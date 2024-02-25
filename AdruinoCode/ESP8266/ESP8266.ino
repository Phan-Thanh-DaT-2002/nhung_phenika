#include <ESP8266WiFi.h>
#include <WebSocketsServer.h> // Include the WebSocketsServer header
#include <ArduinoJson.h>

const char* ssid = "PBC"; //PBC - Datto
const char* password = "12345678@"; //12345678@ - 88888888
WiFiServer server(80);
WebSocketsServer webSocket = WebSocketsServer(81);

void setup() {
  Serial.begin(115200);

  Serial.print("Connecting to the Network");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("WiFi connected");
  // timeClient.begin(); // This line seems to be unnecessary and causing errors. If you don't need it, remove it.

  server.begin();
  Serial.println("Server started");

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  Serial.print("IP Address of network: ");
  Serial.println(WiFi.localIP());

  Serial.print("Copy and paste the following URL: https://");
  Serial.print(WiFi.localIP());
  Serial.println("/");
}

void loop() {
  webSocket.loop();
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_TEXT:
      // Parse JSON message received from WebSocket server
      StaticJsonDocument<200> doc;
      deserializeJson(doc, payload, length);
      
      // Check if message contains LED status
      if (doc.containsKey("ledStatus")) {
        bool ledStatus = doc["ledStatus"];
        // Send LED status to Arduino via UART
        Serial.print("LED:");
        Serial.println(ledStatus ? "ON" : "OFF");
      }

      // Check if message contains Servo status
      if (doc.containsKey("servoStatus")) {
        bool servoStatus = doc["servoStatus"];
        // Send Servo status to Arduino via UART
        Serial.print("Servo:");
        Serial.println(servoStatus ? "ON" : "OFF");
      }

      // Check if message contains Alarm status
      if (doc.containsKey("alarmStatus")) {
        bool alarmStatus = doc["alarmStatus"];
        // Send Alarm status to Arduino via UART
        Serial.print("Alarm:");
        Serial.println(alarmStatus ? "ON" : "OFF");
      }
      break;
  }
}

