document.addEventListener("DOMContentLoaded", function () {
    // Retrieve existing registrations from localStorage
    const registrations = JSON.parse(localStorage.getItem("registrations")) || [];

    // Filter users who have chosen to borrow
    const borrowers = registrations.filter((user) => user.lendBorrow === "borrow");

    // Get the borrowers list container
    const borrowersList = document.getElementById("borrowers-list");

    if (borrowers.length > 0) {
        // Display each borrower's information
        borrowers.forEach((borrower) => {
            const borrowerCard = document.createElement("div");
            borrowerCard.classList.add("borrower-card");
            borrowerCard.innerHTML = `
                <h3>${borrower.shgName}</h3>
                <p><strong>Leader’s Name:</strong> ${borrower.leaderName}</p>
                <p><strong>Contact Number:</strong> ${borrower.contactNumber}</p>
                <p><strong>Email:</strong> ${borrower.email}</p>
                <p><strong>Business Type:</strong> ${borrower.businessType}</p>
                <p><strong>Amount:</strong> ₹${borrower.amount}</p>
            `;
            borrowersList.appendChild(borrowerCard);
        });
    } else {
        // Display a message if no borrowers are found
        borrowersList.innerHTML = "<p>No borrowers found.</p>";
    }
});