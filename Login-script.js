document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    // Fetch credentials from the JSON file
    try {
      const response = await fetch("Credentials.json");
      const credentials = await response.json();
  
      // Check if username and password match
      if (credentials.username === username && credentials.password === password) {
        document.getElementById("message").textContent = "Login successful!";
        document.getElementById("message").style.color = "green";
      } else {
        document.getElementById("message").textContent = "Invalid username or password.";
      }
    } catch (error) {
      console.error("Error fetching credentials:", error);
      document.getElementById("message").textContent = "An error occurred. Please try again later.";
    }
  });
  