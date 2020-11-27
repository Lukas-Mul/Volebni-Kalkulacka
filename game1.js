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

const chosenAnswer = document.querySelectorAll(".choice-container");
const answerContainer = document.querySelector(".answer-container")


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

// OTAZKY - TEXT
let questions = [
{
  question:
    "Zavedení všeobecného volebního práva znamená, že mohou volit všichni muži starší 24 let a do parlamentu mohou být zvoleni ve věku 30 let a výš. Končí také omezení volebního práva majetkem a původem. Souhlasíte s tímto nastavením?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 1,
},
{
  question:
    "Část společnosti se domnívá, že by se volební právo mělo vztahovat i na ženy. Zastáváte tento názor?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 2,
},
{
  question:
    "Je třeba usilovat o co největší národní samostatnost uvnitř monarchie. Hlavním bodem programu musí být hájení národních zájmů.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 3,
},
{
  question:
    "Po dlouhých letech pasivity má česká politika konečně zastoupení v rakouské vládě a možnost spolupracovat s Vídní na vládní úrovni. Měli bychom podle vás i nadále upevňovat politické vztahy a směřovat do Vídně svoje ministry?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 4,
},
{
  question:
    "Česká politika by měla jít cestou jednotné národní kandidátky. Nově vzniklé volební okresy musí zvýhodňovat české obyvatelstvo.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 5,
},
{
  question:
    "Pro českou politiku jsou klíčové hospodářské zájmy. Jde o co největší autonomii v oblasti rozvoje průmyslu a venkova.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 6,
},
{
  question:
    "Karel Kramář je největší osobnost české politiky, obránce slovanství a schopný vůdce! Měl by stanout v čele národa.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 7,
},
{
  question:
    "T. G. Masaryk, kandidát do parlamentu a profesor pražské univerzity, píše: „Důležitou součástí programu českých stran musí být zájem o Slovensko.“ Sdílíte tento názor?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 8,
},
{
  question:
    "Rakousko-Uhersko se v mezinárodní politice orientuje na Německo a Itálii, zatímco slovanské národy sympatizují s východem. Měla by se česká politika hlásit k Rusku?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 9,
},
{
  question:
    "Doba se mění a spolu s tím přicházejí problémy, které rakouská vláda neumí řešit. Je proto třeba změnit politický přístup – méně vyjednávání, větší nátlak!",
  choice1: "Ano",
  choice2: "Ne",
  answer: 10,
},
{
  question: "S jakým výrokem se ztotožňujete?",
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
  question: "S jakým výrokem se ztotožňujete",
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



currentQuestion = availableQuestions[0];
question.innerText = currentQuestion.question; //ta question na leve strane znaci ten div s tou otazkou. priradim k ni innerText, ktery si js najde tak, ze pujde podle currentQuestion a vezme si property question z te currentQuestion.
choices.forEach((choice) => {
  const number = choice.dataset["number"]; //tohle vezme to cislo z toho datasetu v html
  choice.innerHTML = currentQuestion["choice" + number]; //tomu parametru choice to priradi innerText, ktery je v currentQuestion["choice" + number]. Tohle znamena vlastne choice1, choice2 apod.
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
    const hiddenContainer4 = document.querySelectorAll(".choice-text");
    hiddenContainer4.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-text");
      }
    });
  }

  function addClassLastText() {
    const hiddenContainer5 = document.querySelectorAll(".choice-container");
    hiddenContainer5.forEach(function (item) {
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
    button1.innerText = "ZJISTIT VÍC"
    questionContainer.appendChild(button1)
    button1.addEventListener("click", function(){
      // add class hidden na overlay element, takze kliknutim se tam ten overlay element zobrazi a udela vsechno ostatni tmavym
      overlay.classList.remove("hidden11");
      explanation1Flex.classList.add("translate");
      
    })
  }

  // VYTVORIT TLACITKO ZPET Z VYSVETLIVKY - Button 2

  function createButton2 (){
    const button2 = document.createElement("button")
    button2.className = "button2";
    button2.innerText = "ZPĚT"
    explanation1Flex.appendChild(button2)
    button2.addEventListener("click", function(){
      overlay.classList.add("hidden11");
      explanation1Flex.classList.remove("translate");


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
  button3.innerText = "ZJISTIT VÍC"
  questionContainer.appendChild(button3)
  button3.addEventListener("click", function(){
    overlay.classList.remove("hidden11");
    explanation2Flex.classList.add("translate");

  
  })
}

// VYTVORIT TLACITKO ZPET Z VYSVETLIVKY - Button 2

function createButton4 (){
  const button4 = document.createElement("button")
  button4.className = "button4";
  button4.innerText = "ZPĚT"
  explanation2Flex.appendChild(button4)
  button4.addEventListener("click", function(){
    explanation2Flex.classList.remove("translate");
    overlay.classList.add("hidden11");
  })
}

// SKRYT BUTTON1
function hideButton3(){
  let oznaceniButton3 = document.querySelector(".button3");
    oznaceniButton3.classList.add("hideButton3");;
}

function slideAway(){
  answerContainer.addEventListener("mouseup", function(){
    questionContainer.classList.toggle("slide");
    console.log('slide');
  })
}

slideAway();

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
      addClassLastAnswer();
      addClassLastText();
      addClassLastQuestion1();
    }
    if (currentQuestion.answer == 10 && selectedAnswer == 2) {
      kler++;
      mladStar++;
      addClassLastQuestion();
      removeClassHidden();
      addClassLastAnswer();
      addClassLastText();
      addClassLastQuestion1();
    }
    // OTAZKA 11
    if (currentQuestion.answer == 11 && selectedAnswer == 1) {
      cssd++;
      removeClassHidden2();
      addClassHidden3();
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 2) {
      cstpd++;
      removeClassHidden2();
      addClassHidden3();
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 3) {
      agr++;
      removeClassHidden2();
      addClassHidden3();
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 4) {
      mladStar++;
      removeClassHidden2();
      addClassHidden3();
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 5) {
      kler++;
      removeClassHidden2();
      addClassHidden3();
    }
  }
  countPoints();

  // ARRAY OBJEKT VYSLEDKY TEXT
  let strany = [
      {
      text:"KLERIKÁLNÍ STRANY",
      cislo: 1,
      strana: Math.floor((kler / 11) * 100),
      link: "klerikove.html"
      
      },
  {
      text:
        "MLADOČEŠI",
      cislo: 2,
      strana: Math.floor((mladStar / 11) * 100),
      link: "mladStar.html"
  },
  {
      text:
        "SOCIÁLNÍ DEMOKRACIE",
      cislo: 3,
      strana: Math.floor((cssd / 11) * 100),
      link: "cssd.html"
  },
  {
      text:
        "AGRÁRNÍCI",
      cislo: 4,
      strana: Math.floor((agr / 11) * 100),
      link: "agrarnici.html"
  },
  {
      text:
        "STÁTOPRÁVNÍ BLOK",
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
      // allDivs[index].innerHTML = obj.strana + " %<br>" + obj.text;
      allDivs[index].innerHTML = obj.strana + "% " + obj.text;
    });  

function firstPartyToSee(){
  if(allDivs[0].innerHTML.indexOf("KLERIKÁLNÍ STRANY") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Klerikální strany</p><br><p>Klerikální neboli katolické strany vznikly ke konci 19. století. Dělily se na dva hlavní proudy: katolicko-národní a křesťansko-sociální.</p><br><p>Katolicko-národní strany se v roce 1897 spojily v Národní stranu katolickou v Království českém. Národní strana katolická usilovala o mírovou spolupráci slovanských národů žijících na území habsburské monarchie, kterým by nedominovaly německy mluvící elity. Zůstávala však loajální monarchii.</p><br><p>Křesťansko-sociální strana vznikla v roce 1894. Vyvíjela se spíše v občanské rovině.</p><br><p>Oba proudy byly ve své působnosti velmi konzervativní, odmítaly ženská hnutí a společnost vnímaly jako stavovskou. V socialismu i liberalismu spatřovaly systémové zlo.</p>";
    partiesContainerDiv.style.backgroundImage = "url(img/Klerikalove.jpg";
  } 
  if(allDivs[0].innerHTML.indexOf("MLADOČEŠI") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Mladočeši (v rámci kalkulačky je máme spojené do mladočeši/staročeši)</p><br> <p>Národní strana svobodomyslná, zkráceně mladočeši, byla politickou stranou působící v českých zemích Rakouska-Uherska. Vznikla na konci roku 1874 po dlouhotrvajících sporech v Národní straně. Program mladočechů byl pronárodní a liberální. Na přelomu 19. a 20. století strana zaujímala dominantní postavení v českém politickém spektru. Působili v ní například Karel Kramář, Alois Rašín a Miroslav Tyrš.</p><br><p>Staročeši</p>Národní strana neboli staročeši, byla vůbec první politickou stranou v českých zemích. Vznikla z občanské iniciativy v roce 1848 a sdružovala v sobě rozličná politická a ideová uskupení. Zpočátku byli její součástí i mladočeši, kteří se však po dlouhotrvajících sporech v roce 1874 oddělili. Vliv Národní strany na politické dění – i přes několikaleté zastoupení v Říšské radě – od té doby slábl.";
    partiesContainerDiv.style.backgroundImage = "url(img/MladStar.jpg";

  }
  if(allDivs[0].innerHTML.indexOf("SOCIÁLNÍ DEMOKRACIE") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Sociální demokracie</p><br>Českoslovanská strana sociálně demokratická dělnická vznikla v roce 1893 osamostatněním od rakouských socialistů. Od roku 1897 měla své zastoupení v Říšské radě. Ve stejné době se poslanci sociální demokracie usnesli na prohlášení, které vedlo ke vzniku ČSNS. Strana prosazovala uznání osmihodinové pracovní doby, spravedlivou mzdu a všeobecné volební právo. Ve volbách 1907 poprvé kandidovala mimo rámec rakouské sociální demokracie. Tehdy byli voliči rozděleni do několika skupin (kurií) a váha jejich hlasů se lišila. I když se tedy zpočátku zdálo, že sociální demokracie v českých zemích zvítězí, po přepočtu na kurie skončila druhá. Během první světové války zprvu zachovávala loajalitu Rakousku-Uhersku, ale ke konci se její levé křídlo podílelo na protiválečných demonstracích.";
    partiesContainerDiv.style.backgroundImage = "url(img/SocDem.jpg";

  }
  if(allDivs[0].innerHTML.indexOf("AGRÁRNÍCI") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Agrárníci</p><br>Česká strana agrární, jedna z nejvýznamnějších stran první republiky, byla založena roku 1899. Mezi zakládající osobnosti patřili Karel Prášek a Stanislav Kubr. Agrárníci se hlásili k národním tradicím a jejich cílem bylo oslabení centralismu a rozšíření působnosti sněmů Koruny české. Součástí jejich programu byl dohled nad zemědělskými kartely, uznání českého státního práva a ochrana rakouského zemědělství. Soustřeďovali se na základní potřeby venkovských obyvatel a mnohdy až bezohledně hájili zájmy rolníků. Před vypuknutím první světové války byli agrárníci druhou nejsilnější stranou.";
    partiesContainerDiv.style.backgroundImage = "url(img/Agrarnici.jpg";

  }
  if(allDivs[0].innerHTML.indexOf("STÁTOPRÁVNÍ BLOK") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Státoprávní blok</p><br><p>V reakci na nedostatek národních stran se na nymburském sjezdu mladočechů v roce 1894 postupně oddělily čtyři proudy:</p><br><p>1) Státoprávní pravice, která kladla důraz na historické státní právo. V jejím čele stál budoucí prvorepublikový ministr financí Alois Rašín.</p><br><p>2) Radikálně pokroková strana, původně Státoprávní levice, která obhajovala ideu přirozeného práva. Byla založena v roce 1897 bratry Hajnovými.</p><br><p>3) Strana pokrokových socialistů, založena v roce 1896 pokrokovými dělníky a anarchisty.</p><br><p>4) Česká strana státoprávní, která od začátku prosazovala všeobecné volební právo a osamostatnění českých zemí.</p><br><p>Před volbami v českých zemích panovaly silně antiklerikální postoje, které vedly ke sjednocení národně sociálních, radikálně pokrokových a státoprávních poslanců. Vznikla Aliance české státoprávní demokracie. Za tento státoprávní blok se do Říšské rady dostali například Karel Baxa, Václav Klofáč a Václav Hajn. O rok později se Česká strana státoprávní sloučila s Radikálně pokrokovou stranou, což vedlo ke vzniku České strany státoprávně pokrokové.</p> ";
    partiesContainerDiv.style.backgroundImage = "url(img/Cstpd.jpg";

  }
}
firstPartyToSee();

