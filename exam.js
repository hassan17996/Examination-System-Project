


const timerBar = document.getElementById("timerBar");
const timerDisplay = document.getElementById("timerDisplay");
const minutes = parseInt(document.getElementById("timerDisplay").dataset.minutes);

const totalQestionsNumber = document.getElementById("totalQestionsNum");
let questionText = document.getElementById("questionText");
const choiceItems = document.getElementsByClassName("choice-item");
let choiceLabel = document.getElementsByClassName("choice-label");

const currentQNum = document.getElementById("currentQNum");
const progressCount = document.getElementById("progressCount");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnMark = document.getElementById("btnMark");

let totalSeconds = minutes * 60;
let remainingSeconds = totalSeconds;

function update() {
    let actualMinutes = String(Math.floor(remainingSeconds / 60));
    let actualSeconds = String(remainingSeconds % 60);

    if (actualMinutes.length < 2) actualMinutes = "0" + actualMinutes;
    if (actualSeconds.length < 2) actualSeconds = "0" + actualSeconds;

    timerDisplay.textContent = `${actualMinutes}:${actualSeconds}`;

    const timeBarWidth = (remainingSeconds / totalSeconds) * 100;
    timerBar.style.width = timeBarWidth + "%";

    if (remainingSeconds <= 120) {
        timerDisplay.classList.add("danger");
        timerBar.classList.add("danger");
    }

    if (remainingSeconds <= 0) {
        clearInterval(timer);
        timerDisplay.textContent = "00:00";
        timerBar.style.width = "0%";
        remainingSeconds = 0;
        submitExam();
    }
    remainingSeconds--;
}

update();
const timer = setInterval(update, 1000);

function Answer(answerText, isCorrect) {
    this.text = answerText;
    this.isCorrect = isCorrect;
    this.getAnswerText = function () { return this.text; };
    this.check = function () { return this.isCorrect; };
}

function Question(questionText, answers) {
    this.questionText = questionText;
    this.answers = answers;
    this.getQuestionText = function () { return this.questionText; };
    this.getAnswers = function () { return this.answers; };
    this.getCorrectIndex = function () {
        return this.answers.findIndex(a => a.isCorrect);
    };
}

const questionBank = [
    new Question("What is the output of: console.log(typeof null);", [
        new Answer(null, false),
        new Answer("object", true),
        new Answer("undefined", false),
        new Answer("string", false)
    ]),
    new Question("Which data structure uses LIFO (Last In, First Out)?", [
        new Answer("Queue", false),
        new Answer("Stack", true),
        new Answer("Tree", false),
        new Answer("Graph", false)
    ]),
    new Question("What does HTML stand for?", [
        new Answer("Hyper Text Markup Language", true),
        new Answer("High Text Machine Language", false),
        new Answer("Hyperlinks and Text Markup Lang", false),
        new Answer("Home Tool Markup Language", false)
    ]),
    new Question("Which of these is NOT a JavaScript data type?", [
        new Answer("undefined", false),
        new Answer("boolean", false),
        new Answer("float", true),
        new Answer("symbol", false)
    ]),
    new Question("Which keyword is used to declare a constant in JavaScript?", [
        new Answer("var", false),
        new Answer("let", false),
        new Answer("const", true),
        new Answer("def", false)
    ]),
    new Question("Which CSS property controls the space between elements?", [
        new Answer("padding", false),
        new Answer("spacing", false),
        new Answer("margin", true),
        new Answer("border", false)
    ]),
    new Question("Which keyword is block-scoped?", [
        new Answer("var", false),
        new Answer("let", true),
        new Answer("const", true),
        new Answer("def", false)
    ]),
    new Question("What will 0.1 + 0.2 === 0.3 return?", [
        new Answer("true", false),
        new Answer("false", true),
        new Answer("undefined", false),
        new Answer("NaN", false)
    ]),
    new Question("Which array method returns a new array?", [
        new Answer("forEach()", false),
        new Answer("map()", true),
        new Answer("filter()", true),
        new Answer("reduce()", true)
    ]),
    new Question("What does setTimeout() do?", [
        new Answer("Executes a function after a specified delay", true),
        new Answer("Executes a function immediately", false),
        new Answer("Executes a function repeatedly at specified intervals", false),
        new Answer("Executes a function when an event occurs", false)
    ]),
];

totalQestionsNumber.textContent = questionBank.length;

/* ══════════════════════════════════════════════
SHUFFLE QUESTIONS
══════════════════════════════════════════════ */
function randomQestionsOrder(arr) {
    const shuffledArray = [...arr];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}
