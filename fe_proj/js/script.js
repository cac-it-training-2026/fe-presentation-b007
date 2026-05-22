/* ========================================
   問題データ
   後からここだけ編集すれば、問題内容を変更できる
======================================== */

const questions = [
    {
        category: "第1問：バイオメトリクス認証とは？",
        question: "バイオメトリクス認証に関する記述として，適切なものはどれか。",
        options: [
            "鍵やカードのように紛失したり盗まれたりする危険性がある。",
            "顔や指紋、声、静脈など本人を特定できる情報を用いて認証を行う高度技術である。",
            "身体そのものの形状や模様のみを利用して認証を行う方式である。",
            "バイオメトリクス認証では，生体情報が漏洩しても容易に変更できるため安全性が高い。"
        ],
        correctIndex: 1,
        explanation: "バイオメトリクス認証は、生体情報を利用して本人確認を行う技術だからである。\n他の選択肢は、A.鍵やカードのように紛失しない。\nB.声など行動的特徴も利用する。\nC.生体情報は簡単に変更できない、ため誤りである。"
    },
    {
        category: "第2問：バイオメトリクス認証の処理",
        question: "バイオメトリクス認証の処理手順として正しいものはどれか。",
        options: [
            "照合 → 特徴抽出 → 取得 → 判定",
            "取得 → 特徴抽出 → 照合 → 判定",
            "特徴抽出 → 取得 → 照合 → 判定",
            "取得 → 判定 → 照合 → 特徴抽出"
        ],
        correctIndex: 1,
        explanation: "バイオメトリクス認証では、まずセンサーで指紋や顔などの生体情報を取得し、その後に特徴を抽出する。次に、登録済みデータと照合し、一致度がしきい値以上なら本人と判定する。"
    },
    {
        category: "第3問：バイオメトリクス認証のメリット",
        question: "バイオメトリクス認証のメリットについて、適切なものはどれか。",
        options: [
            "完全に誤認証を防止できる",
            "生体情報は漏洩しても暗号化すれば必ず安全である",
            "本人固有の特徴を利用するため利便性が高い",
            "認証時には必ず暗証番号入力が必要"
        ],
        correctIndex: 2,
        explanation: "バイオメトリクス認証は本人固有の特徴を利用するため利便性が高い。他の選択肢はA.誤認証が存在する、B:生体情報は一度漏洩すると変更できない、C:単独でも利用できる、ため誤りである。"
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
