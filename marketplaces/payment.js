"use strict";

// const API_KEY = "U3qGlCMSzJh4s2PZ2UHqV"; // sandbox api key
const API_KEY = "KY_eH8pluRIOs98RTUaOn"; //Live API Key
// const URL = `https://api.pay.staging.mynkwa.com/collect`; //sandbox endpoint
const URL = `https://api.pay.mynkwa.com/collect`; //live endpoint

document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Get form values
  const amount = document.getElementById("amount").value.trim() * 1;
  const phone = document.getElementById("phone").value.trim();

  // Disable button and show loading
  const payButton = document.getElementById("payButton");
  payButton.disabled = true;
  payButton.textContent = "Processing...";

  const statusDiv = document.getElementById("paymentStatus");
  statusDiv.className = "status-message loading";
  statusDiv.textContent = "Processing your payment...";

  try {
    const options = {
      method: "POST",
      headers: {
        "X-API-Key": `${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: `{"amount":${amount},"phoneNumber":"237${phone}"}`,
    };

    const response = await fetch(URL, options);

    const data = await response.json();

    if (response.ok) {
      // Payment initiation successful
      statusDiv.className = "status-message success";
      statusDiv.textContent =
        "Payment initiated successfully! Please check your phone for confirmation!!!";

      // Redirect to payment page (assuming Nkwa Pay returns a payment URL)
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } else {
      // Handle API errors
      statusDiv.className = "status-message error";
      statusDiv.textContent =
        data.message || "Payment failed. Please try again.";
      payButton.disabled = false;
      payButton.textContent = "Pay Now";
    }
  } catch (error) {
    console.error("Error:", error);
    statusDiv.className = "status-message error";
    statusDiv.textContent =
      "An error occurred. Please check your connection and try again.";
    payButton.disabled = false;
    payButton.textContent = "Pay Now";
  }
});

// Optional: Check for payment status in URL parameters (for callback)
function checkPaymentStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get("payment_id");
  const status = urlParams.get("status");

  if (paymentId && status) {
    const statusDiv = document.getElementById("paymentStatus");

    if (status === "success") {
      statusDiv.className = "status-message success";
      statusDiv.textContent = "Payment completed successfully!";
    } else if (status === "failed") {
      statusDiv.className = "status-message error";
      statusDiv.textContent = "Payment failed or was cancelled.";
    }
  }
}

// Run payment status check on page load
window.addEventListener("load", checkPaymentStatus);
