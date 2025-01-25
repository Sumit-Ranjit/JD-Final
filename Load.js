const dbName = "BookingDatabase";
    const storeName = "Bookings";
    const dataUrl = "Data.json"; // Path to your Data.json file
// Data to load into the IndexedDB
const data = [
  {
    "@odata.etag": "",
    "ItemInternalId": "",
    "Sr_No": "803",
    "Time_of_Entry": "45676.8351851852",
    "Mobile_Number": "8891918467",
    "Name": "Sherief",
    "Email": "example@domain.com",
    "Area": "Koyambedu",
    "Hotel": "Super Townhouse Koyambedu Formerly Royal Plaza (Koyambedu, Chennai)",
    "City": "Chennai",
    "State": "Tamil Nadu",
    "Requirement_Mentioned": "Super Townhouse Koyambedu Formerly Royal Plaza.",
    "Search_Time": "2025-01-19 20:02:05",
    "Call_Back_Time": "",
    "Call_Back_Agent": "",
    "Call Connected": "",
    "Intent of call": "",
    "Remarks if Others": "",
    "Booking ID": "",
    "checkin_Date": "",
    "Checkout_date": "",
    "No_Of_Rooms": "",
    "Booking Created or not": "",
    "Reason_of_Not_Booking": "",
    "Prepay_Pitched": "",
    "Prepay collected": "",
    "Reason_of_non_prepay": "",
    "Agent Remarks": "",
    "Status": "Not Done",
    "__PowerAppsId__": "",
    "Date": "45676",
  },
  // Add more records as needed
];

// Function to initialize and populate the IndexedDB
function loadDatabase() {
  const request = indexedDB.open(dbName, 1);

  // Handle database upgrade or creation
  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create object store if it doesn't exist
    if (!db.objectStoreNames.contains(storeName)) {
      const store =db.createObjectStore(storeName, { keyPath: "Mobile_Number" });
      console.log(`Object store '${storeName}' created.`);
  

      // Create indexes for faster querying
      store.createIndex("Mobile_Number", "Mobile_Number", { unique: true });
      store.createIndex("Status", "Status", { unique: false });
    }
  };

  // Handle database opening success
  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    // Add data to the database
    data.forEach((record) => {
      store.put(record); // Use put to avoid duplication
    });

    transaction.oncomplete = () => {
      console.log("Database populated successfully.");
    };

    transaction.onerror = (event) => {
      console.error("Error populating database:", event.target.error);
    };
  };

  // Handle database errors
  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };
}

// Call the function to load the database
document.addEventListener("DOMContentLoaded", loadDatabase);
