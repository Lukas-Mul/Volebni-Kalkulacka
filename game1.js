const timeoutSign = document.querySelector(".timeoutSign");

// IDLE TIMEOUT - na nabidku, jestli bude pokracovat
(function() {
  const idleDurationSecs = 110;
  let redirectUrl = './index.html';  // Redirect idle users to this URL
  let idleTimeout;
  let resetIdleTimeout = function() {
    if(idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(function(){
      // location.href = redirectUrl
      overlay2.classList.remove("hideOverlay2");
      timeoutSign.classList.remove("hideTimeoutSign");
      let timeleft = 9;
      let downloadTimer = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(downloadTimer);
        document.querySelector(".timer").innerHTML = "";
        } else {
        document.querySelector(".timer").innerHTML = timeleft;
        }
        timeleft -= 1;
      }, 1000);
    }, idleDurationSecs * 1000);
  };
  resetIdleTimeout();
  ['click', 'touchstart', 'mousemove'].forEach(function(evt) {
    document.addEventListener(evt, resetIdleTimeout, false)
  });
})();

// IDLE TIMEOUT - na presmerovani na zacatek
(function() {
  const idleDurationSecs = 120;
  let redirectUrl = './index.html';  // Redirect idle users to this URL
  let idleTimeout;
  let resetIdleTimeout = function() {
    if(idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(function(){
      location.href = redirectUrl
      // timeoutSign.classList.remove("hideTimeoutSign");
    }, idleDurationSecs * 1000);
  };
  resetIdleTimeout();
  ['click', 'touchstart', 'mousemove'].forEach(function(evt) {
    document.addEventListener(evt, resetIdleTimeout, false)
  });
})();


let strany = 0;
const allDivs = document.querySelectorAll(".parties-container div");


//CONSTANTS
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const party = document.querySelectorAll(".parties-text");
const questionContainer = document.querySelector(".question-container");
const containerIntro = document.querySelector(".container-intro");
const explanation1 = document.querySelector("#explanation1");
const explanation2 = document.querySelector("#explanation2");
const explanation1Flex = document.getElementById("explanation1-flex");
const explanation2Flex = document.getElementById('explanation2-flex');
const MAX_QUESTIONS = 12;
const progressBarFull = document.getElementById('progressBarFull');
const overlay = document.getElementById("overlay");
const overlay2 = document.getElementById("overlay2");
const restartDiv = document.querySelector(".restartDiv");
const continueDiv = document.querySelector(".continue");
const changingPartiesDiv = document.querySelector(".changingTextParties");
const partiesContainerDiv = document.querySelector(".parties-container");
const lastResetButtonDiv = document.querySelector(".lastResetButtonDiv");

// VARIABLES
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questionIndex = 0;

// PARTIES
let cssd = 0;
let agr = 0;
let kler = 0;
let mladStar = 0;
let cstpd = 0;

// const parties = [
//   {

//   }
// ]

// OTAZKY - TEXT
let questions = [
{
  question: "1)	Jste žena?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 0,
},
{
  question:
    "Souhlasíte s tím, že bylo zavedeno všeobecné volební právo? Volit budou moci nyní všichni muži starší 24 let a do parlamentu mohou být zvoleni, když dovrší 30 let věku. Končí omezení volebního práva majetkem nebo původem. ?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 1,
},
{
  question:
    "2)	Souhlasíte se zavedením volebního práva pro ženy? Ne všichni jsou spokojeni, že bylo zavedeno pouze pro muže. Jste tedy pro radikální rozšíření volebního práva? ?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 2,
},
{
  question:
    "3)	Hlavním bodem programu musí být hájení národních zájmů! Vše ostatní je podřízeno co největší národní samostatnosti uvnitř monarchie.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 3,
},
{
  question:
    "4)	Česká politika byla dlouhá léta v pasivitě. Během následné aktivní politiky měla zastoupení i v rakouských vládách. Je zde široké pole možností. Můžete preferovat spolupráci s Vídní i na vládní úrovni nebo se naopak radikálně vymezovat a odmítat vstup do vlády. Jste pro, aby měla česká politika zastoupení v rakouské vládě, máme mít ve Vídni své ministry?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 4,
},
{
  question:
    "5)	Česká politika by měla jít cestou jednotné národní kandidátky i ve volbách. Nesmíme se štěpit do stranických zájmů.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 5,
},
{
  question:
    "6)	Pro českou politiku jsou klíčové hospodářské zájmy. Jde o co největší autonomii v oblasti rozvoje průmyslu a venkova.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 6,
},
{
  question:
    "7)	Česká politika potřebuje jednoznačného vůdce a charismatickou osobnost v čele. Jednoznačným vůdcem národa je Karel Kramář!",
  choice1: "Ano",
  choice2: "Ne",
  answer: 7,
},
{
  question:
    "8)	Důležitou součástí programu českých stran musí být i zájem o Slovensko, jak píše kandidát do parlamentu, profesor pražské univerzity T. G. Masaryk!",
  choice1: "Ano",
  choice2: "Ne",
  answer: 8,
},
{
  question:
    "9)	V mezinárodní politice se Rakousko-Uhersko orientuje na Německo a Itálii. Vedle toho panují u většiny slovanských národů jisté sympatie k Rusku. Sdílíte je? Souhlasíte s tím, aby se i česká politika více přimknula k Rusku?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 9,
},
{
  question:
    "10)	Doba se mění, objevují se nové otázky a rakouská vláda neumí reagovat. Nastal čas pro nový agresivnější způsob politiky. Méně vyjednávání, více nátlaku!",
  choice1: "Ano",
  choice2: "Ne",
  answer: 10,
},
{
  question: "Který výrok je vám nejsympatičtější?",
  choice1:
    "„Chceme opatřiti osoby ku práci neschopné zavedením starobního a invalidního pojištění, pojištění vdov a sirotků.“",
  choice2: "„V boj za rovnost národů a rovnost v národě!“",
  choice3:
    "„Pošli do Vídně mnoho pravých strážců půdy a bojovníků za její zabezpečení na věčné časy!“",
  choice4:
    "„Jde nám o silnou politiku volné ruky, politiku ochotnou podporovat každou vládu, která k nám bude spravedlivá, ale politiku odhodlanou potírati každou vládu, která nevyplňuje povinnosti státu k národu českému.“",
  choice5: "“Vzdělání musí stát na tradici, hodnotách a lásce k vlasti” ",
  answer: 11,
},
{
  question: "11) Který výrok je vám nejsympatičtější?",
  choice1:
    "„Chceme opatřiti osoby ku práci neschopné zavedením starobního a invalidního pojištění, pojištění vdov a sirotků.“",
  choice2: "„V boj za rovnost národů a rovnost v národě!“",
  choice3:
    "„Pošli do Vídně mnoho pravých strážců půdy a bojovníků za její zabezpečení na věčné časy!“",
  choice4:
    "„Jde nám o silnou politiku volné ruky, politiku ochotnou podporovat každou vládu, která k nám bude spravedlivá, ale politiku odhodlanou potírati každou vládu, která nevyplňuje povinnosti státu k národu českému.“",
  choice5: "“Vzdělání musí stát na tradici, hodnotách a lásce k vlasti” ",
  answer: 11,
},
];


// RESETBUTTON vpravo nahore
const resetButton = document.createElement("button")
resetButton.className = "resetButton";
resetButton.innerText = "< RESTART";
questionContainer.appendChild(resetButton);
resetButton.addEventListener("click", function() {
    return window.location.assign("./index.html");
});

// RESETBUTTONDIV v oznamovacim okne
const resetButtonDiv = document.createElement("button")
resetButtonDiv.className = "resetButtonDiv";
resetButtonDiv.innerText = " < RESTART";
restartDiv.appendChild(resetButtonDiv);
resetButtonDiv.addEventListener("click", function() {
    return window.location.assign("./index.html");
});

// RESETBUTTON na posledni strance
const resetButtonLast = document.createElement("button")
resetButtonLast.className = "lastResetButton";
resetButtonLast.innerText = "< RESTART";
lastResetButtonDiv.appendChild(resetButtonLast);
lastResetButtonDiv.addEventListener("click", function() {
    return window.location.assign("./index.html");
});

// TLACITKO "ANO", PRO POKRACOVANI PO NECINNOSTI
const continueButton = document.createElement("button")
continueButton.className = "continueButton";
continueButton.innerText = "ANO";
continueDiv.appendChild(continueButton);
continueButton.addEventListener("click", function() {
  timeoutSign.classList.add("hideTimeoutSign");
  overlay2.classList.add("hideOverlay2");
});



// FUNKCE STARTGAME
startGame = () => {
questionCounter = 1;
score = 0;
availableQuestions = [...questions];
getNewQuestion();
};

//FUNKCE getNewQuestion
getNewQuestion = () => {
//  if (availableQuestions.length === 0) {
// }

questionCounter++
// Update the progress bar
progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;


currentQuestion = availableQuestions[1];
question.innerText = currentQuestion.question; //ta question na leve strane znaci ten div s tou otazkou. priradim k ni innerText, ktery si js najde tak, ze pujde podle currentQuestion a vezme si property question z te currentQuestion.
choices.forEach((choice) => {
  const number = choice.dataset["number"]; //tohle vezme to cislo z toho datasetu v html
  choice.innerText = currentQuestion["choice" + number]; //tomu parametru choice to priradi innerText, ktery je v currentQuestion["choice" + number]. Tohle znamena vlastne choice1, choice2 apod.
});
availableQuestions.splice(questionIndex, 1); //Tohle vyhodi tu otazku, ktera byla pouzita z obehu
acceptingAnswers = true; //tohle umozni odpovidat na otazky az tehdy, kdyz bylo vsechno nacteno (proto je na zacatku dana hodnota false)
};




// DOSTAT NOVOU OTAZKU A POCITANI BODU
choices.forEach((choice) => {
choice.addEventListener("click", (e) => {
  //kdyz kliknou na tu odpoved, tak tohle mi da reference na to, na co vlastne klikli
  if (!acceptingAnswers) return; //jestli jeste neakceptujeme odpoved, tak to budeme ignorovat

  acceptingAnswers = false; // tohle vytvori male zpozdeni, nechceme, aby na to hned kliknuli
  const selectedChoice = e.target; //timhle vyselektuju volbu, na kterou klikli
  const selectedAnswer = selectedChoice.dataset["number"]; //timhle vyselektuju odpoved, kterou ta zvolena odpoved ma
  
  // FUNKCE removeClassHidden - odstrani class hidden
  function removeClassHidden() {
    const hiddenContainer = document.querySelectorAll(".hidden");
    hiddenContainer.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.remove("hidden");
      }
    });
  }

  function removeClassHidden2() {
    const hiddenContainer2 = document.querySelectorAll(".hidden2");
    hiddenContainer2.forEach(function (item) {
      if (
        currentQuestion.answer == 11 &&
        (selectedAnswer == 1 || selectedAnswer == 2 || selectedAnswer == 3 || selectedAnswer == 4 || selectedAnswer == 5)
      ) {
        item.classList.remove("hidden2");
      }
    });
  }

  function addClassHidden3() {
    const hiddenContainer3 = document.querySelectorAll(".hidden3");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 11 &&
        (selectedAnswer == 1 || selectedAnswer == 2 || selectedAnswer == 3 || selectedAnswer == 4 || selectedAnswer == 5)
      ) {
        item.classList.add("hidden2");
      }
    });
  }



  function addClassLastQuestion() {
    const hiddenContainer3 = document.querySelectorAll("#last-answer");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-container");
      }
    });
  }

  function addClassLastQuestion1() {
    const hiddenContainer3 = document.querySelectorAll(".question-container");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-container1");
      }
    });
  }

  function addClassLastAnswer() {
    const hiddenContainer3 = document.querySelectorAll(".choice-text");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-text");
      }
    });
  }

  function addClassLastText() {
    const hiddenContainer3 = document.querySelectorAll(".choice-container");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-answer");
      }
    });
  }

  // VYTVORIT VYSVETLIVKU cislo 1 - Button 1

  function createButton1 (){
    let button1 = document.createElement("button")
    button1.className = "button1";
    button1.innerText = "Chci vědět víc"
    questionContainer.appendChild(button1)
    button1.addEventListener("click", function(){
      // add class hidden na overlay element, takze kliknutim se tam ten overlay element zobrazi a udela vsechno ostatni tmavym
      overlay.classList.remove("hidden11");
      // remove class hidden na tu vysvetlivku - oddela hidden class od te vysvetlivky, takze ta se zobrazi
      explanation1.classList.remove("hidden5");
      
    })
  }

  // VYTVORIT TLACITKO ZPET Z VYSVETLIVKY - Button 2

  function createButton2 (){
    const button2 = document.createElement("button")
    button2.className = "button2";
    button2.innerText = "Zpět k otázce"
    explanation1Flex.appendChild(button2)
    button2.addEventListener("click", function(){
      explanation1.classList.add("hidden5");
      overlay.classList.add("hidden11");
    })
  }

  // SKRYT BUTTON1
  function hideButton1(){
    let oznaceniButton1 = document.querySelector(".button1");
      oznaceniButton1.classList.add("hideButton1");;
  }

