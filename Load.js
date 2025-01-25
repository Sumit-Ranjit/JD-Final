const dbName = "BookingDatabase";
const storeName = "Bookings";
const dataUrl = "Data.json"; // Update with your actual GitHub raw URL

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    // Handle database upgrade or creation
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: "Mobile_Number" });
        store.createIndex("Mobile_Number", "Mobile_Number", { unique: true });
        store.createIndex("Status", "Status", { unique: false });
        console.log(`Object store '${storeName}' created.`);
      }
    };

    request.onsuccess = async (event) => {
      const db = event.target.result;

      // Fetch and load data
      try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error("Data is not an array.");
          return reject("Data is not an array.");
        }

        // Insert data into the database
        for (const [index, record] of data.entries()) {
          const transaction = db.transaction(storeName, "readwrite");
          const store = transaction.objectStore(storeName);

          const putRequest = store.put(record);

          await new Promise((resolveTransaction, rejectTransaction) => {
            putRequest.onsuccess = () => resolveTransaction();
            putRequest.onerror = (event) => rejectTransaction(event.target.error);
          });
        }

        console.log("All records inserted successfully.");
        resolve();
      } catch (error) {
        console.error("Error fetching or inserting data:", error);
        reject(error);
      }
    };

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
      reject(event.target.error);
    };
  });
}

// Load database and redirect
(async function () {
  try {
    await initializeDatabase();
    console.log("Database initialized. Redirecting...");
    window.location.href = "calling.html"; // Redirect after database operations complete
  } catch (error) {
    console.error("Error initializing database:", error);
    // Optional: Handle redirection on error if needed
    // window.location.href = "error.html";
  }
})();
