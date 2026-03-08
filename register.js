if (sessionStorage.getItem("user")) {
  window.location.replace("login.html");
}

const onlyLetters = /^[A-Za-z\u0600-\u06FF]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.getElementById("regForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fn = document.getElementById("firstName");
  const ln = document.getElementById("lastName");
  const em = document.getElementById("email");
  const pw = document.getElementById("password");
  const re = document.getElementById("rePassword");

  [fn, ln, em, pw, re].forEach((f) => f.classList.remove("is-invalid"));
  let valid = true;

  if (!onlyLetters.test(fn.value.trim())) {
    fn.classList.add("is-invalid");
    valid = false;
  }
  if (!onlyLetters.test(ln.value.trim())) {
    ln.classList.add("is-invalid");
    valid = false;
  }
  if (!emailRegex.test(em.value.trim())) {
    em.classList.add("is-invalid");
    valid = false;
  }
  if (pw.value.length < 8) {
    pw.classList.add("is-invalid");
    valid = false;
  }
  if (re.value === "" || re.value !== pw.value) {
    re.classList.add("is-invalid");
    valid = false;
  }

  if (valid) {
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        firstName: fn.value.trim(),
        lastName: ln.value.trim(),
        email: em.value.trim(),
        password: pw.value,
      }),
    );

    document.getElementById("successMsg").classList.remove("d-none");
    setTimeout(() => (window.location.href = "login.html"), 1500);
  }
});

document.getElementById("regForm").addEventListener("reset", function () {
  document.getElementById("successMsg").classList.add("d-none");
  ["firstName", "lastName", "email", "password", "rePassword"].forEach((id) => {
    document.getElementById(id).classList.remove("is-invalid");
  });
});
