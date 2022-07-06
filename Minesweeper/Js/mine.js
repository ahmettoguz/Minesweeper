//left Container
let timeResult = 0;
let displayTime = "";
var isFirstClick = true;
let totalR = 16;
let totalC = 16;
let mineCount = 50;
let gameDifficulty = "medium";
gameStatus = "play";
boxSize = 35;
flagCount = 0;

function changeContainerWidth(totalR, totalC) {
  let value = boxSize * totalC;
  $("#boxContainer").css({ width: value, height: value });
  $(".box").css({ width: boxSize, height: boxSize });
}

function createBoxes(r, c) {
  str = "";

  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      str += `
      <div class="box" id="${i}-${j}" onclick="divClicked(this, totalR,totalC)">  <div class="boxContentMine"></div> <div class="boxContentExplosion"></div> </div>   </div>
      `;
    }
  }

  $("#boxContainer").append(str);
}

function changeColors(r, c) {
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if ((j + i) % 2 == 0) {
        $(`#${i}-${j}`).css("background-color", "#AAD851");
      } else {
        $(`#${i}-${j}`).css("background-color", "#b7e462");
      }
    }
  }
}

function createMines(mineCount, totalR, totalC, clickedId) {
  //Wile creating mines I put the index of them in array. by that, I am able to put other mine not the same box.
  let r, c;
  let used = [];

  for (let i = 0; i < mineCount; i++) {
    r = Math.floor(Math.random() * totalR);
    c = Math.floor(Math.random() * totalC);

    let clickedCoordinates = clickedId.split("-");
    clickedCoordinates[0] = parseInt(clickedCoordinates[0]);
    clickedCoordinates[1] = parseInt(clickedCoordinates[1]);

    //At the beginning of the game I also wanted to open at least 9 box, so there will be no mine at clicked and neighboor of that index
    if (
      used.includes(r + "" + c) ||
      (clickedCoordinates[0] - 1 == r && clickedCoordinates[1] - 1 == c) ||
      (clickedCoordinates[0] - 1 == r && clickedCoordinates[1] == c) ||
      (clickedCoordinates[0] - 1 == r && clickedCoordinates[1] + 1 == c) ||
      (clickedCoordinates[0] == r && clickedCoordinates[1] - 1 == c) ||
      (clickedCoordinates[0] == r && clickedCoordinates[1] == c) ||
      (clickedCoordinates[0] == r && clickedCoordinates[1] + 1 == c) ||
      (clickedCoordinates[0] + 1 == r && clickedCoordinates[1] - 1 == c) ||
      (clickedCoordinates[0] + 1 == r && clickedCoordinates[1] == c) ||
      (clickedCoordinates[0] + 1 == r && clickedCoordinates[1] + 1 == c)
    ) {
      i--;
    } else {
      used.push(r + "" + c);
      $(`#${r}-${c}`).addClass("mine");
    }
  }

  // display all mines as red CHEAT
  // $(".mine").css("background-color" , "red");
  // console.log("Assigned mine count: " + $(".mine").length);
}

function findNeighboor(r, c, total_r, total_c) {
  // I am checking the neighboor index, if the index value is between 0 and totalR/C, it means that squares are the neighboors
  let str = "";
  r = parseInt(r);
  c = parseInt(c);

  // upper row
  if (r - 1 >= 0) {
    if (c - 1 >= 0) str += `${r - 1}-${c - 1}/`;

    str += `${r - 1}-${c}/`;

    if (c + 1 < total_c) str += `${r - 1}-${c + 1}/`;
  }

  // current row
  if (c - 1 >= 0) str += `${r}-${c - 1}/`;
  if (c + 1 < total_c) str += `${r}-${c + 1}/`;

  // bottom row
  if (r + 1 < total_r) {
    if (c - 1 >= 0) str += `${r + 1}-${c - 1}/`;

    str += `${r + 1}-${c}/`;

    if (c + 1 < total_c) str += `${r + 1}-${c + 1}/`;
  }

  return str;
}

