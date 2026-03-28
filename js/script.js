document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav-links a");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    // --- Global: Level Up Popup ---
    function triggerLevelUp() {
        let popup = document.getElementById("level-up-popup");
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "level-up-popup";
            popup.className = "level-up-popup";
            popup.textContent = "⭐ LEVEL UP! ⭐";
            document.body.appendChild(popup);
        }
        
        // Reset animation by removing and re-adding class
        popup.classList.remove("show");
        void popup.offsetWidth; // trigger reflow
        popup.classList.add("show");
        
        setTimeout(() => {
            popup.classList.remove("show");
        }, 2000);
    }

    // --- Lesson 1: Language Matching Interactive ---
    const checkAnswersBtn = document.getElementById("check-answers-btn");
    
    if (checkAnswersBtn) {
        checkAnswersBtn.addEventListener("click", function() {
            const selects = document.querySelectorAll(".language-select");
            const feedback = document.getElementById("lesson1-feedback");
            let correctCount = 0;
            
            selects.forEach(select => {
                const tr = select.closest("tr");
                const iconCell = tr.querySelector(".status-cell");
                
                if (select.value === select.dataset.correct) {
                    correctCount++;
                    iconCell.innerHTML = "✅";
                } else {
                    iconCell.innerHTML = "❌";
                }
            });
            
            if (correctCount === selects.length) {
                feedback.textContent = "Great job! You matched all use cases correctly.";
                feedback.className = "feedback-msg success-text";
                triggerLevelUp();
            } else {
                feedback.textContent = `You got ${correctCount} out of ${selects.length} correct. Try again!`;
                feedback.className = "feedback-msg error-text";
            }
        });
    }

    // --- Lesson 3: Commit Minigame Interactive ---
    const commitGrid = document.getElementById("commit-grid");
    const startGameBtn = document.getElementById("start-game-btn");

    if (commitGrid && startGameBtn) {
        // Generate grid
        const numSquares = 140; // 20 columns * 7 rows
        for (let i = 0; i < numSquares; i++) {
            const square = document.createElement("div");
            square.classList.add("commit-square");
            commitGrid.appendChild(square);
            
            // Add click listener
            square.addEventListener("click", function() {
                if (gameIsActive && !this.classList.contains("committed")) {
                    this.classList.add("committed");
                    gameScore++;
                    updateScoreDisplay();
                }
            });
        }
        
        let gameIsActive = false;
        let gameScore = 0;
        let gameTime = 10;
        let timerInterval;
        
        const timeDisplay = document.getElementById("game-time");
        const scoreDisplay = document.getElementById("game-score");
        const gameFeedback = document.getElementById("lesson3-feedback");
        
        function updateScoreDisplay() {
            scoreDisplay.textContent = gameScore;
        }

        startGameBtn.addEventListener("click", function() {
            if (gameIsActive) return;
            
            // Reset game
            gameScore = 0;
            gameTime = 10;
            gameIsActive = true;
            updateScoreDisplay();
            timeDisplay.textContent = gameTime;
            gameFeedback.textContent = "";
            
            // Clear all squares
            document.querySelectorAll(".commit-square").forEach(sq => {
                sq.classList.remove("committed");
            });

            startGameBtn.disabled = true;
            startGameBtn.style.opacity = "0.5";
            
            timerInterval = setInterval(() => {
                gameTime--;
                timeDisplay.textContent = gameTime;
                
                if (gameTime <= 0) {
                    clearInterval(timerInterval);
                    gameIsActive = false;
                    startGameBtn.disabled = false;
                    startGameBtn.style.opacity = "1";
                    gameFeedback.textContent = `Time's up! You made ${gameScore} commits. ${gameScore > 30 ? "Wow, a true 10x developer!" : "Keep grinding!"}`;
                    gameFeedback.className = "feedback-msg success-text";
                    if (gameScore > 0) triggerLevelUp();
                }
            }, 1000);
        });
    }

    // --- Lesson 2: Vim Escape Interactive ---
    const vimSubmitBtn = document.getElementById("vim-submit-btn");
    const vimInput = document.getElementById("vim-input");
    
    if (vimSubmitBtn && vimInput) {
        function checkVimCommand() {
            const val = vimInput.value.trim();
            const feedback = document.getElementById("lesson2-feedback");
            
            if (val === ":q" || val === ":q!" || val === ":wq" || val === ":x") {
                feedback.textContent = `Success! You safely exited Vim using ${val}.`;
                feedback.className = "feedback-msg success-text";
                triggerLevelUp();
            } else {
                feedback.textContent = `Error: Cannot execute '${val}'. You are still trapped in Vim.`;
                feedback.className = "feedback-msg error-text";
            }
        }
        
        vimSubmitBtn.addEventListener("click", checkVimCommand);
        vimInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                checkVimCommand();
            }
        });
    }

    // --- Lesson 4: Boss Battle Interactive ---
    const attackBtns = document.querySelectorAll(".attack-btn");
    const bossHpDisplay = document.getElementById("boss-hp");
    const bossFeedback = document.getElementById("lesson4-feedback");
    
    if (attackBtns.length > 0 && bossHpDisplay) {
        let bossHp = 100;
        
        attackBtns.forEach(btn => {
            btn.addEventListener("click", function() {
                if (bossHp <= 0) return;
                
                const damage = parseInt(this.getAttribute("data-damage"));
                const msg = this.getAttribute("data-msg");
                
                bossHp -= damage;
                
                if (damage === 0) {
                    bossHp += 10; // Healing the boss
                }
                
                if (bossHp > 100) bossHp = 100;
                
                if (bossHp <= 0) {
                    bossHp = 0;
                    bossHpDisplay.textContent = bossHp;
                    bossFeedback.textContent = msg + " THE CLIENT HAS BEEN DEFEATED! (Or rather, successfully managed). Great job!";
                    bossFeedback.className = "feedback-msg success-text";
                    triggerLevelUp();
                    
                    // Disable buttons
                    attackBtns.forEach(b => {
                        b.disabled = true;
                        b.style.opacity = "0.5";
                        b.style.cursor = "not-allowed";
                    });
                } else if (damage < 0) {
                    bossHpDisplay.textContent = bossHp;
                    bossFeedback.textContent = msg + " The boss grows stronger!";
                    bossFeedback.className = "feedback-msg error-text";
                } else {
                    bossHpDisplay.textContent = bossHp;
                    bossFeedback.textContent = msg + ` The client took ${damage} damage!`;
                    bossFeedback.className = "feedback-msg";
                    bossFeedback.style.color = "var(--celadon)";
                }
            });
        });
    }

    // --- Lesson 5: Final Boss (Wizard) Interactive ---
    const wizardHpFill = document.getElementById("wizard-hp-fill");
    const wizardQuestionText = document.getElementById("wizard-question-text");
    const wizardOptionsContainer = document.getElementById("wizard-options-container");
    const wizardFeedback = document.getElementById("lesson5-feedback");

    if (wizardHpFill && wizardQuestionText && wizardOptionsContainer) {
        let wizardHp = 100;
        let currentQuestionIndex = 0;
        
        const wizardQuestions = [
            {
                q: "I cast 'Agile Strike'! Which of these describes Agile methodology?",
                options: [
                    { text: "Sequential phases where each must finish before the next begins.", correct: false },
                    { text: "Iterative approach delivering working software in short sprints.", correct: true },
                    { text: "Writing all code before gathering any requirements.", correct: false }
                ]
            },
            {
                q: "My 'Waterfall Illusion' tricks you! When is Waterfall actually useful?",
                options: [
                    { text: "When requirements are well-understood and unlikely to change.", correct: true },
                    { text: "For startups pivoting their product every week.", correct: false },
                    { text: "When the client doesn't know what they want.", correct: false }
                ]
            },
            {
                q: "A final riddle! Who makes sure the Scrum team follows the process?",
                options: [
                    { text: "The Legacy Boss", correct: false },
                    { text: "The Product Owner", correct: false },
                    { text: "The Scrum Master", correct: true }
                ]
            }
        ];

        function loadWizardQuestion() {
            if (currentQuestionIndex >= wizardQuestions.length) return;
            
            const qData = wizardQuestions[currentQuestionIndex];
            wizardQuestionText.textContent = qData.q;
            wizardOptionsContainer.innerHTML = "";
            
            qData.options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "wizard-option-btn";
                btn.textContent = opt.text;
                btn.addEventListener("click", () => handleWizardAnswer(opt.correct));
                wizardOptionsContainer.appendChild(btn);
            });
        }

        function handleWizardAnswer(isCorrect) {
            if (wizardHp <= 0) return;
            
            if (isCorrect) {
                wizardHp -= 34; // 3 questions to defeat
                wizardFeedback.textContent = "Correct! Your knowledge breaks through the illusion!";
                wizardFeedback.className = "feedback-msg success-text";
            } else {
                wizardFeedback.textContent = "Wrong! The wizard laughs as your answer fizzles out.";
                wizardFeedback.className = "feedback-msg error-text";
            }
            
            if (wizardHp < 0) wizardHp = 0;
            wizardHpFill.style.width = wizardHp + "%";
            
            if (wizardHp === 0 || (isCorrect && currentQuestionIndex === wizardQuestions.length - 1)) {
                wizardHpFill.style.width = "0%";
                wizardQuestionText.textContent = "NOOO! My legacy methodologies are defeated!";
                wizardOptionsContainer.innerHTML = "";
                wizardFeedback.textContent = "You defeated the Final Boss and passed the course!";
                wizardFeedback.className = "feedback-msg success-text";
                triggerLevelUp();
            } else if (isCorrect) {
                currentQuestionIndex++;
                setTimeout(loadWizardQuestion, 1500);
            }
        }

        loadWizardQuestion();
    }
});