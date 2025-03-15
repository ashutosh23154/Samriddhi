document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the logged-in user's contact number
    const loggedInUserContactNumber = localStorage.getItem("loggedInUser");
    if (!loggedInUserContactNumber) {
        alert("You must be logged in to view selected applicants.");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    // Retrieve all registrations from localStorage
    const registrations = JSON.parse(localStorage.getItem("registrations")) || [];

    // Find the logged-in user's complete object
    const loggedInUser = registrations.find(
        (reg) => reg.contactNumber === loggedInUserContactNumber
    );

    if (!loggedInUser) {
        alert("Logged-in user not found in registrations.");
        return;
    }

    // Get the selected applicants list from the logged-in user's object
    const selectedApplicantsList = loggedInUser.selectedapplicants;

    // Get the selected applicants list container
    const selectedApplicantsListContainer = document.getElementById("selected-applicants-list");

    console.log("Logged in user's selected applicants:", loggedInUser.selectedapplicants); // Debug
    console.log("All registrations:", registrations); // Debug

    if (loggedInUser.selectedapplicants && loggedInUser.selectedapplicants.length > 0) {
        // Display each selected applicant's information
        loggedInUser.selectedapplicants.forEach((applicantContactNumber) => {
            console.log("Looking for selected applicant with contact:", applicantContactNumber); // Debug

            // Ensure applicantContactNumber is a string and trim whitespace
            applicantContactNumber = applicantContactNumber.toString().trim();

            // Find the selected applicant's complete object using their contact number
            const applicant = registrations.find(reg => {
                // Ensure reg.contactNumber is a string and trim whitespace
                const regContactNumber = reg.contactNumber.toString().trim();
                console.log("Checking registration:", regContactNumber); // Debug
                console.log("Data types - Applicant:", typeof applicantContactNumber, "Registration:", typeof regContactNumber); // Debug
                const result = regContactNumber === applicantContactNumber;
                console.log("Result:", result); // Debug
                return result;
            });

            console.log("Found selected applicant:", applicant); // Debug

            if (applicant) {
                const applicantCard = document.createElement("div");
                applicantCard.classList.add("applicant-card");
                applicantCard.innerHTML = `
                    <h3>${applicant.shgName}</h3>
                    <p><strong>Leader’s Name:</strong> ${applicant.leaderName}</p>
                    <p><strong>Contact Number:</strong> ${applicant.contactNumber}</p>
                    <p><strong>Email:</strong> ${applicant.email}</p>
                    <p><strong>Business Type:</strong> ${applicant.businessType}</p>
                `;
                selectedApplicantsListContainer.appendChild(applicantCard);
            } else {
                console.warn(`No matching registration found for contact number: ${applicantContactNumber}`);
            }
        });
    } else {
        selectedApplicantsListContainer.innerHTML = "<p>No selected applicants found.</p>";
        console.log("No selected applicants in the list"); // Debug
    }
});