function assingNeighboorMine(totalR, totalC) {
  // I want to neighboor mine count as class so that I will be able to see it and use it next operations
  let mineCount;
  let ar = [];
  let indexes = [];

  for (let i = 0; i < totalR; i++) {
    for (let j = 0; j < totalC; j++) {
      if (!$(`#${i}-${j}`).hasClass("mine")) {
        mineCount = 0;
        ar = findNeighboor(i, j, totalR, totalC).slice(0, -1).split("/");
        for (k = 0; k < ar.length; k++) {
          if ($(`#${ar[k]}`).hasClass("mine")) mineCount++;
        }

        $(`#${i}-${j}`).addClass("neighboorMineCount" + mineCount);

        // display mine count CHEAT
        // $(`#${i}-${j}`).html(mineCount);
      }
    }
  }
}

function dispNeighboorMines() {
  // When I press a box, this box will have a class "open" and if it is open mine count will bee seen in that box except 0
  $(".open").each(function () {
    for (let i = 1; i <= 8; i++) {
      if ($(this).hasClass("neighboorMineCount" + i)) $(this).html(i);
    }
  });
}

function divClicked(divInfo, totalR, totalC) {
  // check the game status if I lose or win, I shouldn't be able to open new box
  if (gameStatus == "play") {
    // I am assinging mines with first click so this if statement does this task
    if (isFirstClick == true) {
      // start timer and change icon
      timeInterval = setInterval(count, 1000);
      $("#pauseButton").addClass("playbutton");

      // create and randomly assing mines *all neighboor divs and the itself div will be opened
      createMines(mineCount, totalR, totalC, divInfo.id);

      // find and assign neighboor mines
      assingNeighboorMine(totalR, totalC);

      //open clicked location
      $(`#${divInfo.id}`).addClass("open");

      // open the divs while encountered with the divs which's neighboors have mine
      openRecursive(divInfo.id, totalR, totalC);

      // display neighboor mine count when opened
      dispNeighboorMines();

      isFirstClick = false;
    } else {
      //I need to start timer when clicked and if time is not working
      if (!$("#pauseButton").hasClass("playbutton")) {
        timeInterval = setInterval(count, 1000);
        $("#pauseButton").toggleClass("playbutton");
      }

      // If there is flag I will avoid to open that box
      if (!$(`#${divInfo.id}`).hasClass("flag")) {
        // if box is opened we make helper to be able to open closed boxes
        if ($(`#${divInfo.id}`).hasClass("open")) {
          let coordinates = [];
          let allneighboorStr = "";
          let neighboors = [];
          let minecounter = 0;
          let flagcounter = 0;

          coordinates = divInfo.id.split("-");

          allneighboorStr = findNeighboor(
            coordinates[0],
            coordinates[1],
            totalR,
            totalC
          ).slice(0, -1);

          neighboors = allneighboorStr.split("/");

          for (let i = 0; i < neighboors.length; i++) {
            if ($(`#${neighboors[i]}`).hasClass("mine")) minecounter++;
            if ($(`#${neighboors[i]}`).hasClass("flag")) flagcounter++;
          }

          // open neighboors without flag
          if (flagcounter == minecounter) {
            for (let i = 0; i < neighboors.length; i++) {
              if (!$(`#${neighboors[i]}`).hasClass("flag")) {
                $(`#${neighboors[i]}`).addClass("open");
                if ($(`#${neighboors[i]}`).hasClass("neighboorMineCount0"))
                  openRecursive(neighboors[i], totalR, totalC);

                if (
                  $(`#${neighboors[i]}`).hasClass("open") &&
                  $(`#${neighboors[i]}`).hasClass("mine")
                ) {
                  gameStatus = "lose";
                  boomMines(neighboors[i]);
                }
              }
            }
          }
        }

        //check if there is mine
        if ($(`#${divInfo.id}`).hasClass("mine")) {
          console.log("Mayın*************");
          // alert("Zooooooooooooooıoıooooıuoıuoıuoırk");
          gameStatus = "lose";
          boomMines(divInfo.id);
        } else {
          //open clicked location
          $(`#${divInfo.id}`).addClass("open");

          // open the divs while encountered with the divs which's neighboors have mine
          if ($(`#${divInfo.id}`).hasClass("neighboorMineCount0"))
            openRecursive(divInfo.id, totalR, totalC);

          // display neighboor mine count when opened
          dispNeighboorMines();
        }
      }
    }

    // assing background color to opened positions
    $(".open").each(function () {
      ar = this.id.split("-");
      ar[0] = parseInt(ar[0]);
      ar[1] = parseInt(ar[1]);
      if ((ar[0] + ar[1]) % 2 == 0) $(this).css("background-color", "#C6D1E3");
      else {
        $(this).css("background-color", "#D6E1F4");
      }
    });

    // count flags in every click
    flagCount = $(".flag").length;
    $("#flagDiv").html(mineCount - flagCount);

    //check WIN
    winTimeOut = setTimeout(function () {
      if (totalR * totalC - mineCount == $(".open").length) {
        gameStatus = "win";
        dispWinScreen();
      }
    }, 500);
  }
  // display neighboor mine CHEAT
  // var classArray = $(`#${0}-${0}`).attr("class");
  // console.log(classArray);
}