// VYTVORIT VYSVETLIVKU CISLO 2 - Button 3
function createButton3 (){
  let button3 = document.createElement("button")
  button3.className = "button3";
  button3.innerText = "Chci vědět víc"
  questionContainer.appendChild(button3)
  button3.addEventListener("click", function(){
    // add class hidden na vsechno ostatni
    overlay.classList.remove("hidden11");
    // remove class hidden na tu vysvetlivku
    explanation2.classList.remove("hidden7");
  
  })
}

// VYTVORIT TLACITKO ZPET Z VYSVETLIVKY - Button 2

function createButton4 (){
  const button4 = document.createElement("button")
  button4.className = "button4";
  button4.innerText = "Zpět k otázce"
  explanation2Flex.appendChild(button4)
  button4.addEventListener("click", function(){
    explanation2.classList.add("hidden7");
    overlay.classList.add("hidden11");
  })
}

// SKRYT BUTTON1
function hideButton3(){
  let oznaceniButton3 = document.querySelector(".button3");
    oznaceniButton3.classList.add("hideButton3");;
}



  // FUNKCE countPoints - Pocitani bodu
  function countPoints() {
    // OTAZKA 0
    if (currentQuestion.answer == 0 && selectedAnswer == 1) {
      return window.location.assign("./zena.html");
          }
    if (currentQuestion.answer == 0 && selectedAnswer == 2) {
      return window.location.assign("./muz.html");
    }
    // OTAZKA 1
    if (currentQuestion.answer == 1 && selectedAnswer == 1) {
      cssd++;
      agr++;
      cstpd++;
      mladStar++;
      createButton1 ()
      createButton2 ()
    }
    if (currentQuestion.answer == 1 && selectedAnswer == 2) {
      kler++;
      createButton1 ()
      createButton2 ()
    }
    // OTAZKA 2
    if (currentQuestion.answer == 2 && selectedAnswer == 1) {
      cstpd++;
      cssd++;
     hideButton1()

    }
    if (currentQuestion.answer == 2 && selectedAnswer == 2) {
      kler++;
      agr++;
      mladStar++;
      hideButton1()
    }
    // OTAZKA 3
    if (currentQuestion.answer == 3 && selectedAnswer == 1) {
      cstpd++;
      mladStar++;
      // hideButton1()
    }
    if (currentQuestion.answer == 3 && selectedAnswer == 2) {
      kler++;
      cssd++;
      agr++;
      
    }
    // OTAZKA 4
    if (currentQuestion.answer == 4 && selectedAnswer == 1) {
      agr++;
      mladStar++;
      kler++;
    }
    if (currentQuestion.answer == 4 && selectedAnswer == 2) {
      cssd++;
      cstpd++;
    }
    // OTAZKA 5
    if (currentQuestion.answer == 5 && selectedAnswer == 1) {
      mladStar++;
    }
    if (currentQuestion.answer == 5 && selectedAnswer == 2) {
      kler++;
      cssd++;
      agr++;
      cstpd++;
    }
    // OTAZKA 6
    if (currentQuestion.answer == 6 && selectedAnswer == 1) {
      agr++;
      createButton3 ()
      createButton4 ()
    }
    if (currentQuestion.answer == 6 && selectedAnswer == 2) {
      kler++;
      cssd++;
      cstpd++;
      mladStar++;
      createButton3 ()
      createButton4 ()
    }
    // OTAZKA 7
    if (currentQuestion.answer == 7 && selectedAnswer == 1) {
      mladStar++;
      hideButton3()
    }
    if (currentQuestion.answer == 7 && selectedAnswer == 2) {
      kler++;
      cssd++;
      agr++;
      cstpd++;
      hideButton3()
    }
    // OTAZKA 8
    if (currentQuestion.answer == 8 && selectedAnswer == 1) {
    }
    if (currentQuestion.answer == 8 && selectedAnswer == 2) {
      kler++;
      cssd++;
      agr++;
      cstpd++;
      mladStar++;
    }
    // OTAZKA 9
    if (currentQuestion.answer == 9 && selectedAnswer == 1) {
      mladStar++;
    }
    if (currentQuestion.answer == 9 && selectedAnswer == 2) {
      kler++;
      cssd++;
      agr++;
      cstpd++;
    }
    // OTAZKA 10
    if (currentQuestion.answer == 10 && selectedAnswer == 1) {
      cssd++;
      agr++;
      cstpd++;
      addClassLastQuestion();
      removeClassHidden();
      addClassLastAnswer()
      addClassLastText()
      addClassLastQuestion1()
      // resetButton.classList.add("hidden4")
    }
    if (currentQuestion.answer == 10 && selectedAnswer == 2) {
      kler++;
      mladStar++;
      addClassLastQuestion();
      removeClassHidden();
      addClassLastAnswer()
      addClassLastText()
      addClassLastQuestion1()
      // resetButton.classList.add("hidden4")

    }
    // OTAZKA 11
    if (currentQuestion.answer == 11 && selectedAnswer == 1) {
      cssd++;
      removeClassHidden2();
      addClassHidden3()
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 2) {
      cstpd++;
      removeClassHidden2();
      addClassHidden3()
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 3) {
      agr++;
      removeClassHidden2();
      addClassHidden3()
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 4) {
      mladStar++;
      removeClassHidden2();
      addClassHidden3()
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 5) {
      kler++;
      removeClassHidden2();
      addClassHidden3()
    }
  }
  countPoints();

  // ARRAY OBJEKT VYSLEDKY TEXT
  let strany = [
      {
      text:"Klerikální strana",
      cislo: 1,
      strana: Math.floor((kler / 11) * 100),
      link: "klerikove.html"
      
      },
  {
      text:
        "Koalice Mladočechů a Staročechů",
      cislo: 2,
      strana: Math.floor((mladStar / 11) * 100),
      link: "mladStar.html"
  },
  {
      text:
        "Českoslovanská strana sociálně demokratická",
      cislo: 3,
      strana: Math.floor((cssd / 11) * 100),
      link: "cssd.html"
  },
  {
      text:
        "Agrárníci",
      cislo: 4,
      strana: Math.floor((agr / 11) * 100),
      link: "agrarnici.html"
  },
  {
      text:
        "Česká státopravní demokracie",
      cislo: 5,
      strana: Math.floor((cstpd / 11) * 100),
      link: "cstd.html",
    }
  ];


  // Preradi objekt strany od nejvetsiho po nejmensi pocet bodu
  const stranySorted = strany.sort((a, b) => parseFloat(b.strana) - parseFloat(a.strana));


