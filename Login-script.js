document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("User_Name").value;
  const password = document.getElementById("Password").value;

  try {
    // Fetch credentials from Credentials.json
    const response = await fetch("Credentials.json");
    const credentials = await response.json();

    // Find a user with matching credentials
    const user = credentials.find(
      (u) => u.User_Name === username && u.Password === password
    );

    if (user) {
      // Save login information to localStorage
      const loginInfo = {
        User_Name: user.User_Name,
        Role: user.Role,
        LoginTime: new Date().toLocaleString(),
      };

      // Retrieve existing logs or initialize an empty array
      const savedLogins = JSON.parse(localStorage.getItem("loginLogs")) || [];
      savedLogins.push(loginInfo);
      localStorage.setItem("loginLogs", JSON.stringify(savedLogins));

      // Display success message
      document.getElementById("message").textContent = `Login successful! Role: ${user.Role}`;
      document.getElementById("message").style.color = "green";
    } else {
      // Display error message for invalid credentials
      document.getElementById("message").textContent = "Invalid username or password.";
      document.getElementById("message").style.color = "red";
    }
  } catch (error) {
    console.error("Error fetching credentials:", error);
    document.getElementById("message").textContent = "An error occurred. Please try again later.";
    document.getElementById("message").style.color = "red";
  }
});

// Event listener to view saved login logs
document.getElementById("viewLogins").addEventListener("click", function () {
  const savedLogins = JSON.parse(localStorage.getItem("loginLogs")) || [];
  const logsDiv = document.getElementById("logs");

  if (savedLogins.length === 0) {
    logsDiv.textContent = "No login logs available.";
  } else {
    logsDiv.innerHTML = "<h3>Login Logs:</h3>";
    savedLogins.forEach((log) => {
      const logEntry = document.createElement("p");
      logEntry.textContent = `User: ${log.User_Name}, Role: ${log.Role}, Time: ${log.LoginTime}`;
      logsDiv.appendChild(logEntry);
    });
  }
});
// Global variable to track the timeout
let inactivityTimeout;

// Function to reset inactivity timer
function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(logoutUser, 30 * 60 * 1000); // 30 minutes in milliseconds
}

// Function to log out the user
function logoutUser() {
  alert("You have been logged out due to inactivity.");
  localStorage.removeItem("currentUser"); // Clear the current session
  window.location.reload(); // Reload the page to redirect to the login screen
}

// Listen for user activity to reset the timer
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);

// Save current user in localStorage on successful login
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("Credentials.json");
    const credentials = await response.json();

    const user = credentials.find(
      (u) => u.User_Name === username && u.Password === password
    );

    if (user) {
      const currentUser = {
        User_Name: user.User_Name,
        Role: user.Role,
        LoginTime: new Date().toLocaleString(),
      };

      // Save current session
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Start inactivity timer
      resetInactivityTimer();

      document.getElementById("message").textContent = `Login successful! Role: ${user.Role}`;
      document.getElementById("message").style.color = "green";
    } else {
      document.getElementById("message").textContent = "Invalid username or password.";
      document.getElementById("message").style.color = "red";
    }
  } catch (error) {
    console.error("Error fetching credentials:", error);
    document.getElementById("message").textContent = "An error occurred. Please try again later.";
    document.getElementById("message").style.color = "red";
  }
});

// Automatically log out if no current user is found (e.g., page reload after inactivity logout)
window.addEventListener("load", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    document.getElementById("message").textContent = "Please log in to continue.";
    document.getElementById("message").style.color = "red";
  } else {
    // Start inactivity timer if user is still logged in
    resetInactivityTimer();
    document.getElementById("message").textContent = `Welcome back, ${currentUser.User_Name}! Role: ${currentUser.Role}`;
    document.getElementById("message").style.color = "green";
  }
});
