document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    // Handle form submission
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect form data
        const loginData = {
            phone: document.getElementById("phone").value.trim(),
            password: document.getElementById("password").value,
        };

        // Retrieve existing registrations from localStorage
        const registrations = JSON.parse(localStorage.getItem("registrations")) || [];

        // Find the user with the provided phone number
        const user = registrations.find((user) => user.contactNumber === loginData.phone);

        if (user) {
            // Check if the password matches
            if (user.password === loginData.password) {
                // Save the logged-in user's contact number in localStorage
                localStorage.setItem("loggedInUser", loginData.phone);

                alert("Login successful!");
                // Redirect to the dashboard or home page
                window.location.href = "mainPage2.html"; // Replace with your desired page
            } else {
                alert("Incorrect password. Please try again.");
            }
        } else {
            alert("User not found. Please register.");
        }
    });
});