// VEZME OBJEKT "stranySorted" A HODI HO DO DIVU
  const allDivs = document.querySelectorAll(".parties-container div");
  stranySorted.forEach(function(obj, index, arr) {
      allDivs[index].innerHTML = obj.strana + " %<br>" + obj.text;
    });  

function firstPartyToSee(){
  if(allDivs[0].innerHTML.indexOf("Klerikální strana") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Klerikální strany</p><br> Katolické, nebo obecněji klerikální strany vznikly v 90. letech 19. století.  Dělily se na dva tábory: katolicko-národní a křesťanskosociální. První ze zmíněných existoval nějakou dobu u staročechů, a v roce 1897 byla založena Národní strana katolická v Království českém. Druhá větev se vyvíjela spíše v rámci občanské společnosti, a roku 1894 vznikla Křesťansko-sociální strana v Čechách. Katolíci byli loajální k monarchii a měli jasně austroslavistická stanoviska, kterých se drželi i během války. Katolické strany velmi konzervativní, odmítaly ženské hnutí, a společnost vnímaly jako stavovskou. Socialismus i liberalismus pak zavrhovali jako škodlivé pro systém.";
    partiesContainerDiv.style.backgroundColor = "green"
  } 
  if(allDivs[0].innerHTML.indexOf("Koalice Mladočechů a Staročechů") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Koalice Mladočechů a Staročechů</p><br> <p>Mladočeši</p><p>Národní strana svobodomyslná, zkráceně Mladočeši, byla politickou stranou působící v českých zemích Rakouska-Uherska. Vznikla na konci roku 1874, po dlouhotrvajících sporech v Národní straně. Mladočeši hlásali zároveň český národní a zároveň liberální program. Na přelomu 19. a 20. století získala dominantní postavení v rámci českého politického spektra, a působili v ní například Karel Kramář, Alois Rašín nebo Miloslav Tyrš.</p><br><p>Staročeši</p> Národní strana byla první politickou stranou v českých zemích. Vznikla v roce 1848, ale po vzniku Mladočechů začala ztrácet vliv. Nejprve se jednalo o občanskou iniciativu, rozvinula se až po pádu Bachova absolutismu roku 1859. V rámci této strany se nacházela rozličná politická a ideová uskupení, v roce 1863 vzniklo mladočeské křídlo. Mezi lety 1863 a 1891 byla Národní strana částečně zastoupena v Říšské radě. Poté byla strana činná především na komunální úrovni, od roku 1890 však neměla žádný větší vliv na politiku.";
  }
  if(allDivs[0].innerHTML.indexOf("Českoslovanská strana sociálně demokratická") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Českoslovanská strana sociálně demokratická</p><br> Českoslovanská strana sociálně demokratická dělnická vznikla v roce 1893 v Českých Budějovicích, kdy se osamostatnila vůči rakouským socialistům. O 4 roky později již byla strana zastoupena v říšské radě, a roku 1897 v ní učinilo pět sociálně demokratických poslanců prohlášení, které vedlo ke vzniku ČSNS. Programově prosazovala uznání osmihodinové pracovní doby, všeobecné volební právo a spravedlivé mzdy. Ve volbách do Říšské rady 1907 strana poprvé kandidovala mimo rámec rakouské sociální demokracie. V českých zemích zvítězila, avšak po přepočtení na kurie skončila až za agrární stranou. Během první světové války strana odmítala odbojovou činnost a byla loajální k Rakousku-Uhersku, avšak ke konci války se levé křídlo strany podílelo na protiválečných demonstracích.";
  }
  if(allDivs[0].innerHTML.indexOf("Agrárníci") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Agrárníci</p><br> Jedna z nejvýznamnějších stran první republiky byla založena 6. ledna 1899 pod názvem Česká strana agrární, mezi zakládající osobnosti patřili Karel Prášek a Stanislav Kubr. Agrárníci se hlásili k národním tradicím, jejich snahou bylo oslabovat centralismus a rozšiřovat působnost sněmů Koruny české. Hlavním cílem agrárníků však bylo hájit zájmy rolnictva, i za cenu pragmatického přístupu v politice.";
  }
  if(allDivs[0].innerHTML.indexOf("Česká státopravní demokracie") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Česká státopravní demokracie</p><br> Státoprávní strana vznikla jako odštěpené křídlo pokrokové strany v roce 1894. Mezi čelní představitele této strany patřil budoucí prvorepublikový ministr financí Alois Rašín. Strana měla od začátku podporu především středních vrstev, intelektuálů a vysokoškolských studentů, ale někdy i dělníků. Kromě státoprávního křídla vzniklo také křídlo přirozenoprávní, dělnicko-pokrokové a anarchistické. Nebyla zcela jasně ideologicky vymezena a komunikovala s jinými stranami, levicovými i pravicovými. V prvních všeobecných volbách roku 1907 získali státoprávníci sedm mandátů.";
  }
}
firstPartyToSee();


