

    // Check if the user is authorized
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("You must log in to access this page.");
      location.href = "index.html"; // Redirect to login page
    }

    // Display logged-in user info
    //const userInfo = document.createElement("p");
    //userInfo.textContent = `Logged in as: ${currentUser.User_Name} (${currentUser.Role})`;
    //document.body.appendChild(userInfo);

    // Logout functionality
    //document.getElementById("logout").addEventListener("click", () => {
    //  localStorage.removeItem("currentUser");
    //  alert("You have been logged out.");
    //  location.href = "index.html"; // Redirect to login page
    //});
  