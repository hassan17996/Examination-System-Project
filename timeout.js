history.pushState(null, "", location.href);
window.addEventListener("popstate", function () {
    history.pushState(null, "", location.href);
});

const firstName = localStorage.getItem("firstName") || "Student";
const lastName = localStorage.getItem("lastName") || "";
const correct = parseInt(localStorage.getItem("correctAnswers")) || 0;
const total = parseInt(localStorage.getItem("totalQuestions")) || 0;
const unanswered = parseInt(localStorage.getItem("unansweredQuestions")) || 0;

document.getElementById("student-msg").innerHTML =
    `Sorry, <strong>${firstName} ${lastName}</strong>. Your time ran out!`;

document.getElementById("stat-correct").textContent = correct;
document.getElementById("stat-unanswered").textContent = unanswered;
document.getElementById("stat-total").textContent = total;

let secondsLeft = 25;
const countdownEl = document.getElementById("countdown");

const countdown = setInterval(() => {
    secondsLeft--;
    countdownEl.textContent = secondsLeft;
    if (secondsLeft <= 0) {
        clearInterval(countdown);
        window.location.href = "grades.html";
    }
}, 1000);
