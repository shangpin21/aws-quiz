document.addEventListener('DOMContentLoaded', () => {
    const answerButtons = document.getElementById('answer-buttons');
    let currentQuestionIndex = -1;
    let questions = [];
    let questionHistory = [];
    let selectedAnswers = [];
    let twoanswers = false;
    let threeanswers = false;
    let totalScore = 0;
    let currentScore = 0;
    

    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            switch (document.title) {
                case "Module 2":
                    questions = data.quizzes[1].questions; // Select questions for Module 2
                    break;
                case "Module 3":
                    questions = data.quizzes[2].questions; // Select questions for Module 3
                    console.log(questions);
                    break;
                case "Module 4":
                    questions = data.quizzes[3].questions; // Select questions for Module 4
                    break;
                case "Module 5":
                    questions = data.quizzes[4].questions; // Select questions for Module 5
                    break;
                case "Module 6":
                    questions = data.quizzes[5].questions; // Select questions for Module 6
                    break;
                case "Module 7":
                    questions = data.quizzes[6].questions; // Select questions for Module 7
                    break;
                case "Module 8":
                    questions = data.quizzes[7].questions; // Select questions for Module 8
                    break;
                case "Module 9":
                    questions = data.quizzes[8].questions; // Select questions for Module 9
                    break;
                case "Module 10":
                    questions = data.quizzes[9].questions; // Select questions for Module 10
                    break;
                case "Mock Exam":
                    questions = data.quizzes[10].questions; // Select questions for Mock Exam
                    break;
                default:
                    questions = data.quizzes[0].questions; // Default to the first set of questions
            }
    
                    document.getElementById('start-quiz-btn').addEventListener('click', () => {
                        document.querySelector('.intro').style.display = 'none';
                        document.querySelector('.app').style.display = 'block';
                        loadNextQuestion();
                    });
                })
                .catch(error => console.error('Error loading quiz data:', error));

    document.getElementById('next-btn').addEventListener('click', loadNextQuestion);
    console.log('Question History:', questionHistory);

    function loadNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * questions.length);
            } while (questionHistory.includes(randomIndex));

            currentQuestionIndex++;
            questionHistory.push(randomIndex);
            console.log('Question History:', questionHistory); // Print the question history
            const question = questions[randomIndex];
            displayQuestion(question);
        }else{
            showScore();
        }
    }

    function displayQuestion(question) {
        resetState();
        currentScore = 0;
        document.getElementById('question_no').innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        document.getElementById('question').innerText = question.question_text;

        question.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.classList.add("btn");
            answerButtons.appendChild(button);
            answerButtons.children[index].innerText = option.option_text;
            if (Array.isArray(question.correct_answer_id)) {
                if (question.correct_answer_id.includes(option.option_id) && question.correct_answer_id.length == 2) {
                    twoanswers = true;
                    button.dataset.correct = true;
                    button.dataset.selectTwo = true;
                }
                if (question.correct_answer_id.includes(option.option_id) && question.correct_answer_id.length == 3) {
                    threeanswers = true;
                    button.dataset.correct = true;
                    button.dataset.selectThree = true;
                }
            } else {
                if (question.correct_answer_id == option.option_id) {
                    button.dataset.correct = true;
                }
            }
            button.addEventListener("click", selectAnswer);
            
            
        });

        // Hide unused buttons
        for (let i = question.options.length; i < answerButtons.length; i++) {
            answerButtons[i].style.display = 'none';
        }
    }
    function showScore(){
        resetState();
        const resultMessage = totalScore >= 0.7 * questions.length ? "You have passed!" : "You have failed!";
        const resultClass = totalScore >= 0.7 * questions.length ? "pass" : "fail";
        document.getElementById('question_no').innerText = `Your Score`;
        document.getElementById('question').innerText = `You scored ${totalScore} out of ${questions.length}`;
        document.getElementById('result').classList.add(resultClass);
        document.getElementById('result').innerText = resultMessage;
        document.getElementById('next-btn').innerHTML = "Restart Quiz";
        document.getElementById('next-btn').style.display = "block";
        document.getElementById('next-btn').addEventListener('click', restartQuiz);
        
    }
    function restartQuiz() {
        // Reset variables
        currentQuestionIndex = -1;
        questionHistory = [];
        totalScore = 0;

        // Remove event listener to prevent multiple bindings
        document.getElementById('next-btn').removeEventListener('click', restartQuiz);
        document.getElementById('next-btn').innerText = "Next";
        document.getElementById('result').innerText = "";
        
        // Load the first question
        loadNextQuestion();
    }


    function resetState(){
        document.getElementById('next-btn').style.display = "none";
        while(answerButtons.firstChild){
            answerButtons.removeChild(answerButtons.firstChild);
        }
        twoanswers = false;
        threeanswers = false;
        selectedAnswers = [];
    }

    function selectAnswer(e){
        console.log("Total Score: " + totalScore);
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct;
        if(isCorrect){
            selectedBtn.classList.add("correct");
            selectedAnswers.push(e);
            currentScore++;
        }else{
            selectedBtn.classList.add("incorrect");
            selectedAnswers.push(e);
        }
    
    Array.from(answerButtons.children).forEach(button => {
        console.log(threeanswers);

        if(selectedAnswers.length == 3 && threeanswers == true && twoanswers == false){
            if(button.dataset.correct === "true" && button.dataset.selectThree === "true"){
                button.classList.add("correct");
            }
        }
        if(selectedAnswers.length < 2 && twoanswers == false && threeanswers == false){
            if(button.dataset.correct === "true"){
                button.classList.add("correct");
            } 
        }
        if(selectedAnswers.length == 2 && twoanswers == true){
            if(button.dataset.correct === "true" && button.dataset.selectTwo === "true"){
                button.classList.add("correct");
            }
        }
        if(twoanswers == true){
            if(selectedAnswers.length == 2){
                button.disabled = true;
            }
        }

        if(threeanswers == true) {
            if(selectedAnswers.length == 3){
                button.disabled = true;
            }
        }

        if(twoanswers == false && threeanswers == false){
            button.disabled = true;
        }
               
    });

        console.log("Current Score = " + currentScore);
        console.log("Selected answers length: " + selectedAnswers.length);
        if( twoanswers == true && selectedAnswers.length == 2){
            if(currentScore < 2){
                currentScore = 0;
            }else{
                currentScore = 1;
            }
            totalScore += currentScore;
            document.getElementById('next-btn').style.display = "block";
        }

        if( threeanswers == true && selectedAnswers.length == 3){
            if(currentScore < 3){
                currentScore = 0;
            }else{
                currentScore = 1;
            }
            totalScore += currentScore;
            document.getElementById('next-btn').style.display = "block";
        }

        if(selectedAnswers.length > 0 && twoanswers == false){
            totalScore += currentScore;
            document.getElementById('next-btn').style.display = "block";
        }
        
    }
});
