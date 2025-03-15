document.addEventListener("DOMContentLoaded", function () {
    // Retrieve existing registrations from localStorage
    const registrations = JSON.parse(localStorage.getItem("registrations")) || [];

    // Filter users who have chosen to lend
    const lenders = registrations.filter((user) => user.lendBorrow === "lend");

    // Get the lenders list container
    const lendersList = document.getElementById("lenders-list");

    // Get the logged-in user's contact number
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const loggedInUserContactNumber = loggedInUser ? loggedInUser : null;

    if (lenders.length > 0) {
        // Display each lender's information
        lenders.forEach((lender, index) => {
            const lenderCard = document.createElement("div");
            lenderCard.classList.add("lender-card");
            lenderCard.innerHTML = `
                <h3>${lender.shgName}</h3>
                <p><strong>Leader’s Name:</strong> ${lender.leaderName}</p>
                <p><strong>Contact Number:</strong> ${lender.contactNumber}</p>
                <p><strong>Email:</strong> ${lender.email}</p>
                <p><strong>Business Type:</strong> ${lender.businessType}</p>
                <p><strong>Amount:</strong> ₹${lender.amount}</p>
                <button class="apply-button">Apply</button>
            `;
            lendersList.appendChild(lenderCard);

            // Add event listener to the Apply button
            const applyButton = lenderCard.querySelector(".apply-button");
            applyButton.addEventListener("click", () => {
                if (!loggedInUserContactNumber) {
                    alert("You must be logged in to apply.");
                    return;
                }

                // Check if the user has already applied
                if (lender.applicants.includes(loggedInUserContactNumber)) {
                    alert("You have already applied to this lender.");
                    return;
                }

                // Add the logged-in user's contact number to the lender's applicants list
                lender.applicants.push(loggedInUserContactNumber);

                // Update the registrations in localStorage
                const updatedRegistrations = registrations.map((reg) =>
                    reg.registrationId === lender.registrationId ? lender : reg
                );
                localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));

                alert(`Applied to ${lender.shgName}. Your contact number has been recorded.`);
            });
        });
    } else {
        // Display a message if no lenders are found
        lendersList.innerHTML = "<p>No lenders found.</p>";
    }
});