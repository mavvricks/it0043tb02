let questionBank = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        explanation: "Paris is the capital city of France, known for its iconic Eiffel Tower and rich cultural heritage."
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        explanation: "Mars is called the Red Planet because of its reddish appearance, caused by iron oxide (rust) on its surface."
    }
];

let currentQuestions = [...questionBank];
let currentIndex = 0;
let selectedAnswer = null;
let answers = new Array(questionBank.length).fill(null);
let isAnswered = false;
let isQuizComplete = false;

// DOM Elements
const questionText = document.getElementById('question-text');
const options = document.querySelectorAll('.option');
const explanationText = document.getElementById('explanation-text');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');

// Settings Panel Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const quizTitleInput = document.getElementById('quiz-title-input');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question');
const saveSettingsBtn = document.getElementById('save-settings');
const cancelSettingsBtn = document.getElementById('cancel-settings');
const quizTitleDisplay = document.getElementById('quiz-title-display');

// Question Bank Management
const bankNameInput = document.getElementById('bank-name');
const saveBankBtn = document.getElementById('save-bank');
const bankSelector = document.getElementById('bank-selector');
const loadBankBtn = document.getElementById('load-bank');
const deleteBankBtn = document.getElementById('delete-bank');

// Initialize the quiz
function initQuiz() {
    totalQuestionsSpan.textContent = currentQuestions.length;
    updateQuestion();
    updateButtons();
}

