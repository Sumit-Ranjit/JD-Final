const dbName = "BookingDatabase";
const storeName = "Bookings";
const dataUrl = "Data.json"; // Update with your actual GitHub raw URL

// Function to initialize and populate the IndexedDB
async function loadDatabase() {
  const request = indexedDB.open(dbName, 1);

  // Handle database upgrade or creation
  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create object store if it doesn't exist
    if (!db.objectStoreNames.contains(storeName)) {
      const store = db.createObjectStore(storeName, { keyPath: "Mobile_Number" });
      console.log(`Object store '${storeName}' created.`);

      // Create indexes for faster querying
      store.createIndex("Mobile_Number", "Mobile_Number", { unique: true });
      store.createIndex("Status", "Status", { unique: false });
    }
  };

  // Handle database opening success
  request.onsuccess = async (event) => {
    const db = event.target.result;

    // Fetch data from the JSON file
    try {
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data fetched:", data); // Log the fetched data

      // Check if data is an array
      if (!Array.isArray(data)) {
        console.error("Data is not an array.");
        return;
      }

      // Process and insert records using a new transaction for each record
      for (const [index, record] of data.entries()) {
        console.log(`Inserting record ${index + 1}:`, record);

        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        const putRequest = store.put(record);

        putRequest.onsuccess = () => {
          console.log(`Record ${index + 1} inserted successfully.`);
        };

        putRequest.onerror = (event) => {
          console.error(`Error inserting record ${index + 1}:`, event.target.error);
        };

        // Wait for the transaction to complete before starting the next one
        await new Promise((resolve, reject) => {
          transaction.oncomplete = resolve;
          transaction.onerror = (event) => reject(event.target.error);
        });
      }

      console.log("All records inserted successfully.");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle database opening failure
  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };
}

// Call the function to load the database
loadDatabase();
