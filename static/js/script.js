document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const micBtn = document.getElementById("mic-btn");

    // Function to add a message to the chat box
    function addMessage(message, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.innerHTML = `<p>${message}</p>`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }

    // Function to send user input to the backend
    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, "user");
        userInput.value = "";
        userInput.disabled = true;
        sendBtn.disabled = true;
        micBtn.disabled = true;

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            addMessage(data.response, "bot");
        } catch (error) {
            console.error("Error:", error);
            addMessage("Sorry, something went wrong. Please try again.", "bot");
        } finally {
            userInput.disabled = false;
            sendBtn.disabled = false;
            micBtn.disabled = false;
            userInput.focus();
        }
    }

    // Event listener for the send button
    sendBtn.addEventListener("click", sendMessage);

    // Event listener for the Enter key
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // Event listener for the microphone button
    micBtn.addEventListener("click", async function () {
        try {
            const response = await fetch("http://localhost:5000/mic", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.transcription) {
                addMessage(data.transcription, "user");
                userInput.value = data.transcription;
                // Automatically send the transcribed message
                sendMessage();
            }
        } catch (error) {
            console.error("Error:", error);
            addMessage("Sorry, there was an error with the microphone.", "bot");
        }
    });
});