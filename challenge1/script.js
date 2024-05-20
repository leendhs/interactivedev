const questions = [
    { vraag: "Hoeveel dagen heeft een normaal jaar?", antwoord: "365" },
    { vraag: "Bij welke sport rijden ze meer dan 300 kilometer per uur?", antwoord: "formule 1" },
    { vraag: "Welk dier is bekend om zijn lange nek?", antwoord: "giraffe" },
    { vraag: "Welke drank wordt traditioneel gemaakt van gefermenteerde druiven?", antwoord: "wijn" }
    // Voeg hier meer vragen toe
];

let currentQuestionIndex = 0;

const questionElement = document.getElementById('question');
const feedbackElement = document.getElementById('feedback');
const startListeningButton = document.getElementById('startListening');
const skipQuestionButton = document.getElementById('skipQuestion');

const recognition = new webkitSpeechRecognition();
recognition.lang = 'nl-NL';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const displayQuestion = () => {
    if (currentQuestionIndex < questions.length) {
        questionElement.textContent = questions[currentQuestionIndex].vraag;
        speakQuestion(); // Lees de vraag voor
        feedbackElement.textContent = '';
    } else {
        completeQuiz();
    }
};

const speakQuestion = () => {
    const textToSpeak = questions[currentQuestionIndex].vraag;
    const msg = new SpeechSynthesisUtterance();
    msg.text = textToSpeak;
    msg.lang = 'nl-NL';
    window.speechSynthesis.speak(msg);
};


const checkAnswer = (spokenAnswer) => {
    feedbackElement.textContent = `Je antwoordde: "${spokenAnswer}". `;
    if (spokenAnswer.trim().toLowerCase() === questions[currentQuestionIndex].antwoord) {
        feedbackElement.textContent += 'Goed bezig!';
        feedbackElement.style.color = 'green'; // Groene tekstkleur toevoegen voor een juist antwoord

        // Na 3 seconden ga naar de volgende vraag
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++; // Verplaats naar de volgende vraag als er nog vragen zijn
                displayQuestion(); // Weergeef de volgende vraag
            } else {
                completeQuiz(); // Voltooi de quiz als alle vragen zijn beantwoord
            }
        }, 2000);
    } else {
        feedbackElement.textContent += 'Misschien toch nog eens opnieuw proberen...';
        feedbackElement.style.color = 'red'; // Rode tekstkleur toevoegen voor een fout antwoord

        // Stel de knoppen weer in staat om opnieuw te luisteren naar een antwoord
        startListeningButton.disabled = false;
        skipQuestionButton.disabled = false;
    }
};


const completeQuiz = () => {
    questionElement.textContent = 'Quiz voltooid!';
    feedbackElement.textContent = '';
    startListeningButton.disabled = true;
    skipQuestionButton.disabled = true;
};


startListeningButton.addEventListener('click', () => {
    startListeningButton.disabled = true;
    skipQuestionButton.disabled = true;
    recognition.start();
});

skipQuestionButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        completeQuiz();
    }
});

recognition.onresult = (event) => {
    const spokenAnswer = event.results[event.results.length - 1][0].transcript;
    checkAnswer(spokenAnswer);
};

recognition.onend = () => {
    if (currentQuestionIndex < questions.length) {
        startListeningButton.disabled = false;
        skipQuestionButton.disabled = false;
    } else {
        completeQuiz();
    }
};

displayQuestion();
