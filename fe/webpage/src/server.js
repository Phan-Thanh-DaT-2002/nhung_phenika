const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 8388;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Function to write data to the data.json file
const writeDataToFile = (data) => {
  const dataFilePath = path.join(__dirname, "data.json");
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
};

// Route GET to fetch data from the data.json file
app.get("/data", (req, res) => {
  const dataFilePath = path.join(__dirname, "data.json");
  const jsonData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  res.json(jsonData);
});

// Route POST to add a new command to the data.json file
app.post("/add-command", (req, res) => {
  const { deviceCode, deviceName, actionStatus, actionLog, time } = req.body;

  // Check if required fields are present in the request body
  if (deviceCode && deviceName && actionStatus !== undefined && actionLog && time) {
    // Read existing data from the data.json file
    const dataFilePath = path.join(__dirname, "data.json");
    const jsonData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

    // Create a new command object
    const newCommand = {
      id: jsonData.content.total + 1, // Generate a new unique ID
      deviceCode,
      deviceName,
      actionStatus,
      actionLog,
      time,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    // Add the new command to the items array
    jsonData.content.items.unshift(newCommand);
    jsonData.content.total++;

    // Write the updated data back to the data.json file
    writeDataToFile(jsonData);

    res.json({ success: true, message: "Command added successfully." });
  } else {
    res.status(400).json({ error: "Invalid request body. Missing required fields." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
