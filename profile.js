document.addEventListener("DOMContentLoaded", function () {
    // Helper function to safely set text content - moved to top level
    const setElementText = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        } else {
            console.warn(`Element with id '${id}' not found`);
        }
    };

    // Retrieve the logged-in user's contact number
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        // Redirect to the login page if no user is logged in
        alert("Please log in to view your profile.");
        window.location.href = "login.html";
        return;
    }

    // Retrieve existing registrations from localStorage
    const registrations = JSON.parse(localStorage.getItem("registrations")) || [];

    // Find the logged-in user's data
    const user = registrations.find((user) => user.contactNumber === loggedInUser);

    if (user) {
        // Display user information
        setElementText("shg-name", user.shgName);
        setElementText("leader-name", user.leaderName);
        setElementText("contact-number", user.contactNumber);
        setElementText("email", user.email);
        setElementText("business-type", user.businessType);
        setElementText("members-count", user.membersCount);
        setElementText("lend-borrow-status", user.lendBorrow || "None");
        setElementText("lend-borrow-amount", user.amount !== -1 ? `₹${user.amount}` : "Not specified");

        // Print all relevant user information to the console
        console.log("User Profile Information:");
        console.log("SHG Name:", user.shgName);
        console.log("Leader’s Name:", user.leaderName);
        console.log("Contact Number:", user.contactNumber);
        console.log("Email:", user.email);
        console.log("Business Type:", user.businessType);
        console.log("Number of Members:", user.membersCount);
        console.log("Lend/Borrow Status:", user.lendBorrow || "None");
        console.log("Amount:", user.amount !== -1 ? `₹${user.amount}` : "Not specified");
        console.log("Latitude:", user.latitude);
        console.log("Longitude:", user.longitude);
        console.log("Registration ID:", user.registrationId);
    } else {
        alert("User data not found. Please register.");
        window.location.href = "signup.html";
    }

    // Move the form handling code here, after the DOM is loaded
    const lendBorrowForm = document.getElementById("lend-borrow-form");
    
    if (!lendBorrowForm) {
        console.error("Form element not found!");
        return;
    }

    console.log("Form element found:", lendBorrowForm);

    lendBorrowForm.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Form submitted!");

        // Get fresh data from localStorage
        const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
        const loggedInUser = localStorage.getItem("loggedInUser");
        
        // Find the user's index in the registrations array
        const userIndex = registrations.findIndex((u) => u.contactNumber === loggedInUser);
        
        if (userIndex === -1) {
            console.error("User not found in registrations");
            return;
        }

        // Collect form data
        const action = document.getElementById("lend-borrow").value;
        const amount = document.getElementById("amount").value;

        console.log("Selected action:", action);
        console.log("Entered amount:", amount);

        // Update user data in the registrations array
        registrations[userIndex].lendBorrow = action;
        registrations[userIndex].amount = amount !== "" ? parseFloat(amount) : -1;

        // Save updated registrations array to localStorage
        localStorage.setItem("registrations", JSON.stringify(registrations));

        // Update the display
        setElementText("lend-borrow-status", action);
        setElementText("lend-borrow-amount", amount !== "" ? `₹${amount}` : "Not specified");

        console.log("Updated registrations:", registrations);
        alert("Lend/Borrow information saved successfully!");

        // Optionally refresh the page to show updated data
        // window.location.reload();
    });

    // Prefill lend/borrow form if data exists
    if (user.lendBorrow) {
        document.getElementById("lend-borrow").value = user.lendBorrow;
    }
    if (user.amount !== -1) {
        document.getElementById("amount").value = user.amount;
    }
});