//Switch color of active link
party.forEach(function (item) {
  item.addEventListener("mousedown", function (e) {
    partiesContainerDiv.querySelector(".current").classList.remove("current");
    item.classList.add("current");
  });
});

function clickOnDiv(){
allDivs.forEach((something) => {
something.addEventListener("mousedown", (e) => {
  
  const selectedDiv = e.target; 
  // const selectedNumberDiv = selectedDiv.dataset["number"]; 

  function changeBackground(){
    if(selectedDiv.innerHTML.indexOf("KLERIKÁLNÍ STRANY") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Klerikální strany</p><br><p>Klerikální neboli katolické strany vznikly ke konci 19. století. Dělily se na dva hlavní proudy: katolicko-národní a křesťansko-sociální.</p><br><p>Katolicko-národní strany se v roce 1897 spojily v Národní stranu katolickou v Království českém. Národní strana katolická usilovala o mírovou spolupráci slovanských národů žijících na území habsburské monarchie, kterým by nedominovaly německy mluvící elity. Zůstávala však loajální monarchii.</p><br><p>Křesťansko-sociální strana vznikla v roce 1894. Vyvíjela se spíše v občanské rovině.</p><br><p>Oba proudy byly ve své působnosti velmi konzervativní, odmítaly ženská hnutí a společnost vnímaly jako stavovskou. V socialismu i liberalismu spatřovaly systémové zlo.</p>";
      partiesContainerDiv.style.backgroundImage = "url(img/Klerikalove.jpg";
      // partiesContainerDiv.classList.add("backgroundImage");
    }
    if(selectedDiv.innerHTML.indexOf("MLADOČEŠI") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Mladočeši (v rámci kalkulačky je máme spojené do mladočeši/staročeši)</p><br> <p>Národní strana svobodomyslná, zkráceně mladočeši, byla politickou stranou působící v českých zemích Rakouska-Uherska. Vznikla na konci roku 1874 po dlouhotrvajících sporech v Národní straně. Program mladočechů byl pronárodní a liberální. Na přelomu 19. a 20. století strana zaujímala dominantní postavení v českém politickém spektru. Působili v ní například Karel Kramář, Alois Rašín a Miroslav Tyrš.</p><br><p>Staročeši</p>Národní strana neboli staročeši, byla vůbec první politickou stranou v českých zemích. Vznikla z občanské iniciativy v roce 1848 a sdružovala v sobě rozličná politická a ideová uskupení. Zpočátku byli její součástí i mladočeši, kteří se však po dlouhotrvajících sporech v roce 1874 oddělili. Vliv Národní strany na politické dění – i přes několikaleté zastoupení v Říšské radě – od té doby slábl.";
      partiesContainerDiv.style.backgroundImage = "url(img/MladStar.jpg";
    }
    if(selectedDiv.innerHTML.indexOf("SOCIÁLNÍ DEMOKRACIE") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Sociální demokracie</p><br>Českoslovanská strana sociálně demokratická dělnická vznikla v roce 1893 osamostatněním od rakouských socialistů. Od roku 1897 měla své zastoupení v Říšské radě. Ve stejné době se poslanci sociální demokracie usnesli na prohlášení, které vedlo ke vzniku ČSNS. Strana prosazovala uznání osmihodinové pracovní doby, spravedlivou mzdu a všeobecné volební právo. Ve volbách 1907 poprvé kandidovala mimo rámec rakouské sociální demokracie. Tehdy byli voliči rozděleni do několika skupin (kurií) a váha jejich hlasů se lišila. I když se tedy zpočátku zdálo, že sociální demokracie v českých zemích zvítězí, po přepočtu na kurie skončila druhá. Během první světové války zprvu zachovávala loajalitu Rakousku-Uhersku, ale ke konci se její levé křídlo podílelo na protiválečných demonstracích."
      partiesContainerDiv.style.backgroundImage = "url(img/SocDem.jpg";
    }
    if(selectedDiv.innerHTML.indexOf("AGRÁRNÍCI") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Agrárníci</p><br>Česká strana agrární, jedna z nejvýznamnějších stran první republiky, byla založena roku 1899. Mezi zakládající osobnosti patřili Karel Prášek a Stanislav Kubr. Agrárníci se hlásili k národním tradicím a jejich cílem bylo oslabení centralismu a rozšíření působnosti sněmů Koruny české. Součástí jejich programu byl dohled nad zemědělskými kartely, uznání českého státního práva a ochrana rakouského zemědělství. Soustřeďovali se na základní potřeby venkovských obyvatel a mnohdy až bezohledně hájili zájmy rolníků. Před vypuknutím první světové války byli agrárníci druhou nejsilnější stranou.";
      partiesContainerDiv.style.backgroundImage = "url(img/Agrarnici.jpg";
    }
    if(selectedDiv.innerHTML.indexOf("STÁTOPRÁVNÍ BLOK") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Státoprávní blok</p><br><p>V reakci na nedostatek národních stran se na nymburském sjezdu mladočechů v roce 1894 postupně oddělily čtyři proudy:</p><br><p>1) Státoprávní pravice, která kladla důraz na historické státní právo. V jejím čele stál budoucí prvorepublikový ministr financí Alois Rašín.</p><br><p>2) Radikálně pokroková strana, původně Státoprávní levice, která obhajovala ideu přirozeného práva. Byla založena v roce 1897 bratry Hajnovými.</p><br><p>3) Strana pokrokových socialistů, založena v roce 1896 pokrokovými dělníky a anarchisty.</p><br><p>4) Česká strana státoprávní, která od začátku prosazovala všeobecné volební právo a osamostatnění českých zemí.</p><br><p>Před volbami v českých zemích panovaly silně antiklerikální postoje, které vedly ke sjednocení národně sociálních, radikálně pokrokových a státoprávních poslanců. Vznikla Aliance české státoprávní demokracie. Za tento státoprávní blok se do Říšské rady dostali například Karel Baxa, Václav Klofáč a Václav Hajn. O rok později se Česká strana státoprávní sloučila s Radikálně pokrokovou stranou, což vedlo ke vzniku České strany státoprávně pokrokové.</p> ";
      partiesContainerDiv.style.backgroundImage = "url(img/Cstpd.jpg";
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


