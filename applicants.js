document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the logged-in user's contact number
    const loggedInUserContactNumber = localStorage.getItem("loggedInUser");
    if (!loggedInUserContactNumber) {
        alert("You must be logged in to view applicants.");
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

    // Get the applicants list from the logged-in user's object
    const applicantsList = loggedInUser.applicants;

    // Get the applicants list container
    const applicantsListContainer = document.getElementById("applicants-list");

    console.log("Logged in user's applicants:", loggedInUser.applicants); // Debug
    console.log("All registrations:", registrations); // Debug

    if (loggedInUser.applicants && loggedInUser.applicants.length > 0) {
        // Display each applicant's information
        loggedInUser.applicants.forEach((applicantContactNumber, index) => {
            console.log("Looking for applicant with contact:", applicantContactNumber); // Debug
            
            // Find the applicant's complete object using their contact number
            const applicant = registrations.find(reg => {
                const regContactNumber = reg.contactNumber.toString().trim();
                const contactNum = applicantContactNumber.toString().trim();    
                console.log("Checking registration:", regContactNumber); // Debug
                console.log("Data types - Applicant:", typeof applicantContactNumber, "Registration:", typeof regContactNumber); // Debug
                const result = regContactNumber === contactNum;
                console.log("Result:", result); // Debug
                return result;
            });
            
            console.log("Found applicant:", applicant); // Debug

            if (applicant) {
                const applicantCard = document.createElement("div");
                applicantCard.classList.add("applicant-card");
                applicantCard.innerHTML = `
                    <h3>${applicant.shgName}</h3>
                    <p><strong>Leader’s Name:</strong> ${applicant.leaderName}</p>
                    <p><strong>Contact Number:</strong> ${applicant.contactNumber}</p>
                    <p><strong>Email:</strong> ${applicant.email}</p>
                    <p><strong>Business Type:</strong> ${applicant.businessType}</p>
                    <div class="action-buttons">
                        <button class="accept-button">Accept</button>
                        <button class="reject-button">Reject</button>
                    </div>
                `;
                applicantsListContainer.appendChild(applicantCard);

                // Add event listeners to the Accept and Reject buttons
                const acceptButton = applicantCard.querySelector(".accept-button");
                const rejectButton = applicantCard.querySelector(".reject-button");

                acceptButton.addEventListener("click", () => {
                    handleApplicantAction(index, "accept", applicantContactNumber);
                });

                rejectButton.addEventListener("click", () => {
                    handleApplicantAction(index, "reject");
                });
            } else {
                console.warn(`No matching registration found for contact number: ${applicantContactNumber}`);
            }
        });
    } else {
        applicantsListContainer.innerHTML = "<p>No applicants found.</p>";
        console.log("No applicants in the list"); // Debug
    }

    // Function to handle Accept/Reject actions
    function handleApplicantAction(index, action, applicantContactNumber) {
        // Remove the applicant from the logged-in user's applicants list
        loggedInUser.applicants.splice(index, 1);

        // If the action is "accept", add the applicant to the selectedapplicants list
        if (action === "accept") {
            loggedInUser.selectedapplicants.push(applicantContactNumber);
        }

        // Update the registrations in localStorage
        const updatedRegistrations = registrations.map((reg) =>
            reg.registrationId === loggedInUser.registrationId ? loggedInUser : reg
        );
        localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));

        // Reload the page to reflect the changes
        window.location.reload();
    }
});