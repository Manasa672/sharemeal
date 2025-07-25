const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

// Toggle between forms
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Role Selection Functionality
const roleButtons = document.querySelectorAll(".role-btn");
const userRoleInput = document.getElementById("user-role");

roleButtons.forEach(button => {
  button.addEventListener("click", () => {
    roleButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    userRoleInput.value = button.dataset.role;
  });
});

// Initialize data structures when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Remove localStorage initialization for users, donations, requests
  // Remove all localStorage.setItem/getItem for donationUsers, foodDonations, foodRequests
  // On registration and login, store only the JWT token and user info in memory (or sessionStorage if needed)
  // Use fetch API to interact with /api/donation and /api/request endpoints for all donation/request CRUD
  // Example for registration and login:
});

const API_BASE = 'http://localhost:5000';



document.querySelector(".sign-up-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;
  const role = userRoleInput.value;

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role })
    });
    if (res.status === 201) {
      const user = await res.json();
      if (!user.token) {
        alert('Registration failed: No token received from server.');
        return;
      }
      // On successful registration/login:
      
      // window.currentDonationUser = user; // or sessionStorage.setItem('currentDonationUser', JSON.stringify(user));
      alert("Account created successfully! Please set your location.");
      window.location.href = "location.html";
    } else {
      let errMsg = "Registration failed";
      try {
        const err = await res.json();
        errMsg = err.error || errMsg;
      } catch {}
      alert(errMsg);
    }
  } catch (error) {
    alert("Registration error: " + error.message);
  }
});

// Sign In Functionality
// Replace localStorage login with backend API call

document.querySelector(".sign-in-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value;

  // Validation
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const user = await res.json();
      if (!user.token) {
        alert('Login failed: No token received from server.');
        return;
      }
      // On successful registration/login:
      sessionStorage.setItem('jwtToken', user.token);
      sessionStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        email: user.email,
        role: user.role
      }));
      // window.currentDonationUser = user; // or sessionStorage.setItem('currentDonationUser', JSON.stringify(user));
      // Check if user has location set (required for all users)
      const locRes = await fetch(`${API_BASE}/api/location/${user.username}`);
      if (!locRes.ok) {
        alert("Please set your location first");
        window.location.href = "location.html";
        return;
      }
      redirectBasedOnRole(user.role);
    } else {
      let errMsg = "Invalid credentials";
      try {
        const err = await res.json();
        errMsg = err.error || errMsg;
      } catch {}
      alert(errMsg);
    }
  } catch (error) {
    alert("Login error: " + error.message);
  }
});

// Single, unified redirect function for all roles
function redirectBasedOnRole(role) {
  if (role === 'donor') {
    window.location.href = 'donor.html';
  } else if (role === 'receiver') {
    window.location.href = 'receiver.html';
  } else if (role === 'ngo') {
    window.location.href = 'ngo-dashboard.html';
  }
}

// Helper function to calculate distance between coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Create Donation
async function createDonation(donationData) {
  const token = sessionStorage.getItem('jwtToken');
  const res = await fetch(`${API_BASE}/api/donation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(donationData)
  });
  return res.json();
}

// Get Donations
async function getDonations() {
  const token = sessionStorage.getItem('jwtToken');
  const res = await fetch(`${API_BASE}/api/donation`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}

// Update Donation
async function updateDonation(id, updateData) {
  const token = sessionStorage.getItem('jwtToken');
  const res = await fetch(`${API_BASE}/api/donation/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
  return res.json();
}

// Delete Donation
async function deleteDonation(id) {
  const token = sessionStorage.getItem('jwtToken');
  const res = await fetch(`${API_BASE}/api/donation/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}


// Create Request
async function createRequest(requestData) {
  const token = sessionStorage.getItem('jwtToken');
  const res = await fetch(`${API_BASE}/api/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(requestData)
  });
  return res.json();
}

// Get Requests
async function getRequests() {
  const token = sessionStorage.getItem('jwtToken');
  const res = await fetch(`${API_BASE}/api/request`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}

// Update Request
async function updateRequest(id, updateData) {
  const token = sessionStorage.getItem('jwtToken');
  const res = await fetch(`${API_BASE}/api/request/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
  return res.json();
}

// Delete Request
async function deleteRequest(id) {
  const token = sessionStorage.getItem('jwtToken');
  const res = await fetch(`${API_BASE}/api/request/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}

//