// Create a new question element for settings panel
function createQuestionElement(question = null) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    
    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.placeholder = 'Enter your question';
    questionInput.value = question ? question.question : '';
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'option-inputs';
    
    for (let i = 0; i < 4; i++) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-input';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `correct-${questionsContainer.children.length}`;
        radio.value = i;
        if (question && question.correctAnswer === i) radio.checked = true;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Option ${i + 1}`;
        input.value = question ? question.options[i] : '';
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(input);
        optionsContainer.appendChild(optionDiv);
    }
    
    const explanationInput = document.createElement('input');
    explanationInput.type = 'text';
    explanationInput.placeholder = 'Enter explanation';
    explanationInput.value = question ? question.explanation : '';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-question';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = () => questionDiv.remove();
    
    questionDiv.appendChild(deleteBtn);
    questionDiv.appendChild(questionInput);
    questionDiv.appendChild(optionsContainer);
    questionDiv.appendChild(explanationInput);
    
    return questionDiv;
}

// Load questions into settings panel
function loadQuestionsToSettings() {
    questionsContainer.innerHTML = '';
    questionBank.forEach(question => {
        questionsContainer.appendChild(createQuestionElement(question));
    });
}

// Save questions from settings panel
function saveQuestionsFromSettings() {
    const questionElements = questionsContainer.children;
    questionBank = [];
    
    for (let i = 0; i < questionElements.length; i++) {
        const element = questionElements[i];
        
        // Get the question input
        const questionInput = element.querySelector('input[type="text"]');
        
        // Get all option inputs
        const optionInputs = element.querySelectorAll('.option-input input[type="text"]');
        
        // Get the correct answer radio button
        const correctAnswerRadio = element.querySelector('input[type="radio"]:checked');
        const correctAnswerIndex = correctAnswerRadio ? 
            correctAnswerRadio.value.charCodeAt(0) - 65 : 0; // Convert A,B,C,D to 0,1,2,3
        
        // Get the explanation input (last text input)
        const explanationInput = element.querySelectorAll('input[type="text"]')[5];
        
        const question = {
            question: questionInput.value,
            options: [
                optionInputs[0].value,
                optionInputs[1].value,
                optionInputs[2].value,
                optionInputs[3].value
            ],
            correctAnswer: correctAnswerIndex,
            explanation: explanationInput.value
        };
        
        questionBank.push(question);
    }
}

// Show settings panel
settingsBtn.addEventListener('click', () => {
    console.log('Settings button clicked');
    quizTitleInput.value = quizTitleDisplay.textContent;
    loadQuestionsToSettings();
    loadSavedBanks();
    settingsPanel.classList.add('active');
});

// Hide settings panel
function hideSettingsPanel() {
    console.log('Hiding settings panel'); // Debug log
    settingsPanel.classList.remove('active');
}

// Add new question
addQuestionBtn.addEventListener('click', () => {
    console.log('Add question button clicked'); // Debug log
    questionsContainer.appendChild(createQuestionElement());
});

// Save settings
saveSettingsBtn.addEventListener('click', () => {
    console.log('Save settings button clicked'); // Debug log
    // Validate inputs
    const questionElements = questionsContainer.children;
    let isValid = true;
    
    for (let i = 0; i < questionElements.length; i++) {
        const element = questionElements[i];
        const inputs = element.querySelectorAll('input');
        
        // Check if question and all options are filled
        if (!inputs[0].value || !inputs[1].value || !inputs[2].value || 
            !inputs[3].value || !inputs[4].value) {
            alert('Please fill in all fields for each question');
            isValid = false;
            break;
        }
        
        // Check if a correct answer is selected
        if (!element.querySelector('input[type="radio"]:checked')) {
            alert('Please select a correct answer for each question');
            isValid = false;
            break;
        }
    }
    
    if (isValid) {
        quizTitleDisplay.textContent = quizTitleInput.value;
        saveQuestionsFromSettings();
        currentQuestions = [...questionBank];
        currentIndex = 0;
        selectedAnswer = null;
        answers = new Array(questionBank.length).fill(null);
        isAnswered = false;
        isQuizComplete = false;
        hideSettingsPanel();
        updateQuestion();
        updateButtons();
    }
});

// Cancel settings
cancelSettingsBtn.addEventListener('click', () => {
    console.log('Cancel settings button clicked'); // Debug log
    hideSettingsPanel();
});

// Update the current question display
function updateQuestion() {
    const currentQuestion = currentQuestions[currentIndex];
    questionText.textContent = currentQuestion.question;
    
    // Create an array of option indices and shuffle them
    const optionIndices = [0, 1, 2, 3];
    const shuffledIndices = optionIndices.sort(() => Math.random() - 0.5);
    
    // Store the mapping of shuffled indices to original indices
    const originalToShuffled = {};
    shuffledIndices.forEach((shuffled, original) => {
        originalToShuffled[original] = shuffled;
    });
    
    options.forEach((option, index) => {
        const originalIndex = shuffledIndices[index];
        option.textContent = currentQuestion.options[originalIndex];
        option.classList.remove('correct', 'incorrect', 'selected');
        option.disabled = isAnswered;
        option.style.display = '';
        
        // Store the original index as a data attribute
        option.dataset.originalIndex = originalIndex;
    });

    // Show previous answer if exists
    if (answers[currentIndex] !== null) {
        const previousAnswer = answers[currentIndex];
        const shuffledPreviousAnswer = originalToShuffled[previousAnswer];
        const shuffledCorrectAnswer = originalToShuffled[currentQuestion.correctAnswer];
        
        options[shuffledPreviousAnswer].classList.add(
            previousAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'
        );
        options[shuffledCorrectAnswer].classList.add('correct');
        explanationText.textContent = currentQuestion.explanation;
        isAnswered = true;
        options.forEach(option => option.disabled = true);
    } else {
        explanationText.textContent = '';
        isAnswered = false;
    }

    currentQuestionSpan.textContent = currentIndex + 1;
}

// Update button states
function updateButtons() {
    prevBtn.disabled = currentIndex === 0 || isQuizComplete;
    
    if (isQuizComplete) {
        nextBtn.textContent = 'Restart Quiz';
        nextBtn.style.display = '';
    } else if (isAnswered) {
        nextBtn.textContent = currentIndex === currentQuestions.length - 1 ? 'Submit Quiz' : 'Next';
        nextBtn.style.display = '';
    } else {
        nextBtn.textContent = 'Submit Answer';
        nextBtn.style.display = selectedAnswer === null ? 'none' : '';
    }
}

// Calculate and display results
function showResults() {
    const correctAnswers = answers.filter((answer, index) => 
        answer === currentQuestions[index].correctAnswer
    ).length;
    
    const percentage = (correctAnswers / currentQuestions.length) * 100;
    let feedback = '';
    
    if (percentage >= 90) {
        feedback = 'Excellent! You have mastered this topic!';
    } else if (percentage >= 70) {
        feedback = 'Good job! You have a solid understanding.';
    } else if (percentage >= 50) {
        feedback = 'Fair performance. Keep practicing!';
    } else {
        feedback = 'You might want to review the material and try again.';
    }

    questionText.innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>You scored ${correctAnswers} out of ${currentQuestions.length} (${percentage.toFixed(1)}%)</p>
        <p>${feedback}</p>
    `;
    
    options.forEach(option => option.style.display = 'none');
    explanationText.style.display = 'none';
    prevBtn.style.display = 'none';
    shuffleBtn.style.display = 'none';
}

