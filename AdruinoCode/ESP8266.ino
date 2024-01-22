#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <TimeLib.h>
#include <WebSocketsServer.h>

const char* ssid = "WIFI Tang2 (B)";
const char* password = "222222222b";
int LED = 16; // GPIO16 (D0)

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "asia.pool.ntp.org");

WiFiServer server(80);
WebSocketsServer webSocket = WebSocketsServer(81);

bool ledState = LOW;
unsigned long ledTimestampOn = 0;
unsigned long ledTimestampOff = 0;

void handleWebSocket() {
  webSocket.loop();
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_TEXT:
      // Handle text message received from WebSocket
      if (strcmp((char *)payload, "toggle") == 0) {
        // Toggle the LED status
        digitalWrite(LED, !ledState);
        ledState = !ledState;
        if (ledState) {
          ledTimestampOn = timeClient.getEpochTime();
        } else {
          ledTimestampOff = timeClient.getEpochTime();
        }
      }
      break;
  }
}

String getFormattedTime(unsigned long epochTime) {
  char buffer[20];
  snprintf(buffer, sizeof(buffer), "%02d:%02d:%02d",
           (hour(epochTime) + 7) % 24, minute(epochTime), second(epochTime));
  return String(buffer);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, LOW);

  Serial.print("Connecting to the Network");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("WiFi connected");
  timeClient.begin();

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
  timeClient.update();

  // Handle incoming WebSocket events
  handleWebSocket();

  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  Serial.println("Waiting for new client");
  while (!client.available()) {
    delay(1);
  }

  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();

  int value = ledState;
  if (request.indexOf("/LED=ON") != -1) {
    digitalWrite(LED, HIGH);
    value = HIGH;
    ledTimestampOn = timeClient.getEpochTime();
  }

  if (request.indexOf("/LED=OFF") != -1) {
    digitalWrite(LED, LOW);
    value = LOW;
    ledTimestampOff = timeClient.getEpochTime();
  }

  //*------------------HTML Page Code---------------------*//
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println("Access-Control-Allow-Origin: *");
  client.println("");
  client.println("<!DOCTYPE HTML>");
  client.println("<html>");

  client.print(" CONTROL LED: ");
  if (value == HIGH) {
    client.print("ON");
  } else {
    client.print("OFF");
  }

  client.println("<br><br>");
  client.print("Time ON: ");
  client.println(ledTimestampOn > 0 ? getFormattedTime(ledTimestampOn) : "N/A");

  client.println("<br><br>");
  client.print("Time OFF: ");
  client.println(ledTimestampOff > 0 ? getFormattedTime(ledTimestampOff) : "N/A");

  client.println("<br><br>");
  client.println("<a href=\"/LED=ON\"\"><button>ON</button></a>");
  client.println("<a href=\"/LED=OFF\"\"><button>OFF</button></a><br />");
  client.println("</html>");

  delay(1);
  Serial.println("Client disconnected");
  Serial.println("");
}
