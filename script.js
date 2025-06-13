// Get references to HTML elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.querySelector('#chatbox button'); // Select the button inside chatbox

// --- Chat Display Functions ---

// Function to add a message to the chat display
function addMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender); // Add 'message' and 'bot' or 'user' class
    messageDiv.innerHTML = message; // Use innerHTML to allow for line breaks and basic formatting
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
}

// --- Chatbot Logic ---

// Define your questions with options
const questions = [
    {
        id: 'start',
        question: "Hello! Welcome to Know Course (v2). We'll find the best course for you after you answer a few questions... Let's begin.<br> Q. what is your interest? <br>",
        options: [
            { text: "1. Technology & Coding <br>", value: "tech" },
            { text: "2. Arts & Crafts <br>", value: "arts" },
            { text: "3. Science & Research <br>", value: "science" },
            { text: "4. Business & Commerce <br>", value: "management " },
            { text: "5. Health & Medical <br>", value: "health" },
            { text: "6.  Humanity & Social Serives <br>", value: "social" },
            {text: "7. Teaching & Education <br>", value: "teach" },
             {text: "8. Sports <br>", value: "sports" },
              {text: "9. Theatrical Arts <br>", value: "acting" }
        ],
        nextQuestion: 'learning_style' // The next question to ask after this one
    },
    {
        id: 'learning_style',
        question: "How do you prefer to learn?<br>",
        options: [
            { text: "1. Projects and practical work <br>", value: "practical" },
            { text: "2. Reading, lectures, and theory study <br>", value: "theoretical" },
            { text: "3. Group discussions and group works <br>", value: "group" },
            { text: "4. learning by mimicing seniors <br>", value: "visual" }
        ],
        nextQuestion: 'problem_solving'
    },
    {
        id: 'problem_solving',
        question: "What kind of problems do you enjoy solving?<br>",
        options: [
            { text: "1. Abstract logical puzzles and coding challenges <br>", value: "abstract_logic" },
            { text: "2. Creative design problems and aesthetic challenges <br>", value: "creative_design" },
            { text: "3. Real-world scientific or mathematical problems <br>", value: "scientific_math" },
            { text: "4. Business strategy and organizational challenges <br>", value: "business_strategy" },
            { text: "5. Human health issues and patient care <br>", value: "health_care" },
            { text: "6. Society issues and problems <br>", value: "societal_human" }
        ],
        nextQuestion: 'work_environment'
    },
    {
        id: 'work_environment',
        question: "What kind of work environment do you prefer?<br>",
        options: [
            { text: "1. Dynamic, alone or small team <br>", value: "dynamic_innovative" },
            { text: "2. Expressive, grouping, studio-based <br>", value: "expressive_collaborative" },
            { text: "3. Study, laboratory-based, research-related <br>", value: "structured_research" },
            { text: "4. office, fast-paced, client-facing <br>", value: "corporate_client" },
            { text: "5. Clinic, medicines, patient-focused <br>", value: "clinical_patient" },
            { text: "6. Field-based, community-oriented, environment <br>", value: "field_community" }
        ],
        nextQuestion: null // null indicates this is the last question before analysis
    }
    // Add more questions here as needed for a more robust analysis
];

let currentQuestionIndex = 0;
const userAnswers = {}; // Object to store user's answers

// Function to ask the current question
function askQuestion() {
    if (currentQuestionIndex < questions.length) {
        const q = questions[currentQuestionIndex];
        let questionText = q.question + "\n\n" + q.options.map(opt => opt.text).join("\n");
        addMessage('bot', questionText);
    } else {
        // All questions asked, time to analyze
        addMessage('bot', "Thank you for the answers...");
        analyzeAnswers();
    }
}

// Function to handle user's message
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage('user', message); // Display user's message

    // Process user's answer
    processAnswer(message);

    userInput.value = ''; // Clear input field
}

// Function to process the user's answer
function processAnswer(answer) {
    if (currentQuestionIndex >= questions.length) {
        // If all questions are answered, don't process further answers as questions
        // This might be a follow-up interaction or restart prompt
        return;
    }

    const currentQ = questions[currentQuestionIndex];
    let validAnswer = false;

    // Check if the answer is a valid option (by number or text)
    const option = currentQ.options.find(opt =>
        opt.text.startsWith(answer + '.') || // By number (e.g., "1")
        opt.text.toLowerCase().includes(answer.toLowerCase()) || // By partial text match
        opt.value === answer // By value (if we ever allow direct value input)
    );

    if (option) {
        userAnswers[currentQ.id] = option.value;
        validAnswer = true;
    } else {
        addMessage('bot', "Please choose a number from the given options!");
        // Don't advance the question if the answer is invalid
        return;
    }

    if (validAnswer) {
        currentQuestionIndex++;
        // Ask the next question after a short delay for better user experience
        setTimeout(() => {
            askQuestion();
        }, 500);
    }
}

