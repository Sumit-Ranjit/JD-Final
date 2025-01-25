const dbName = "BookingDatabase";
const storeName = "Bookings";

// Function to fetch the first "Not Done" record and related data
async function fetchAndDisplayData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const statusIndex = store.index("Status");

      // Fetch the first record with Status = "Not Done"
      const cursorRequest = statusIndex.openCursor("Not Done");

      cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const firstRecord = cursor.value;
          const { Mobile_Number, Name, Email } = firstRecord;

          // Update placeholders for Mobile_Number, Name, and Email
          document.getElementById("mobileNumber").textContent = Mobile_Number;
          document.getElementById("name").textContent = Name;
          document.getElementById("email").textContent = Email;

          // Fetch all records with the same Mobile_Number
          fetchRecordsByMobileNumber(db, Mobile_Number)
            .then((matchingRecords) => {
              populateTable(matchingRecords);
              resolve();
            })
            .catch((error) => {
              console.error("Error fetching related records:", error);
              reject(error);
            });
        } else {
          console.error("No record found with Status 'Not Done'.");
          reject("No record found with Status 'Not Done'.");
        }
      };

      cursorRequest.onerror = (event) => {
        console.error("Error fetching record by status:", event.target.error);
        reject(event.target.error);
      };
    };

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
      reject(event.target.error);
    };
  });
}

// Function to fetch records by Mobile_Number
function fetchRecordsByMobileNumber(db, mobileNumber) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const mobileIndex = store.index("Mobile_Number");
    const records = [];

    const cursorRequest = mobileIndex.openCursor(mobileNumber);

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        records.push(cursor.value);
        cursor.continue();
      } else {
        // All records fetched
        resolve(records);
      }
    };

    cursorRequest.onerror = (event) => {
      console.error("Error fetching records by mobile number:", event.target.error);
      reject(event.target.error);
    };
  });
}

// Function to populate the table with records
function populateTable(records) {
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  if (records.length > 0) {
    records.forEach((record, index) => {
      const {
        Hotel = "",
        Area = "",
        City = "",
        State = "",
        Requirement_Mentioned = "",
        Search_Time = "",
      } = record;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${Hotel}</td>
        <td>${Area}</td>
        <td>${City}</td>
        <td>${State}</td>
        <td>${Requirement_Mentioned}</td>
        <td>${Search_Time}</td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `<td colspan="7" style="text-align: center;">No matching records found.</td>`;
    tableBody.appendChild(emptyRow);
  }
}

// Fetch and display data on page load
fetchAndDisplayData()
  .then(() => {
    console.log("Data displayed successfully.");
  })
  .catch((error) => {
    console.error("Error displaying data:", error);
  });
