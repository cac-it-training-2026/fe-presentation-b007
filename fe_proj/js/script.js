/* ========================================
   問題データ
   後からここだけ編集すれば、問題内容を変更できる
======================================== */

const questions = [
    {
        category: "第1問：ここに分野名を書く",
        question: "ここに問題を書く。例：バイオメトリクス認証における身体的特徴に該当するものはどれか。",
        options: [
            "ここに選択肢Aを書く",
            "ここに選択肢Bを書く",
            "ここに選択肢Cを書く",
            "ここに選択肢Dを書く"
        ],
        correctIndex: 0,
        explanation: "ここに解説を書く。なぜこの選択肢が正解なのか、他の選択肢と比較しながら簡単に説明する。"
    },
    {
        category: "第2問：ここに分野名を書く",
        question: "ここに問題を書く。例：本人拒否率に関する説明として正しいものはどれか。",
        options: [
            "ここに選択肢Aを書く",
            "ここに選択肢Bを書く",
            "ここに選択肢Cを書く",
            "ここに選択肢Dを書く"
        ],
        correctIndex: 1,
        explanation: "ここに解説を書く。本人拒否率、他人受入率、しきい値などの関係を説明するとよい。"
    },
    {
        category: "第3問：ここに分野名を書く",
        question: "ここに問題を書く。例：生体情報を利用する際の注意点として最も適切なものはどれか。",
        options: [
            "ここに選択肢Aを書く",
            "ここに選択肢Bを書く",
            "ここに選択肢Cを書く",
            "ここに選択肢Dを書く"
        ],
        correctIndex: 2,
        explanation: "ここに解説を書く。生体情報は漏えいした場合に変更が難しいため、適切な保護が必要である。"
    }
];

/* ========================================
   HTML要素の取得
======================================== */

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

const questionCategory = document.getElementById("question-category");
const questionText = document.getElementById("question-text");
const optionsArea = document.getElementById("options-area");

const resultArea = document.getElementById("result-area");
const resultTitle = document.getElementById("result-title");
const correctAnswerText = document.getElementById("correct-answer-text");
const explanationText = document.getElementById("explanation-text");

const scoreText = document.getElementById("score-text");

/* ========================================
   状態管理用の変数
======================================== */

let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let correctCount = 0;
let answered = false;

/* ========================================
   画面切り替え用関数
======================================== */

function showScreen(screen) {
    startScreen.classList.remove("active");
    quizScreen.classList.remove("active");
    endScreen.classList.remove("active");

    screen.classList.add("active");
}

/* ========================================
   テスト開始
======================================== */

startBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    selectedOptionIndex = null;
    correctCount = 0;
    answered = false;

    showScreen(quizScreen);
    renderQuestion();
});

/* ========================================
   問題を表示する関数
======================================== */

function renderQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    selectedOptionIndex = null;
    answered = false;

    questionCategory.textContent = currentQuestion.category;
    questionText.textContent = currentQuestion.question;

    submitBtn.disabled = true;
    submitBtn.classList.remove("hidden");

    resultArea.className = "result-area hidden";
    resultTitle.textContent = "";
    correctAnswerText.textContent = "";
    explanationText.textContent = "";

    updateProgress();
    renderOptions(currentQuestion);
}

/* ========================================
   進捗バー更新
======================================== */

function updateProgress() {
    const currentNumber = currentQuestionIndex + 1;
    const totalNumber = questions.length;
    const progressPercent = (currentNumber / totalNumber) * 100;

    progressText.textContent = `${currentNumber}/${totalNumber}`;
    progressFill.style.width = `${progressPercent}%`;
}

/* ========================================
   選択肢を表示する関数
======================================== */

function renderOptions(questionData) {
    optionsArea.innerHTML = "";

    questionData.options.forEach((optionText, index) => {
        const optionButton = document.createElement("button");

        optionButton.className = "option-btn";
        optionButton.innerHTML = `
            <span class="option-label">${String.fromCharCode(65 + index)}</span>
            ${optionText}
        `;

        optionButton.addEventListener("click", () => {
            if (answered) {
                return;
            }

            selectedOptionIndex = index;
            submitBtn.disabled = false;

            const optionButtons = document.querySelectorAll(".option-btn");
            optionButtons.forEach(button => {
                button.classList.remove("selected");
            });

            optionButton.classList.add("selected");
        });

        optionsArea.appendChild(optionButton);
    });
}

/* ========================================
   回答を確認する処理
======================================== */

submitBtn.addEventListener("click", () => {
    if (selectedOptionIndex === null || answered) {
        return;
    }

    answered = true;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.correctIndex;

    if (isCorrect) {
        correctCount++;
    }

    showResult(isCorrect, currentQuestion);
    lockOptions();

    submitBtn.classList.add("hidden");

    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = "テストを終了する";
    } else {
        nextBtn.textContent = "次の問題へ";
    }
});

/* ========================================
   解説を表示する関数
======================================== */

function showResult(isCorrect, currentQuestion) {
    resultArea.classList.remove("hidden");

    if (isCorrect) {
        resultArea.classList.add("correct");
        resultTitle.textContent = "正解です";
    } else {
        resultArea.classList.add("wrong");
        resultTitle.textContent = "不正解です";
    }

    const correctLabel = String.fromCharCode(65 + currentQuestion.correctIndex);
    const correctText = currentQuestion.options[currentQuestion.correctIndex];

    correctAnswerText.textContent = `正解：${correctLabel}. ${correctText}`;
    explanationText.textContent = currentQuestion.explanation;
}

/* ========================================
   回答後に選択肢をロックする
======================================== */

function lockOptions() {
    const optionButtons = document.querySelectorAll(".option-btn");

    optionButtons.forEach(button => {
        button.disabled = true;
    });
}

/* ========================================
   次の問題へ進む
======================================== */

nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex === questions.length - 1) {
        showEndScreen();
        return;
    }

    currentQuestionIndex++;
    renderQuestion();
});

/* ========================================
   終了画面を表示する
======================================== */

function showEndScreen() {
    scoreText.textContent = `正解数：${correctCount} / ${questions.length}`;
    showScreen(endScreen);
}

/* ========================================
   もう一度挑戦する
======================================== */

restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    selectedOptionIndex = null;
    correctCount = 0;
    answered = false;

    showScreen(startScreen);
});