function boomMines(boomid) {
  let animTime;
  if (gameDifficulty == "easy") animTime = 200;
  else if (gameDifficulty == "medium") animTime = 50;
  else if (gameDifficulty == "hard") animTime = 30;

  $(".mine").each(function (index, value) {
    dispMineTimeOut = setTimeout(function () {
      $(`#${value.id} .boxContentMine`).fadeIn(1000);
      $(`#${value.id} .boxContentMine`).css("background-position", "0px");
      if (index == $(".mine").length - 1) {
        $(".mine").each(function (index, value) {
          dispMineTimeOut = setTimeout(function () {
            $(`#${value.id} .boxContentMine`).css("display", "none");
            $(`#${value.id} .boxContentExplosion`).css("display", "block");
            $(`#${value.id} .boxContentExplosion`).animate(
              {
                "background-size": "100%",
              },
              animTime * 3
            );
            if (index == $(".mine").length - 1) {
              dispMineTimeOut = setTimeout(function () {
                gameOverFunc(boomid);
              }, 2000);
            }
          }, index * animTime);
        });
      }
    }, index * animTime);
  });

  function gameOverFunc(mineCoordinates) {
    $("#loseScreenContainer").fadeIn(1000);
    $("#loseScreen div:nth-child(2)").html(convertTime(timeResult));
    $("#pauseButton").toggleClass("playbutton");
    clearInterval(timeInterval);
  }
}

function dispWinScreen() {
  $("#winScreenContainer").fadeIn(1000);
  $("#winScreen div:nth-child(2)").html(convertTime(timeResult));
  $("#pauseButton").toggleClass("playbutton");
  clearInterval(timeInterval);
}

function startGameAgain() {
  gameStatus = "play";
  $("#winScreenContainer").fadeOut(1000);
  $("#loseScreenContainer").fadeOut(1000);
  changeDifficulty(gameDifficulty);
}

function openRecursive(clickedId, totalR, totalC) {
  // Shortly: I am taking current box and the neighboors of that. After that I am checking the assigned neighboor mine count, if it is 0 I am calling this method recursively for that box, at the end if there is assigned box with neighboors mine count, it should stop
  let coordinates = [];
  let neighboors = [];
  let allneighboorArray = "";
  coordinates = clickedId.split("-");

  neighboors = findNeighboor(coordinates[0], coordinates[1], totalR, totalC)
    .slice(0, -1)
    .split("/");

  for (let i = 0; i < neighboors.length; i++) {
    if (
      $(`#${neighboors[i]}`).hasClass("neighboorMineCount0") &&
      !$(`#${neighboors[i]}`).hasClass("open")
    ) {
      if ($(`#${neighboors[i]}`).hasClass("flag"))
        $(`#${neighboors[i]}`).removeClass("flag");

      $(`#${neighboors[i]}`).addClass("open");

      openRecursive(neighboors[i], totalR, totalC);
    } else {
      if (!$(`#${neighboors[i]}`).hasClass("mine")) {
        if ($(`#${neighboors[i]}`).hasClass("flag"))
          $(`#${neighboors[i]}`).removeClass("flag");
        $(`#${neighboors[i]}`).addClass("open");
      }
    }
  }
}

