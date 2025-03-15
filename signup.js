document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("shg-form");

    // Initialize the map
    let map;
    let marker;

    const mapContainer = document.getElementById("map");
    if (mapContainer) {
        map = L.map("map").setView([20.5937, 78.9629], 5); // Default view for India
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);
        window.map = map; // Store the map in the global scope
    } else {
        console.error("Map container not found!");
    }

    // Automatically fetch and store current location using Geolocation API
    function fetchCurrentLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Update hidden latitude and longitude fields
                    document.getElementById("latitude").textContent = lat;
                    document.getElementById("longitude").textContent = lon;

                    // Store location in localStorage
                    localStorage.setItem("latitude", lat);
                    localStorage.setItem("longitude", lon);

                    // Update the map view and marker
                    if (map) {
                        map.setView([lat, lon], 10); // Zoom to the user's location
                        if (marker) {
                            marker.setLatLng([lat, lon]); // Update existing marker
                        } else {
                            marker = L.marker([lat, lon]).addTo(map); // Add new marker
                        }
                    }
                },
                function (error) {
                    console.error("Geolocation error:", error);
                    alert("Unable to fetch your current location. Please enable location services.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    // Call the function on page load
    fetchCurrentLocation();

    // Handle form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect form data
        const registration = {
            shgName: document.getElementById("shg-name").value.trim(),
            leaderName: document.getElementById("leader-name").value.trim(),
            contactNumber: document.getElementById("contact-number").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value,
            confirmPassword: document.getElementById("confirm-password").value,
            businessType: document.getElementById("business-type").value,
            membersCount: document.getElementById("members-count").value,
            latitude: localStorage.getItem("latitude") || "",
            longitude: localStorage.getItem("longitude") || "",
            lendBorrow: "None", 
            amount: -1,
            applicants: [],
            selectedapplicants: [],
        };

        // Validate password constraints
        if (registration.password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }
        if (!/\d/.test(registration.password)) {
            alert("Password must contain at least one number.");
            return;
        }
        if (registration.password !== registration.confirmPassword) {
            alert("Password and Confirm Password do not match.");
            return;
        }

        // Ensure location is available
        // if (!registration.latitude || !registration.longitude) {
        //     alert("Current location not available. Please check your location settings.");
        //     return;
        // }

        // Retrieve existing registrations frolo localStorage (or start with an empty array)
        let registrations = JSON.parse(localStorage.getItem("registrations")) || [];

        // Generate a unique registration ID
        registration.registrationId = "REG-" + Math.floor(Math.random() * 1000000);

        // Add new registration to the array
        registrations.push(registration);

        // Save updated registrations array to localStorage
        localStorage.setItem("registrations", JSON.stringify(registrations));

        // Print the stored registrations in the console for verification
        console.log("Stored Registrations:", registrations);

        alert("Registration successful!");

        // Optionally clear the form
        form.reset();
    });

    // Optionally prefill the form if saved data exists (for editing/resuming, if needed)
    const savedData = localStorage.getItem("shgData");
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById("shg-name").value = data.shgName;
        document.getElementById("leader-name").value = data.leaderName;
        document.getElementById("contact-number").value = data.contactNumber;
        document.getElementById("email").value = data.email;
        document.getElementById("password").value = data.password;
        document.getElementById("confirm-password").value = data.confirmPassword;
        document.getElementById("business-type").value = data.businessType;
        document.getElementById("members-count").value = data.membersCount;
    }
});