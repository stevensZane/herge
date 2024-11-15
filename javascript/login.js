// Function to handle login
function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Load users from the JSON file (hardcoded for this example)
    const users = [
        { "username": "manager", "password": "manager123", "role": "manager" },
        { "username": "admin", "password": "admin123", "role": "admin" }
    ];

    // Check if the user exists
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Store the logged-in user's info in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        // Redirect based on role
        if (user.role === "manager") {
            window.location.href = "../Pages/manager_dashboard.html";  // Redirect to manager dashboard
        } else if (user.role === "admin") {
            window.location.href = "../Pages/admin_dashboard.html";  // Redirect to admin dashboard
        }
    } else {
        alert("Invalid username or password");
    }
}




