  // Check if user is logged in; otherwise, redirect to login page
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("You must log in to access this page.");
    location.href = "index.html"; // Redirect to login page
  };

