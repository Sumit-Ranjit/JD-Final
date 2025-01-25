const dbName = "BookingDatabase";
const storeName = "Bookings";

// Function to fetch records with Status = 'Done'
function fetchDoneRecords() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const index = store.index("Status");

      const records = [];
      const query = index.openCursor("Done"); // Query for 'Done' status

      query.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          records.push(cursor.value);
          cursor.continue();
        } else {
          resolve(records); // Resolve with all fetched records
        }
      };

      query.onerror = (event) => {
        console.error("Error fetching records:", event.target.error);
        reject(event.target.error);
      };
    };

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
      reject(event.target.error);
    };
  });
}

// Function to send data to Power Automate
function sendToPowerAutomate(data) {
  const powerAutomateUrl = "https://prod-03.centralindia.logic.azure.com:443/workflows/4855239eef9346f185b1792b259dfb23/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0Bf_RNJxBoxkD2U4XLFQ9OXA6n3DgZKHbZiG5hcuVFo"; // Replace with your endpoint

  fetch(powerAutomateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Data successfully sent to Power Automate.");
      } else {
        console.error("Error sending data to Power Automate:", response.status, response.statusText);
      }
    })
    .catch((error) => {
      console.error("Network error sending data to Power Automate:", error);
    });
}

// Main function to fetch records and send to Power Automate
async function extractAndSend() {
  try {
    const doneRecords = await fetchDoneRecords();
    console.log("Fetched records with Status 'Done':", doneRecords);

    if (doneRecords.length > 0) {
      sendToPowerAutomate(doneRecords);
    } else {
      console.log("No records with Status 'Done' found.");
    }
  } catch (error) {
    console.error("Error during extraction and sending process:", error);
  }
}

// Call the main function
extractAndSend();
