const userEmail = localStorage.getItem("email");

if (!userEmail) {
  window.location.href = "home.html";
}

const timerBar = document.getElementById("timerBar");
const timerDisplay = document.getElementById("timerDisplay");
const minutes = parseInt(
  document.getElementById("timerDisplay").dataset.minutes,
);

const totalQestionsNumber = document.getElementById("totalQestionsNum");
const questionText = document.getElementById("questionText");

const currentQNum = document.getElementById("currentQNum");
const progressCount = document.getElementById("progressCount");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnMark = document.getElementById("btnMark");

const qGrid = document.getElementById("qGrid");

let totalSeconds = minutes * 60;
let remainingSeconds = totalSeconds;

function formatTime(seconds) {
  let actualRemainingMinutes = String(Math.floor(seconds / 60));
  let actualRemainingSeconds = String(seconds % 60);

  if (actualRemainingMinutes.length < 2)
    actualRemainingMinutes = "0" + actualRemainingMinutes;
  if (actualRemainingSeconds.length < 2)
    actualRemainingSeconds = "0" + actualRemainingSeconds;

  timerDisplay.textContent = `${actualRemainingMinutes}:${actualRemainingSeconds}`;
}

const timer = setInterval(function () {
  formatTime(remainingSeconds);

  const timeBarWidth = (remainingSeconds / totalSeconds) * 100;
  timerBar.style.width = timeBarWidth + "%";

  if (remainingSeconds <= 45) {
    timerDisplay.classList.add("danger");
    timerBar.classList.add("danger");
  }

  if (remainingSeconds <= 0) {
    clearInterval(timer);
    saveResultsToStorage(true);
    window.location.href = "timeout.html";
  }

  remainingSeconds--;
}, 1000);

function saveResultsToStorage() {
  const { shuffledQuestions, userAnswers } = window._examState;
  let correct = shuffledQuestions.filter(
    (q, i) => userAnswers[i] !== null && q.answers[userAnswers[i]].isCorrect,
  );
  let answeredCount = userAnswers.filter((a) => a !== null).length;

  localStorage.setItem("correctAnswers", correct.length);
  localStorage.setItem("totalQuestions", shuffledQuestions.length);
  localStorage.setItem(
    "unansweredQuestions",
    shuffledQuestions.length - answeredCount,
  );
}

function submitExam() {
  clearInterval(timer);
  saveResultsToStorage();
  window.location.href = "grades.html";
}

async function initExam() {
  const response = await fetch("questions.json");
  const questionBank = await response.json();

  totalQestionsNumber.textContent = questionBank.length;

  const choiceItems = document.getElementsByClassName("choice-item");
  const choiceLabel = document.getElementsByClassName("choice-label");

  let shuffledQuestions = [...questionBank].sort(() => Math.random() - 0.5);

  let currentIndex = 0;
  let userAnswers = new Array(shuffledQuestions.length).fill(null);
  let markedQuestions = new Array(shuffledQuestions.length).fill(false);
  window._examState = { shuffledQuestions, userAnswers };

  qGrid.innerHTML = "";
  for (let i = 0; i < shuffledQuestions.length; i++) {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("q-dot");
    questionDiv.textContent = i + 1;
    questionDiv.addEventListener("click", () => {
      currentIndex = i;
      showQuestion();
    });
    qGrid.appendChild(questionDiv);
  }

  function updateSidebar() {
    const dots = qGrid.getElementsByClassName("q-dot");

    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("current", "answered", "marked");

      if (i === currentIndex) dots[i].classList.add("current");
      if (userAnswers[i] !== null) dots[i].classList.add("answered");
      if (markedQuestions[i]) dots[i].classList.add("marked");
    }

    const markList = document.getElementById("markList");
    const markedQuestionIndexes = [];

    for (let i = 0; i < markedQuestions.length; i++) {
      if (markedQuestions[i]) markedQuestionIndexes.push(i);
    }

    if (markedQuestionIndexes.length === 0) {
      markList.innerHTML = `<span class="empty-mark">No marked questions</span>`;
    } else {
      markList.innerHTML = "";
      for (let i = 0; i < markedQuestionIndexes.length; i++) {
        const span = document.createElement("span");
        const index = markedQuestionIndexes[i];
        span.className = "mark-item";
        span.textContent = `Q${index + 1}`;

        span.addEventListener("click", () => {
          currentIndex = index;
          showQuestion();
        });

        markList.appendChild(span);
      }
    }
  }

  function showQuestion() {
    let currentQuestion = shuffledQuestions[currentIndex];
    let currentQuestionAnswers = currentQuestion.answers;

    questionText.textContent = currentQuestion.question;

    for (let i = 0; i < choiceLabel.length; i++) {
      choiceLabel[i].textContent = currentQuestionAnswers[i].text;
      choiceItems[i].classList.remove("selected");
    }

    let selectedAnswer = userAnswers[currentIndex];
    if (selectedAnswer !== null) {
      choiceItems[selectedAnswer].classList.add("selected");
    }

    currentQNum.textContent = currentIndex + 1;
    progressCount.textContent = currentIndex + 1;

    btnPrev.style.display = currentIndex === 0 ? "none" : "inline-block";
    btnNext.style.display =
      currentIndex === shuffledQuestions.length - 1 ? "none" : "inline-block";

    btnMark.classList.toggle("marked", markedQuestions[currentIndex]);
    btnMark.textContent = markedQuestions[currentIndex] ? "⚑ Unmark" : "⚑ Mark";

    updateSidebar();
  }

  function forwardAndBack(step) {
    const next = currentIndex + step;
    if (next < 0 || next >= shuffledQuestions.length) return;
    currentIndex = next;
    showQuestion();
  }
  btnPrev.addEventListener("click", () => forwardAndBack(-1));
  btnNext.addEventListener("click", () => forwardAndBack(1));

  for (let i = 0; i < choiceItems.length; i++) {
    choiceItems[i].addEventListener("click", function () {
      userAnswers[currentIndex] = i;
      window._examState.userAnswers = userAnswers;
      for (let j = 0; j < choiceItems.length; j++) {
        choiceItems[j].classList.remove("selected");
      }
      this.classList.add("selected");
      updateSidebar();
    });
  }

  function toggleMark() {
    markedQuestions[currentIndex] = !markedQuestions[currentIndex];
    btnMark.textContent = markedQuestions[currentIndex] ? "⚑ Unmark" : "⚑ Mark";
    updateSidebar();

    if (currentIndex < shuffledQuestions.length - 1) {
      currentIndex++;
      showQuestion();
    }
  }
  btnMark.addEventListener("click", toggleMark);

  const btnSubmit = document.getElementById("btnSubmit");
  btnSubmit.addEventListener("click", function () {
    const unanswered = userAnswers.filter((a) => a === null).length;

    if (unanswered > 0) {
      alert(
        `⚠️ Please answer all questions before submitting.\n${unanswered} question(s) are still unanswered.`,
      );
      return;
    }

    submitExam();
  });

  showQuestion();
}
initExam();