//Switch color of active link
party.forEach(function (item) {
  item.addEventListener("click", function (e) {
    partiesContainerDiv.querySelector(".current").classList.remove("current");
    item.classList.add("current");
  });
});




    
function clickOnDiv(){
allDivs.forEach((something) => {
something.addEventListener("click", (e) => {
  
  const selectedDiv = e.target; 
  // const selectedNumberDiv = selectedDiv.dataset["number"]; 

  function changeBackground(){
    if(selectedDiv.innerHTML.indexOf("Klerikální strana") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Klerikální strany</p><br> Katolické, nebo obecněji klerikální strany vznikly v 90. letech 19. století.  Dělily se na dva tábory: katolicko-národní a křesťanskosociální. První ze zmíněných existoval nějakou dobu u staročechů, a v roce 1897 byla založena Národní strana katolická v Království českém. Druhá větev se vyvíjela spíše v rámci občanské společnosti, a roku 1894 vznikla Křesťansko-sociální strana v Čechách. Katolíci byli loajální k monarchii a měli jasně austroslavistická stanoviska, kterých se drželi i během války. Katolické strany velmi konzervativní, odmítaly ženské hnutí, a společnost vnímaly jako stavovskou. Socialismus i liberalismus pak zavrhovali jako škodlivé pro systém.";
      partiesContainerDiv.style.backgroundColor = "green";
    }
    if(selectedDiv.innerHTML.indexOf("Koalice Mladočechů a Staročechů") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Koalice Mladočechů a Staročechů</p><br> <p>Mladočeši</p><p>Národní strana svobodomyslná, zkráceně Mladočeši, byla politickou stranou působící v českých zemích Rakouska-Uherska. Vznikla na konci roku 1874, po dlouhotrvajících sporech v Národní straně. Mladočeši hlásali zároveň český národní a zároveň liberální program. Na přelomu 19. a 20. století získala dominantní postavení v rámci českého politického spektra, a působili v ní například Karel Kramář, Alois Rašín nebo Miloslav Tyrš.</p><br><p>Staročeši</p> Národní strana byla první politickou stranou v českých zemích. Vznikla v roce 1848, ale po vzniku Mladočechů začala ztrácet vliv. Nejprve se jednalo o občanskou iniciativu, rozvinula se až po pádu Bachova absolutismu roku 1859. V rámci této strany se nacházela rozličná politická a ideová uskupení, v roce 1863 vzniklo mladočeské křídlo. Mezi lety 1863 a 1891 byla Národní strana částečně zastoupena v Říšské radě. Poté byla strana činná především na komunální úrovni, od roku 1890 však neměla žádný větší vliv na politiku.";
      partiesContainerDiv.style.backgroundColor = "blue";
    }
    if(selectedDiv.innerHTML.indexOf("Českoslovanská strana sociálně demokratická") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Českoslovanská strana sociálně demokratická</p><br> Českoslovanská strana sociálně demokratická dělnická vznikla v roce 1893 v Českých Budějovicích, kdy se osamostatnila vůči rakouským socialistům. O 4 roky později již byla strana zastoupena v říšské radě, a roku 1897 v ní učinilo pět sociálně demokratických poslanců prohlášení, které vedlo ke vzniku ČSNS. Programově prosazovala uznání osmihodinové pracovní doby, všeobecné volební právo a spravedlivé mzdy. Ve volbách do Říšské rady 1907 strana poprvé kandidovala mimo rámec rakouské sociální demokracie. V českých zemích zvítězila, avšak po přepočtení na kurie skončila až za agrární stranou. Během první světové války strana odmítala odbojovou činnost a byla loajální k Rakousku-Uhersku, avšak ke konci války se levé křídlo strany podílelo na protiválečných demonstracích.";
      partiesContainerDiv.style.backgroundColor = "purple";
    }
    if(selectedDiv.innerHTML.indexOf("Agrárníci") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Agrárníci</p><br> Jedna z nejvýznamnějších stran první republiky byla založena 6. ledna 1899 pod názvem Česká strana agrární, mezi zakládající osobnosti patřili Karel Prášek a Stanislav Kubr. Agrárníci se hlásili k národním tradicím, jejich snahou bylo oslabovat centralismus a rozšiřovat působnost sněmů Koruny české. Hlavním cílem agrárníků však bylo hájit zájmy rolnictva, i za cenu pragmatického přístupu v politice.";
      partiesContainerDiv.style.backgroundColor = "brown";
    }
    if(selectedDiv.innerHTML.indexOf("Česká státopravní demokracie") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Česká státopravní demokracie</p><br> Státoprávní strana vznikla jako odštěpené křídlo pokrokové strany v roce 1894. Mezi čelní představitele této strany patřil budoucí prvorepublikový ministr financí Alois Rašín. Strana měla od začátku podporu především středních vrstev, intelektuálů a vysokoškolských studentů, ale někdy i dělníků. Kromě státoprávního křídla vzniklo také křídlo přirozenoprávní, dělnicko-pokrokové a anarchistické. Nebyla zcela jasně ideologicky vymezena a komunikovala s jinými stranami, levicovými i pravicovými. V prvních všeobecných volbách roku 1907 získali státoprávníci sedm mandátů.";
      partiesContainerDiv.style.backgroundColor = "black";
    }
  }

  changeBackground();


 
})});
};
clickOnDiv();


getNewQuestion();
  
});
});

startGame();