// Handle option selection
options.forEach((option, index) => {
    option.addEventListener('click', () => {
        if (isAnswered || isQuizComplete) return;
        
        // Get the original index from the data attribute
        selectedAnswer = parseInt(option.dataset.originalIndex);
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        updateButtons();
    });
});

// Handle next/submit button click
nextBtn.addEventListener('click', () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = currentQuestions[currentIndex];
    
    if (!isAnswered) {
        // First click - Submit Answer
        answers[currentIndex] = selectedAnswer;
        isAnswered = true;
        
        // Disable all options after answering
        options.forEach(option => option.disabled = true);
        
        // Show the correct/incorrect feedback
        options.forEach((option, index) => {
            const originalIndex = parseInt(option.dataset.originalIndex);
            if (originalIndex === selectedAnswer) {
                if (selectedAnswer === currentQuestion.correctAnswer) {
                    option.classList.add('correct');
                } else {
                    option.classList.add('incorrect');
                }
            }
            if (originalIndex === currentQuestion.correctAnswer && originalIndex !== selectedAnswer) {
                option.classList.add('correct');
            }
        });
        
        // Show the explanation
        explanationText.textContent = currentQuestion.explanation;
        
        updateButtons();
    } else if (currentIndex === currentQuestions.length - 1 && !isQuizComplete) {
        // Submit Quiz
        isQuizComplete = true;
        showResults();
        updateButtons();
    } else if (isQuizComplete) {
        // Restart quiz
        currentIndex = 0;
        selectedAnswer = null;
        answers = new Array(questionBank.length).fill(null);
        isAnswered = false;
        isQuizComplete = false;
        options.forEach(option => {
            option.style.display = '';
            option.disabled = false;
        });
        explanationText.style.display = '';
        prevBtn.style.display = '';
        shuffleBtn.style.display = '';
        updateQuestion();
        updateButtons();
    } else {
        // Next question
        currentIndex++;
        selectedAnswer = null;
        isAnswered = false;
        updateQuestion();
        updateButtons();
    }
});

// Handle previous button click
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0 && !isQuizComplete) {
        currentIndex--;
        selectedAnswer = answers[currentIndex];
        isAnswered = answers[currentIndex] !== null;
        updateQuestion();
        updateButtons();
    }
});

// Handle shuffle button click
shuffleBtn.addEventListener('click', () => {
    if (isQuizComplete) return;
    currentQuestions = [...questionBank].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    selectedAnswer = null;
    answers = new Array(questionBank.length).fill(null);
    isAnswered = false;
    updateQuestion();
    updateButtons();
});

// Add event listener for parse questions button
document.getElementById('parse-questions').addEventListener('click', parseBulkQuestions);

function parseBulkQuestions() {
    const textarea = document.getElementById('bulk-questions');
    const text = textarea.value.trim();
    
    // Split text into individual questions
    const questionBlocks = text.split(/\n\s*\n/).filter(block => block.trim());
    
    // Clear existing questions
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';
    
    questionBlocks.forEach(block => {
        const lines = block.split('\n').map(line => line.trim()).filter(line => line);
        
        // Extract question
        const questionMatch = lines[0].match(/^\d+\.\s*(.+)$/);
        if (!questionMatch) return;
        const question = questionMatch[1];
        
        // Extract options and correct answer
        const options = [];
        let correctOption = '';
        lines.slice(1).forEach(line => {
            if (line.startsWith('Explanation:')) return;
            const optionMatch = line.match(/^([A-D])\)\s*(.+?)(?:\s*\*)?$/);
            if (optionMatch) {
                options.push(optionMatch[2].trim());
                if (line.includes('*')) {
                    correctOption = optionMatch[1];
                }
            }
        });
        
        // Extract explanation
        const explanationMatch = lines.find(line => line.startsWith('Explanation:'));
        const explanation = explanationMatch ? explanationMatch.replace('Explanation:', '').trim() : '';
        
        // Create question element
        const questionElement = createParsedQuestionElement(question, options, correctOption, explanation);
        questionsContainer.appendChild(questionElement);
    });
}

