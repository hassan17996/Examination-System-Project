history.pushState(null, "", location.href);
window.addEventListener("popstate", function () {
    history.pushState(null, "", location.href);
});

const firstName = localStorage.getItem("firstName") || "Student";
const lastName = localStorage.getItem("lastName") || "";
const correct = parseInt(localStorage.getItem("correctAnswers")) || 0;
const total = parseInt(localStorage.getItem("totalQuestions")) || 0;
const wrong = total - correct;
const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

document.getElementById("student-msg").innerHTML =
  `Hello <strong>${firstName} ${lastName}</strong>!`;

document.getElementById("score").textContent = `${correct} / ${total}`;
document.getElementById("percent").textContent = `${percent}%`;
document.getElementById("stat-correct").textContent = correct;
document.getElementById("stat-wrong").textContent = wrong;
document.getElementById("stat-total").textContent = total;

setTimeout(() => {
  document.getElementById("score-bar").style.width = percent + "%";
}, 100);

const alertEl = document.getElementById("remark-alert");
if (percent >= 80) {
  alertEl.className = "alert alert-success";
  alertEl.textContent = " Excellent! Great work!";
} else if (percent >= 50) {
  alertEl.className = "alert alert-warning";
  alertEl.textContent = " Good effort, keep it up!";
} else {
  alertEl.className = "alert alert-danger";
  alertEl.textContent = " Keep studying, you can do better!";
}
