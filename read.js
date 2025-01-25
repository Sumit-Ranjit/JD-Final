// Function to read and display data from IndexedDB
function readData() {
    // Open the database
    const request = indexedDB.open("BookingDatabase", 1);
  
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("Bookings", "readonly");
      const store = transaction.objectStore("Bookings");
  
      // Open a cursor to find the first entry with Status = "Not Done"
      const cursorRequest = store.openCursor();
      cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
  
        if (cursor) {
          const record = cursor.value;
          if (record.Status === "Not Done") {
            const mobileNumber = record.Mobile_Number;
            const email = record.Email;
            const name = record.Name;
  
            console.log("First Matching Record:", record);
  
            // Fetch all entries with the same Mobile_Number
            fetchAllEntries(store, mobileNumber, email, name);
            return; // Exit once the first "Not Done" is found
          }
          cursor.continue();
        } else {
          console.log("No records found with Status = 'Not Done'");
        }
      };
  
      cursorRequest.onerror = (event) => {
        console.error("Error searching for 'Not Done' records:", event.target.error);
      };
    };
  
    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  }
  
  // Function to fetch all entries for the given Mobile_Number
  function fetchAllEntries(store, mobileNumber, email, name) {
    const indexRequest = store.index("Mobile_Number").getAll(mobileNumber);
  
    indexRequest.onsuccess = (event) => {
      const matchingEntries = event.target.result;
  
      if (matchingEntries.length > 0) {
        console.log("All Matching Records:", matchingEntries);
        createTable(matchingEntries, email, name);
      } else {
        console.log("No additional entries found for Mobile_Number:", mobileNumber);
      }
    };
  
    indexRequest.onerror = (event) => {
      console.error("Error fetching entries by Mobile_Number:", event.target.error);
    };
  }
  
  // Function to create a table and populate it with data
  function createTable(data, email, name) {
    // Reference to the body or container to append the table
    const container = document.getElementById("data-container");
  
    if (!container) {
      console.error("Container with id 'data-container' not found.");
      return;
    }
  
    // Create table
    const table = document.createElement("table");
    table.border = "1";
    table.style.width = "100%";
    table.style.textAlign = "left";
  
    // Add table header
    const headerRow = document.createElement("tr");
    const headers = [
      "Sr_No",
      "Time_of_Entry",
      "Hotel",
      "Area",
      "City",
      "State",
      "Requirement_Mentioned",
      "Search_Time",
    ];
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
  
    // Add table rows
    data.forEach((record) => {
      const row = document.createElement("tr");
      headers.forEach((key) => {
        const td = document.createElement("td");
        td.textContent = record[key] || "N/A"; // Fallback to 'N/A' if key is missing
        row.appendChild(td);
      });
      table.appendChild(row);
    });
  
    // Clear existing content and append table
    container.innerHTML = `<h3>Matching Records for ${name} (${email}):</h3>`;
    container.appendChild(table);
  }
  
  // Call the function on page load
  document.addEventListener("DOMContentLoaded", readData);
  