// adding flag with right click
$(document).on("contextmenu", ".box, html", function (e) {
  // check the status of the game if it is is win or lose screen we shouldn't put flag
  if (gameStatus == "play") {
    // We cannot put flag in the first click
    if (isFirstClick == false) {
      if ($(this).hasClass("box") && !$(this).hasClass("open")) {
        $(this).toggleClass("flag");
      }
    }
    // count flags
    flagCount = $(".flag").length;
    $("#flagDiv").html(mineCount - flagCount);
  }

  // this function return false not to open default menu box
  return false;
});

// play pause button
function playPauseToggle(element) {
  if (isFirstClick == false) {
    if ($(element).hasClass("playbutton")) {
      clearInterval(timeInterval);
    } else {
      timeInterval = setInterval(count, 1000);
    }
    $(element).toggleClass("playbutton");
  }
}

// time operation
function count() {
  displayTime = convertTime(++timeResult);

  if ($("#hourglassIcon").hasClass("start")) {
    $("#hourglassIcon").removeClass("start");
    $("#hourglassIcon").addClass("half");

    $("#hourglassIcon").css({
      transform: "rotate(0deg)",
      transition: "0s",
    });

    $("#hourglassIcon").removeClass("fa-hourglass-end");
    $("#hourglassIcon").addClass("fa-hourglass-half");
  } else if ($("#hourglassIcon").hasClass("half")) {
    $("#hourglassIcon").removeClass("half");
    $("#hourglassIcon").addClass("end");

    $("#hourglassIcon").removeClass("fa-hourglass-half");
    $("#hourglassIcon").addClass("fa-hourglass-end");
  } else if ($("#hourglassIcon").hasClass("end")) {
    $("#hourglassIcon").removeClass("end");
    $("#hourglassIcon").addClass("start");

    $("#hourglassIcon").css({
      transform: "rotate(180deg)",
      transition: "1s",
      "transition-timing-function": "ease",
    });
  }

  $("#counter").html(displayTime);
}

function convertTime(time) {
  let second, minute, hour;
  let str = "Time: ";
  let bool = false;
  second = time % 60;
  time = parseInt(time / 60);
  minute = time % 60;
  time = parseInt(time / 60);
  hour = time % 60;

  if (hour != 0) {
    bool = true;
    str += hour + "h";
  }
  if (minute != 0 || bool == true) {
    if (bool == true) {
      str += " ";
    }
    bool = true;
    str += minute + "m";
  }

  if (bool == true) {
    str += " ";
  }
  str += second + "s";

  return str;
}
//left Container
// -------------------------------------------------------------------------------------------------------

// resize event
$(window).bind("resize", checkResize);

function checkResize() {
  if ($(window).width() < 1000) {
    $("section#leftScreen").css("display", "none");
    $("section#rightScreen").css("display", "none");
  } else {
    $("section#leftScreen").css("display", "flex");
    $("section#rightScreen").css("display", "flex");
  }
}
// resize event
// -------------------------------------------------------------------------------------------------------

// dropdown script
// arrows
$(".dropdown").hover(
  function () {
    $(".dropdown .fa-chevron-circle-right").css({
      transform: "rotate(90deg)",
      transition: "200ms",
      "transition-timing-function": "ease",
      color: "lightseagreen",
    });
    $(".dropdown .fa-chevron-circle-left").css({
      transform: "rotate(-90deg)",
      transition: "200ms",
      "transition-timing-function": "ease",
      color: "lightseagreen",
    });
  },
  function () {
    $(".dropdown .fa-chevron-circle-right").css({
      transform: "rotate(0deg)",
      transition: "200ms",
      "transition-timing-function": "ease",
      color: "black",
    });
    $(".dropdown .fa-chevron-circle-left").css({
      transform: "rotate(0deg)",
      transition: "200ms",
      "transition-timing-function": "ease",
      color: "black",
    });
  }
);

