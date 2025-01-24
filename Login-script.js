// Global inactivity timer
let inactivityTimer;

// Function to reset the inactivity timer
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);

  // Warn the user 5 minutes before logout
  setTimeout(() => {
    if (localStorage.getItem("currentUser")) {
      alert("You will be logged out in 5 minutes due to inactivity.");
    }
  }, 25 * 60 * 1000); // 25 minutes

  // Set the logout timer
  inactivityTimer = setTimeout(logoutUser, 30 * 60 * 1000); // 30 minutes
}

// Function to log out the user
function logoutUser() {
  alert("You have been logged out due to inactivity.");
  localStorage.removeItem("currentUser"); // Remove current user session
  location.href = "index.html"; // Redirect to login page
}

// Event listener for user activity to reset inactivity timer
window.addEventListener("mousemove", resetInactivityTimer);
window.addEventListener("keypress", resetInactivityTimer);
window.addEventListener("click", resetInactivityTimer);

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    // Fetch credentials from Credentials.json
    const response = await fetch("Credentials.json");
    const credentials = await response.json();

    // Find a user with matching credentials
    const user = credentials.find(
      (u) => u.User_Name === username && u.Password === password
    );

    if (user) {
      // Save the current user in localStorage
      const loginInfo = {
        User_Name: user.User_Name,
        Role: user.Role,
        LoginTime: new Date().toLocaleString(),
      };
      localStorage.setItem("currentUser", JSON.stringify(loginInfo));

      // Save login information to logs
      const savedLogins = JSON.parse(localStorage.getItem("loginLogs")) || [];
      savedLogins.push(loginInfo);
      localStorage.setItem("loginLogs", JSON.stringify(savedLogins));

      // Display success message and redirect
      document.getElementById("message").textContent = `Login successful! Role: ${user.Role}`;
      document.getElementById("message").style.color = "green";

      resetInactivityTimer(); // Start the inactivity timer
      setTimeout(() => {
        location.href = "refresh.html"; // Redirect to refresh.html
      }, 1000);
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

// Redirect unauthorized users to the login page
function checkAuthorization() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("You must log in to access this page.");
    location.href = "index.html"; // Redirect to login page
  }
}
