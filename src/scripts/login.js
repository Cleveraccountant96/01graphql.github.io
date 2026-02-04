// src/scripts/login.js

const form = document.getElementById("login-form");
const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;

  const credentials = btoa(`${login}:${password}`);

  try {
    const res = await fetch("https://Learn.01founders.co/api/auth/signin", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`
      }
    });

    if (!res.ok) throw new Error("Invalid credentials");

    const token = await res.json();
    localStorage.setItem("jwt", token);
    window.location.href = "./profile.html";

  } catch (err) {
    error.textContent = "Invalid username or password";
  }
});