function createParsedQuestionElement(question, options, correctOption, explanation) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    
    // Question input
    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.value = question;
    questionInput.placeholder = 'Enter your question';
    questionDiv.appendChild(questionInput);
    
    // Options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'option-inputs';
    
    // Add options
    options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-input';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `correct-${Date.now()}`;
        radio.value = String.fromCharCode(65 + index);
        if (radio.value === correctOption) radio.checked = true;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = option;
        input.placeholder = `Option ${String.fromCharCode(65 + index)}`;
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(input);
        optionsContainer.appendChild(optionDiv);
    });
    
    // Add explanation input
    const explanationInput = document.createElement('input');
    explanationInput.type = 'text';
    explanationInput.value = explanation;
    explanationInput.placeholder = 'Enter explanation';
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-question';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = () => questionDiv.remove();
    
    questionDiv.appendChild(deleteBtn);
    questionDiv.appendChild(questionInput);
    questionDiv.appendChild(optionsContainer);
    questionDiv.appendChild(explanationInput);
    
    return questionDiv;
}

// Load saved question banks from localStorage
function loadSavedBanks() {
    const savedBanks = JSON.parse(localStorage.getItem('questionBanks') || '{}');
    bankSelector.innerHTML = '<option value="">Select a question bank</option>';
    
    Object.keys(savedBanks).forEach(bankName => {
        const option = document.createElement('option');
        option.value = bankName;
        option.textContent = bankName;
        bankSelector.appendChild(option);
    });
}

// Save current question bank
saveBankBtn.addEventListener('click', () => {
    const bankName = bankNameInput.value.trim();
    if (!bankName) {
        alert('Please enter a name for the question bank');
        return;
    }
    
    // Get current questions from the settings panel
    saveQuestionsFromSettings();
    
    // Save to localStorage
    const savedBanks = JSON.parse(localStorage.getItem('questionBanks') || '{}');
    savedBanks[bankName] = {
        questions: questionBank,
        title: quizTitleDisplay.textContent
    };
    localStorage.setItem('questionBanks', JSON.stringify(savedBanks));
    
    // Update selector
    loadSavedBanks();
    bankNameInput.value = '';
});

// Load selected question bank
loadBankBtn.addEventListener('click', () => {
    const selectedBank = bankSelector.value;
    if (!selectedBank) {
        alert('Please select a question bank to load');
        return;
    }
    
    const savedBanks = JSON.parse(localStorage.getItem('questionBanks') || '{}');
    const bank = savedBanks[selectedBank];
    
    if (bank) {
        questionBank = bank.questions;
        quizTitleDisplay.textContent = bank.title;
        quizTitleInput.value = bank.title;
        
        // Update the questions in the settings panel
        loadQuestionsToSettings();
        
        // Reset quiz state
        currentQuestions = [...questionBank];
        currentIndex = 0;
        selectedAnswer = null;
        answers = new Array(questionBank.length).fill(null);
        isAnswered = false;
        isQuizComplete = false;
        
        // Update quiz display
        updateQuestion();
        updateButtons();
    }
});

// Delete selected question bank
deleteBankBtn.addEventListener('click', () => {
    const selectedBank = bankSelector.value;
    if (!selectedBank) {
        alert('Please select a question bank to delete');
        return;
    }
    
    if (confirm(`Are you sure you want to delete the question bank "${selectedBank}"?`)) {
        const savedBanks = JSON.parse(localStorage.getItem('questionBanks') || '{}');
        delete savedBanks[selectedBank];
        localStorage.setItem('questionBanks', JSON.stringify(savedBanks));
        loadSavedBanks();
    }
});

// Initialize saved banks when page loads
loadSavedBanks();

// Initialize the quiz when the page loads
initQuiz(); 