let shuffledQuestions = randomQestionsOrder(questionBank);

/* ══════════════════════════════════════════════
STATE
══════════════════════════════════════════════ */
let currentIndex = 0;
let userAnswers = new Array(shuffledQuestions.length).fill(null);
let markedQuestions = new Array(shuffledQuestions.length).fill(false);

/* ══════════════════════════════════════════════
BUILD Q-GRID (replaces static HTML dots)
══════════════════════════════════════════════ */
const qGrid = document.getElementById("qGrid");
qGrid.innerHTML = "";
for (let i = 0; i < shuffledQuestions.length; i++) {
    const dot = document.createElement("div");
    dot.classList.add("q-dot");
    dot.textContent = i + 1;
    dot.addEventListener("click", () => {
        currentIndex = i;
        showQuestion();
    });
    qGrid.appendChild(dot);
}

/* ══════════════════════════════════════════════
UPDATE SIDEBAR
══════════════════════════════════════════════ */
function updateSidebar() {
    const dots = qGrid.getElementsByClassName("q-dot");

    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("current", "answered", "marked");

        if (i === currentIndex) dots[i].classList.add("current");
        if (userAnswers[i] !== null) dots[i].classList.add("answered");
        if (markedQuestions[i]) dots[i].classList.add("marked");
    }

    const markList = document.getElementById("markList");
    const markedIndexes = [];
    for (let i = 0; i < markedQuestions.length; i++) {
        if (markedQuestions[i]) markedIndexes.push(i);
    }

    if (markedIndexes.length === 0) {
        markList.innerHTML = `<span class="empty-mark">No marked questions</span>`;
    } else {
        markList.innerHTML = "";
        for (let i = 0; i < markedIndexes.length; i++) {
            const index = markedIndexes[i];
            markList.innerHTML += `<span class="mark-item" onclick="currentIndex=${index};showQuestion()">Q${index + 1}</span>`;
        }
    }
}

/* ══════════════════════════════════════════════
RENDER
══════════════════════════════════════════════ */
function showQuestion() {
    let currentQuestion = shuffledQuestions[currentIndex];
    let currentQuestionAnswers = currentQuestion.getAnswers();

    questionText.textContent = currentQuestion.getQuestionText();

    for (let i = 0; i < choiceLabel.length; i++) {
        choiceLabel[i].textContent = currentQuestionAnswers[i].getAnswerText();
        choiceItems[i].classList.remove("selected");
    }

    let selectedAnswer = userAnswers[currentIndex];
    if (selectedAnswer !== null) {
        choiceItems[selectedAnswer].classList.add("selected");
    }

    currentQNum.textContent = currentIndex + 1;
    progressCount.textContent = currentIndex + 1;

    btnPrev.style.display = currentIndex === 0 ? "none" : "inline-block";
    btnNext.style.display = currentIndex === shuffledQuestions.length - 1 ? "none" : "inline-block";

    btnMark.classList.toggle("marked", markedQuestions[currentIndex]);
    btnMark.textContent = markedQuestions[currentIndex] ? "⚑ Unmark" : "⚑ Mark";

    updateSidebar();
}

/* ══════════════════════════════════════════════
NAVIGATE
══════════════════════════════════════════════ */
function navigate(direction) {
    const next = currentIndex + direction;
    if (next < 0 || next >= shuffledQuestions.length) return;
    currentIndex = next;
    showQuestion();
}

btnPrev.addEventListener("click", () => navigate(-1));
btnNext.addEventListener("click", () => navigate(1));

/* ══════════════════════════════════════════════
ANSWER SELECTION
══════════════════════════════════════════════ */
for (let i = 0; i < choiceItems.length; i++) {
    choiceItems[i].addEventListener("click", function () {
        userAnswers[currentIndex] = i;
        for (let j = 0; j < choiceItems.length; j++) {
            choiceItems[j].classList.remove("selected");
        }
        this.classList.add("selected");
        updateSidebar();
    });
}

/* ══════════════════════════════════════════════
MARK
══════════════════════════════════════════════ */
function toggleMark() {
    markedQuestions[currentIndex] = !markedQuestions[currentIndex];

    if (markedQuestions[currentIndex]) {
        btnMark.textContent = "⚑ Unmark";
    } else {
        btnMark.textContent = "⚑ Mark";
    }

    updateSidebar();
}
/* ══════════════════════════════════════════════
SUBMIT
══════════════════════════════════════════════ */
function submitExam() {
    clearInterval(timer);
}

showQuestion();