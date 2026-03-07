const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const em = document.getElementById("email");
  const pw = document.getElementById("password");
  const errorMsg = document.getElementById("errorMsg");
  const successMsg = document.getElementById("successMsg");

  errorMsg.classList.add("d-none");
  successMsg.classList.add("d-none");
  [em, pw].forEach((f) => f.classList.remove("is-invalid", "is-valid"));

  let valid = true;

  if (!emailRegex.test(em.value.trim())) {
    em.classList.add("is-invalid");
    valid = false;
  } else em.classList.add("is-valid");

  if (pw.value.trim() === "") {
    pw.classList.add("is-invalid");
    valid = false;
  } else pw.classList.add("is-valid");

  if (!valid) return;

  const saved = JSON.parse(sessionStorage.getItem("user") || "null");

  if (saved && em.value.trim() === saved.email && pw.value === saved.password) {
    successMsg.classList.remove("d-none");
setTimeout(() => {
  alert(
    "Welcome " +
      saved.firstName + " " + saved.lastName + " Redirecting to exam"
  );

  window.location.href = "exam.html"; 
}, 1500);
  } else {
    errorMsg.classList.remove("d-none");
    em.classList.replace("is-valid", "is-invalid");
    pw.classList.replace("is-valid", "is-invalid");
  }
});

document.getElementById("loginForm").addEventListener("reset", function () {
  document.getElementById("errorMsg").classList.add("d-none");
  document.getElementById("successMsg").classList.add("d-none");
  ["email", "password"].forEach((id) => {
    document.getElementById(id).classList.remove("is-valid", "is-invalid");
  });
});
