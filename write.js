const wdbName = "BookingDatabase";
const wstoreName = "Bookings";

// Function to write form data to IndexedDB
function writeFormDataToDB(formData) {
  const request = indexedDB.open(wdbName);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(wstoreName, "readwrite");
    const store = transaction.objectStore(wstoreName);

    // Add or update record in IndexedDB
    const putRequest = store.put(formData);

    putRequest.onsuccess = () => {
      console.log("Form data successfully written to the database.");
      location.reload();
    };

    putRequest.onerror = (event) => {
      console.error("Error writing form data to the database:", event.target.error);
    };

    transaction.oncomplete = () => {
      console.log("Transaction completed successfully.");
    };

    transaction.onerror = (event) => {
      console.error("Transaction error:", event.target.error);
    };
  };

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };
}

// Handle form submission
document.getElementById("user-input-form").addEventListener("submit-btn"", (event) => {
  event.preventDefault(); // Prevent default form submission

  const formData = {
    Mobile_Number: document.getElementById("mobileNumber").textContent.trim(), // From the display section
    Name: document.getElementById("name").textContent.trim(),
    Email: document.getElementById("email").textContent.trim(),
    Call_Connected: document.getElementById("call-connected").value,
    Intent_Of_Call: document.getElementById("intent-of-call").value,
    Remarks_If_Others: document.getElementById("remarks-if-others").value,
    Booking_ID: document.getElementById("booking-id").value,
    Check_In_Date: document.getElementById("check-in-date").value,
    Check_Out_Date: document.getElementById("check-out-date").value,
    Number_Of_Rooms: document.getElementById("number-of-rooms").value,
    Booking_Created: document.getElementById("booking-created").value,
    Reason_Not_Created: document.getElementById("reason-not-created").value,
    Prepay_Pitched: document.getElementById("prepay-pitched").value,
    Prepay_Collected: document.getElementById("prepay-collected").value,
    Reason_Non_Prepay: document.getElementById("reason-non-prepay").value,
    Agent_Remarks: document.getElementById("agent-remarks").value,
    Status: "Done", // Update the status to 'Done' after submission
  };

  console.log("Form Data to be written:", formData);

  // Write the form data to IndexedDB
  writeFormDataToDB(formData);

  // Clear the form after submission
  document.getElementById("user-input-form").reset();
});
