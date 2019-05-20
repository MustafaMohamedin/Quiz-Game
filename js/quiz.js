
let correctAnswer;
let correctNumber = (localStorage.getItem('quiz_game_correct') ? localStorage.getItem('quiz_game_correct') : 0);
let incorrectNumber = (localStorage.getItem('quiz_game_incorrect') ? localStorage.getItem('quiz_game_incorrect') : 0);
document.addEventListener('DOMContentLoaded' , function(){
 
  loadQuestion();

  eventListener();
});

eventListener = () => {
  document.querySelector('#select-answer').addEventListener('click' , validateAnswer);

  // Clear the results 
  document.querySelector('#clear-storage').addEventListener('click' , clearResult);

}

// Load a new  Question from an API
   loadQuestion = () => {
     
    const url = 'https://opentdb.com/api.php?amount=1&category=18&difficulty=easy';

       fetch(url)
       .then( data => data.json())
       .then(result => displayQuestion(result.results));
   }

  //  Displays the Question HTML from API
       displayQuestion =  questions => {

            // Create the HTML questions
            const  questionHTML = document.createElement('div');
            questionHTML.classList.add('col-12');

            // loop through the questions
            questions.forEach(question => {

              // Read the correct answer
              correctAnswer = question.correct_answer;

              // Add the HTML for the Current question
              questionHTML.innerHTML = `
                 <div class = " row justify-content-between heading">
                      <p class = "category"> Category : ${question.category}</p>
                  <div class= "row">
                     <span class = "badge badge-success">${correctNumber}</span>
                     <span class = "badge badge-danger">${incorrectNumber}</span>
                  </div>
                 </div>
                 <h2 class = "text-center"> ${question.question} </h2>
              
              `;

              // Inject the correct answer into the possible answers
              let possibleAnswers = question.incorrect_answers;
              possibleAnswers.splice( Math.floor ( Math.random() * 3 ) ,0,correctAnswer);
                
              // Genetate the HTML for the possible Answers
              const answerDiv = document.createElement('div');
              answerDiv.classList.add('questions' , 'row' , 'justify-content-around' , 'mt-4');

              possibleAnswers.forEach( answer => {
                  const answerHTML = document.createElement('li');
                  answerHTML.classList.add('col-12' , 'col-md-5');
                  answerHTML.textContent = answer;

                  // Attach an Event click when the answer is selected
                  answerHTML.onclick = selectAnswer;
                  // append to the answerDiv
                  answerDiv.appendChild(answerHTML);

              });
                questionHTML.appendChild(answerDiv);

                // Render in the HTML
                document.querySelector('#app').appendChild(questionHTML);

            })

            
       }

      //  When the answer is selected 
      selectAnswer = (e) => {

        // Remove the previous active class from the answer
        if(document.querySelector('.active')){
          const activeAnswer = document.querySelector('.active');
          activeAnswer.classList.remove('active');
        }
        // Adds the active to the current answer
        e.target.classList.add('active');
      }


      //  Checks the answer is correct, and 1 answer is selected
      validateAnswer = () => {
        
        if(document.querySelector('.questions .active')){
          // Everthing is fine , check if the answer is correct or not
            checkAnswer();

        }else{
          // Error , the user didn't select anything
          const errorDiv = document.createElement('div');
          errorDiv.classList.add('alert' , 'alert-warning' , 'col-md-6');
          errorDiv.textContent = 'Please Selecet 1 answer';
          // Select the div question to insert the error div
          const questionDiv = document.querySelector('.questions');
          questionDiv.appendChild(errorDiv);

          // Remove the alert warning after 2 seconds
          setTimeout(() => {
              document.querySelector('.alert-warning').remove();
          }, 2000);

        }
          
        
      }

      // Check if the answer is correct or not
      checkAnswer = () => {
       const userAnswer =  document.querySelector('.questions .active');
       
        if(userAnswer.textContent === correctAnswer ){
            correctNumber++;
        }else {
          incorrectNumber++;
        }

        // Save into localStorage
        saveIntoStorage();

        // Clear the previous question
          const app = document.querySelector('#app');
          while(app.firstChild){
            app.removeChild(app.firstChild);
          }

          // Load a new question
          loadQuestion();

      }

      // Saves the correct and incorrect answers into local Storage
      saveIntoStorage = () => {
        localStorage.setItem('quiz_game_correct' , correctNumber);
        localStorage.setItem('quiz_game_incorrect' , incorrectNumber);
      }
  
      // Clears the Results correct and incorrect answers
      clearResult = () => {
        localStorage.setItem('quiz_game_correct' , 0);
        localStorage.setItem('quiz_game_incorrect' , 0);

        setTimeout(() => {
           window.location.reload();
        }, 500);

      }