// --- Analysis Function (Placeholder) ---
function analyzeAnswers() {
    let recommendation = "Here are some best courses for you...";
    let scores = {
        "tech": 0,
        "arts": 0,
        "science": 0,
        "management": 0,
        "health": 0,
        "social": 0,
        "teach": 0,
        "sports": 0,
        "acting": 0
    };

    // Example scoring logic (you'll expand this significantly)
    // Map answers to scores for each course category
    for (const qId in userAnswers) {
        const answer = userAnswers[qId];
        switch (qId) {
            case 'start':
                if (answer === 'tech') scores.tech += 3;
                else if (answer === 'arts') scores.arts += 3;
                else if (answer === 'science') scores.science += 3;
                else if (answer === 'management') scores.management += 3;
                else if (answer === 'health') scores.health += 3;
                else if (answer === 'social') scores.social += 3;
                else if (answer === 'teach') scores.teach += 3;
                else if (answer === 'sports') scores.sports += 3;
                else if (answer === 'acting') scores.acting += 3;
                break;
            case 'learning_style':
                if (answer === 'practical') { scores.tech += 1; scores.arts += 1; }
                else if (answer === 'theoretical') { scores.science += 1; scores.teach += 1; }
                else if (answer === 'group') { scores.management += 1; scores.social += 1; }
                else if (answer === 'visual') { scores.acting += 1; scores.sports += 1; }
                break;
            case 'problem_solving':
                if (answer === 'abstract_logic') {scores.tech += 2; scores.science += 2; scores.teach += 2;}
                else if (answer === 'creative_design') {scores.arts += 2; scores.acting += 2;}
                else if (answer === 'scientific_math') {scores.science += 2; scores.tech += 2;}
                else if (answer === 'business_strategy') {scores.management += 2;}
                else if (answer === 'health_care') {scores.health += 2;}
                else if (answer === 'societal_human') {scores.social += 2;}
                break;
            case 'work_environment':
                if (answer === 'dynamic_innovative') {scores.tech += 1.5; scores.science += 1.5;}
                else if (answer === 'expressive_collaborative') {scores.arts += 1.5; scores.social += 1.5; scores.acting += 1.5;}
                else if (answer === 'structured_research') {scores.science += 1.5; scores.teach += 1.5;}
                else if (answer === 'corporate_client') {scores.management += 1.5;}
                else if (answer === 'clinical_patient') {scores.health += 1.5;}
                else if (answer === 'field_community') {scores.social += 1.5; scores.sports += 1.5;}
                break;
            // Add more cases for other questions
        }
    }

    // Determine the top recommendation
    let bestCourse = '';
    let maxScore = -1;
    let recommendedCategory = '';

    for (const category in scores) {
        if (scores[category] > maxScore) {
            maxScore = scores[category];
            recommendedCategory = category;
        }
    }

    // Convert category ID to a more user-friendly name and provide specific course examples
    switch (recommendedCategory) {
        case 'tech':
            recommendation += "\n\n Consider courses like Computer Science, Software Engineering, Data Science, Web Development, or Cybersecurity.";
            break;
        case 'arts':
            recommendation += "\n\n Look into courses like Graphic Design, Fine Arts, Fashion Design, Architecture, or Digital Media.";
            break;
        case 'science':
            recommendation += "\n\n Fields like Physics, Chemistry, Biology, Environmental Science, or Mathematics might be a great fit.";
            break;
        case 'management':
            recommendation += "\n\n Explore courses such as Business Administration, Marketing, Finance, Human Resources, or Entrepreneurship.";
            break;
        case 'health':
            recommendation += "\n\n Consider paths like Medicine, Nursing, Pharmacy, Public Health, or Physical Therapy.";
            break;
        case 'social':
            recommendation += "\n\n Areas like Psychology, Sociology, Political Science, History, or Literature could be for you.";
            break;
        case 'teach':
            recommendation += "\n\n Explore fields like B.Sc, B.Com., B.A., and study your fav. subject ";
           break; 
           case 'sports':
            recommendation += "\n\n Run, play, jump. Drain your energy in the fields. You can be the next athlete and bring medals for your nation.";
            break;
               case 'acting':
            recommendation += "\n\n Your interest are mostly on acting, dancing, singing, comedy, and other theatre related things. Go for it, follow your passion nobody knows what the universe have reserved for you!";
            break;
     default:
    recommendation += "\n\n We wish you a bright future ahead.";
    break;
}


    addMessage('bot', recommendation);
    // You might want to disable input or offer a "restart" option here
    userInput.disabled = true;
    sendButton.disabled = true;
}


// --- Event Listeners ---

// Listen for clicks on the send button
sendButton.addEventListener('click', sendMessage);

// Listen for Enter key press in the input field
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Initial greeting and first question when the page loads
document.addEventListener('DOMContentLoaded', askQuestion);