// difficulty
function changeDifficulty(element) {
  if (gameStatus == "play") {
    //stop timer
    if ($("#pauseButton").hasClass("playbutton")) {
      clearInterval(timeInterval);
      $("#pauseButton").removeClass("playbutton");
    }
    $("#counter").html("Time: 0s");
    timeResult = 0;

    // remove all the boxes
    $(".box").removeClass();
    $(".box").html("");
    $("#boxContainer").html("");
    isFirstClick = true;
    $("#flagDiv").html(mineCount - flagCount);

    // assing new values
    if (element == "hard") {
      totalR = 22;
      totalC = 22;
      mineCount = 100;
      boxSize = 28;
      createBoxes(totalR, totalC);
      gameDifficulty = "hard";

      $("#hard").html("&#x2022; Hard");
      $("#medium").html("Medium");
      $("#easy").html("Easy");
    } else if (element == "medium") {
      totalR = 16;
      totalC = 16;
      mineCount = 50;
      boxSize = 35;
      createBoxes(totalR, totalC);
      gameDifficulty = "medium";

      $("#medium").html("&#x2022; Medium");
      $("#hard").html("Hard");
      $("#easy").html("Easy");
    } else if (element == "easy") {
      totalR = 8;
      totalC = 8;
      mineCount = 10;
      boxSize = 50;
      createBoxes(totalR, totalC);

      gameDifficulty = "easy";
      $("#easy").html("&#x2022; Easy");
      $("#hard").html("Hard");
      $("#medium").html("Medium");
    }

    changeContainerWidth(totalR, totalC);
    changeColors(totalR, totalC);
    $("#flagDiv").html(mineCount);

    if (element == "hard") $(".box").css("font-size", "150%");
    else if (element == "medium") $(".box").css("font-size", "200%");
    else if (element == "easy") $(".box").css("font-size", "300%");
  }
}
// dropdown script
// -------------------------------------------------------------------------------------------------------

// box animation of the openning page
function loadPage(boxSize, totalR, totalC) {
  let str = "";
  for (let i = 0; i < totalR; i++) {
    for (let j = 0; j < totalC; j++) {
      str += `
          <div class="loadingBox"></div>
          `;
    }
  }

  $("#loadingBoxContainer").click(function (event) {
    event.stopPropagation();
  });
  $("#loadingBoxContainer").append(str);
  let value = boxSize * totalC;
  $(".loadingBox").css({
    width: boxSize,
    height: boxSize,
    backgroundColor: "orange",
    boxSizing: "border-box",
    border: "01px solid black",
    boxShadow: "2px 2px 2px black",
  });
  $("#loadingBoxContainer").css({
    width: value,
    height: value,
    "padding-top": "50px",
  });
  $("#loadPage").css({ backgroundColor: "#2c3e50", overflow: "hidden" });
  anime({
    targets: ".loadingBox",
    translateY: anime.stagger(5, {
      grid: [totalR, totalC],
      from: "center",
      axis: "y",
    }),
    translateX: anime.stagger(5, {
      grid: [totalR, totalC],
      from: "center",
      axis: "x",
    }),

    scale: [
      { value: 0.1, easing: "easeOutSine", duration: 300 },
      { value: 1, easing: "easeInOutQuad", duration: 100 },
      { value: 0.1, easing: "easeInOutQuad", duration: 300 },
      { value: 1, easing: "easeInOutQuad", duration: 200 },
    ],

    direction: "alternate",
    delay: anime.stagger(100, { grid: [totalR, totalC], from: "center" }),
  });

  setTimeout(function () {
    $("#loadPage").animate({ opacity: "0" }, 1000, function () {
      $("#loadPage").css("z-index", "-1");
    });
    $("#main").animate({ opacity: "1" }, 1000);
  }, 3500);
}
// box animation of the openning page
// -------------------------------------------------------------------------------------------------------
