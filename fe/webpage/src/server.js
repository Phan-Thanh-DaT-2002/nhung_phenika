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
app.get("/log-act", (req, res) => {
  const { deviceCode, fromDate, toDate, currentPage = 0, perPage = 10 } = req.query;

  // Load data from JSON file
  const dataFilePath = path.join(__dirname, "data.json");
  const jsonData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

  let filteredData = jsonData.content.items;

  // Filter data by deviceCode if provided
  if (deviceCode) {
    filteredData = filteredData.filter(item => item.deviceCode === deviceCode);
  }

  // Filter data by fromDate and toDate if provided
  if (fromDate && toDate) {
    filteredData = filteredData.filter(item => {
      const itemDate = new Date(item.time);
      return itemDate >= new Date(fromDate) && itemDate <= new Date(toDate);
    });
  }

  // Paginate data
  const startIndex = currentPage * perPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + perPage);

  res.json(paginatedData);
});


// Route POST to add a new command to the data.json file
app.post("/log-act", (req, res) => {
  const { deviceCode, deviceName, actionStatus, actionLog, time, title } = req.body;

  // Check if required fields are present in the request body
  if (deviceCode && deviceName && actionStatus !== undefined && actionLog && time && title) {
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
      title
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

// Route PATCH to update actionStatus for multiple items based on provided IDs
app.patch('/log-act/update/:id', (req, res) => {
  const { id } = req.params; // Get the ID of the alarm to update
  const { actionStatus, time, title } = req.body; // Get updated fields from request body

  // Find the alarm with the given ID in your data (replace this with your actual data retrieval logic)
  const alarmToUpdate = alarms.find(alarm => alarm.id === id);

  // If the alarm is not found, return a 404 Not Found response
  if (!alarmToUpdate) {
    return res.status(404).json({ error: 'Alarm not found' });
  }

  // Update the alarm's fields with the new values
  if (actionStatus !== undefined) {
    alarmToUpdate.actionStatus = actionStatus;
  }
  if (time !== undefined) {
    alarmToUpdate.time = time;
  }
  if (title !== undefined) {
    alarmToUpdate.title = title;
  }

  // Return a success response with the updated alarm
  return res.status(200).json({ message: 'Alarm updated successfully', alarm: alarmToUpdate });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
