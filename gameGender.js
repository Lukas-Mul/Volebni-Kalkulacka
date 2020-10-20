const resetButton = document.createElement("button")
resetButton.className = "resetButton";
resetButton.innerText = "Zpátky na začátek";
let body = document.getElementsByTagName("body")[0];
body.appendChild(resetButton);
resetButton.addEventListener("click", function() {
    return window.location.assign("./index.html");
});

(function() {
  var idleDurationSecs = 120;
  var redirectUrl = './index.html';  // Redirect idle users to this URL
  var idleTimeout;

  var resetIdleTimeout = function() {
    if(idleTimeout) clearTimeout(idleTimeout);

    idleTimeout = setTimeout(function(){
      location.href = redirectUrl
    }, idleDurationSecs * 1000);
  };

  resetIdleTimeout();

  ['click', 'touchstart', 'mousemove'].forEach(function(evt) {
    document.addEventListener(evt, resetIdleTimeout, false)
  });
})();



const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questionIndex = 0;

// OTAZKY
let questions = [
  {
    question: "Jste žena?",
    choice1: "Ano",
    choice2: "Ne",
    // choice3: "<js>",
    // choice4: "<scripting>",
    answer: 0,
  }
];

// FUNKCE
startGame = () => {
  availableQuestions = [...questions];
  getNewQuestion();
};



//NOVA OTAZKA
getNewQuestion = () => {
     
  currentQuestion = availableQuestions[0];
  question.innerText = currentQuestion.question; //ta question na leve strane znaci ten div s tou otazkou. priradim k ni innerText, ktery si js najde tak, ze pujde podle currentQuestion a vezme si property question z te currentQuestion.

  choices.forEach((choice) => {
    const number = choice.dataset["number"]; //tohle vezme to cislo z toho datasetu v html
    choice.innerText = currentQuestion["choice" + number]; //tomu parametru choice to priradi innerText, ktery je v currentQuestion["choice" + number]. Tohle znamena vlastne choice1, choice2 apod.
  });
  acceptingAnswers = true; //tohle umozni odpovidat na otazky az tehdy, kdyz bylo vsechno nacteno (proto je na zacatku dana hodnota false)
};

// DOSTAT NOVOU OTAZKU A POCITANI BODU
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    //kdyz kliknou na tu odpoved, tak tohle mi da reference na to, na co vlastne klikli
    if (!acceptingAnswers) return; //jestli jeste neakceptujeme odpoved, tak to budeme ignorovat

    acceptingAnswers = false; // tohle vytvori male zpozdeni, nechceme, aby na to hned kliknuli
    const selectedChoice = e.target; //timhle vyselektuju volbu, na kterou klikli
    const selectedAnswer = selectedChoice.dataset["number"]; //timhle vyselektuju odpoved, kterou ta zvolena odpoved obsahuje

    // PRESMEROVANI
    function countPoints() {
      // OTAZKA 0
      if (currentQuestion.answer == 0 && selectedAnswer == 1) {
        return window.location.assign("./zena.html");
            }
      if (currentQuestion.answer == 0 && selectedAnswer == 2) {
        return window.location.assign("./muz.html");
      }
    }
    countPoints();

    setTimeout(() => {
      getNewQuestion();
    }, 100);
    
  });
});

startGame();

