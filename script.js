{
  // Constants
  var Q = 4;
  var hard_coded_velha = [
    1, 1, 2, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2,
    1, 2, 1, 1, 2, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 2,
    1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1,
  ];
  var players = 2; //can be 2 or 3 players
  var games = 3; //how many for a trophy "melhor de 3"
  var Ax = 10;
  var Ay = 10;
  var L = 150;
  var alfa = 22;
  var D = (2 / 5) * L;
  var R = (1 / 15) * L;
  var standardColor = "white";
  var colors = [null, "#00ccff", "#ff9933", "lime"]; //players'colors. The first one is null because it represents no ball at all
  var depthMAX = 1;
  var winBoard, winBoardS;
  var started = false,
    running = false;
  var firstTurn_ = 0;
  var AIplaying = false; //true or false
  var ocup = 0;
  var mmCounter = 0;
  mmTotalCounter = 0;
  var party = false;
  var timer;
  var scoreText = "";
  var board = []; //this is the board, streched from a cube to a big line of length Q^3.
  var empty_spaces;
  var score = [];
  var vectors = [];
  var entries_ = [];
  var entries = entries_.slice(0);
  var winArr_ = [];
  var winArr = winArr_.slice(0);
  var winTurn_ = 0;
  var winTurn = winTurn_;
  var firstTurn = firstTurn_;
  var turn = firstTurn;
  var Mx = 0,
    My = 0,
    Mz = 0;
  var Mx = 0,
    My = 0,
    Mz = 0;
  var c = document.createElement("canvas");
  var container = document.getElementById("cont");
  container.appendChild(c);
  container.insertBefore(c, container.childNodes[8]);
  var scoreE = document.getElementById("score");
  var processorE = document.getElementById("processor");
  var ctx = c.getContext("2d");
  var Px = 0,
    Py = 0;
  var eqA = "Azul",
    eqL = "Laranja",
    eqV = "Verde";
  var trofeus = {};
}
//start();
showOptions();

function showOptions() {
  var t = document.getElementById("options");
  t.setAttribute("style", "display: inherit; text-align: right; width: 50%;");
  c.setAttribute("style", "display: none");
  scoreE.setAttribute("style", "display: none");
  processorE.setAttribute("style", "display: none");
}
function start() {
  playagain();
  c.setAttribute("style", "display: initial");
  scoreE.setAttribute("style", "display: initial");

  var EqA = document.getElementById("eqA");
  eqA = EqA.value;
  var EqL = document.getElementById("eqL");
  eqL = EqL.value;
  var EqV = document.getElementById("eqV");
  eqV = EqV.value;

  var e = document.getElementById("selectPlayers");
  players = Number(e.options[e.selectedIndex].value);

  var g = document.getElementById("selectLevel");
  depthMAX = Number(g.options[g.selectedIndex].value);

  var f = document.getElementById("selectGames");
  games = Number(f.options[f.selectedIndex].value);

  if (players == 1) {
    players = 2;
    AIplaying = true;
    eqL = "Unbeatable";
  }
  if (AIplaying) processorE.setAttribute("style", "display: inline");

  var t = document.getElementById("options");
  t.setAttribute("style", "display: none; text-align: right; width: 50%;");

  started = true;
  //Game Part
  running = true;
  vectors = vects();
  board = createBoard();
  score = createScore();
  //Graphical Part
  c.width = canvasDim()[0];
  c.height = canvasDim()[1];
  moveto(Ax, Ay);
  load(board);
}
function beep() {
  var snd = new Audio(
    "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
  );
  snd.play();
}

function put() {
  if (running) {
    var Marr = xyz2array([Mx, My, Mz]);
    if (board[Marr] == 0) {
      //ocup++; console.log('ocup:' + ocup);
      //depthMAX = 13 - 2*Math.ceil(Math.log2(50 - ocup)); console.log("depthMAX:" + depthMAX);
      board[Marr] = turn + 1;
      load(board);
      entries.push(Marr);
      empty_spaces--;
      if (!AIplaying) {
        turn = (turn + 1) % players;
        beep(); //console.log(empty_spaces);
      }
      if (AIplaying) {
        beep();
        processorE.innerHTML = "Processing...";
        setTimeout(function () {
          var dif = arrDif(board, findBestMove());
          for (var i = 0; i < dif.length; i++) {
            if (dif[i] != 0) var AIM = i;
          }
          empty_spaces--;
          entries.push(AIM);
          beep();
          console.log(
            "processing_steps=" + mmCounter + " empty_spaces=" + empty_spaces
          );
          mmTotalCounter += mmCounter;
          processorE.innerHTML = mmCounter;
          mmCounter = 0;
        }, 200);
      }
      load(board);
    }
    //console.log(entries);
  } else {
    playagain();
  }
  //console.log('pont_state=' + aval(board));
}

function arrDif(a1, a2) {
  if (a1.length != a2.length) return false;
  else {
    var a3 = [];
    for (var i = 0; i < a1.length; i++) {
      a3[i] = a1[i] - a2[i];
    }
    return a3;
  }
}

function undo() {
  var confirmed = false;
  if (confirm("Desfazer?")) confirmed = true;
  if (running && !AIplaying && confirmed) {
    if (entries.length > 0) {
      board[entries.pop()] = 0;
      turn = (entries.length + firstTurn) % players;
      load(board);
      console.log(entries);
      empty_spaces++;
    }
  } else if (running && AIplaying && confirmed) {
    if (entries.length > 0) {
      board[entries.pop()] = 0;
      board[entries.pop()] = 0;
      turn = (entries.length + firstTurn) % players;
      load(board);
      console.log(entries);
      empty_spaces++;
    }
  }
  //console.log(entries);
}

function array2xyz(m) {
  var x = m % Q;
  var y = Math.floor(m / Q) % Q;
  var z = Math.floor(m / Q / Q);
  return [x, y, z];
}

function xyz2array([x, y, z]) {
  return Q * Q * z + Q * y + x;
}

function createScore() {
  var sc = [];
  for (var i = 0; i < players; i++) {
    sc.push(0);
  }
  return sc;
}

function createBoard() {
  var x = [];
  ocup = 0;
  for (var i = 0; i < Q * Q * Q; i++) {
    //fill board with 0, meaning there's no piece at all in any of Q^3 places of the board.
    x.push(0);
  }
  return x;
}

function randomboard(num = Q * Q * Q) {
  var posARR = [];
  var rd = Math.floor(Q * Q * Q * Math.random());
  if (num != Q * Q * Q) rd = num;
  for (var u = 0; u < rd; u++) {
    var rd2 = Math.floor(Q * Q * Q * Math.random());
    var rd2inarray = false;
    for (var b = 0; b < posARR.length; b++) {
      if (rd2 === posARR[b]) rd2inarray = true;
    }
    if (rd2inarray == false) {
      posARR.push(rd2);
    } else {
      u--;
    }
  }
  var x = createBoard();
  for (var i = 0; i < posARR.length; i++) {
    pust(posARR[i], x, turn);
    turn = (players + turn + 1) % players;
  }
  load(x);
  return x;
}
function pust(n, x, turn) {
  if (running) {
    if (x[n] == 0) {
      x[n] = turn + 1;
    }
  }
}
function avalLine(line) {
  var nonempty = false;
  var onevar = false;
  var uniquevar = false;
  var firstNonZeroPos = 0;
  var total = 0;
  for (var i = 0; i < line.length; i++) {
    if (line[i] != 0) {
      var firstNonZeroPos = i;
      nonempty = true;
      uniquevar = line[i];
    }
  }
  for (var i = 0; i < line.length; i++) {
    if (line[i] != uniquevar && line[i] != 0) return [false, 0];
    if (line[i] === uniquevar && uniquevar == 1) total++;
    if (line[i] === uniquevar && uniquevar == 2) total--;
  }
  return [uniquevar, total];
}

function aval(state, isMaximizingPlayer = true) {
  var total = 0;
  var arrays = [];
  var arr = getLines(state);
  for (var i = 0; i < arr.length; i++) arrays.push(avalLine(arr[i]));
  for (var i = 0; i < arrays.length; i++) {
    var array = arrays[i];
    if (array[0]) {
      var sign = Math.sign(array[1]);
      var abs = Math.abs(array[1]);
      if (sign == +1 && !isMaximizingPlayer) abs *= 1.2;
      if (sign == -1 && isMaximizingPlayer) abs *= 1.2; //justTestIt
      total = total + sign * Math.pow(76, abs);
    }
  }
  return Math.round(total / 76);
}

function terminalState(state) {
  for (var n = 0; n < state.length; n++) {
    for (var v = 0; v < vectors.length; v++) {
      var VEC = vectors[v];
      var x = (Q - 1) * VEC[0],
        y = (Q - 1) * VEC[1],
        z = (Q - 1) * VEC[2];
      var VARR = xyz2array([x, y, z]);
      if (VARR > 0) {
        var NVEC = array2xyz(n);
        var Rx = NVEC[0] + x,
          Ry = NVEC[1] + y,
          Rz = NVEC[2] + z;
        if (Rx < Q && Ry < Q && Rz < Q && Rx >= 0 && Ry >= 0 && Rz >= 0) {
          var RARR = xyz2array([Rx, Ry, Rz]);
          if (testLine(n, RARR, state)) {
            //console.log("Player" + state[n] + " won from " + n + " to " + RARR);
            var winner = state[n];
            //return true;
            if (winner == 1) return +Infinity;
            if (winner == 2) return -Infinity;
            return null;
          }
        }
      }
    }
  }
  return false;
}

function getLines(state = board) {
  var resulT = [];
  for (var n = 0; n < board.length; n++) {
    for (var v = 0; v < vectors.length; v++) {
      var VEC = vectors[v];
      var x = (Q - 1) * VEC[0],
        y = (Q - 1) * VEC[1],
        z = (Q - 1) * VEC[2];
      var VARR = xyz2array([x, y, z]);
      if (VARR > 0) {
        var NVEC = array2xyz(n);
        var Rx = NVEC[0] + x,
          Ry = NVEC[1] + y,
          Rz = NVEC[2] + z;
        if (Rx < Q && Ry < Q && Rz < Q && Rx >= 0 && Ry >= 0 && Rz >= 0) {
          var RARR = xyz2array([Rx, Ry, Rz]);
          var mod = (RARR - n) / (Q - 1);
          var poss = [n, RARR, mod];
          var result = [];
          for (var i = n; i <= RARR; i += mod) {
            result.push(state[i]);
          }
          resulT.push(result);
        }
      }
    }
  }
  return resulT;
}

function verify() {
  for (var n = 0; n < board.length; n++) {
    for (var v = 0; v < vectors.length; v++) {
      var VEC = vectors[v];
      var x = (Q - 1) * VEC[0],
        y = (Q - 1) * VEC[1],
        z = (Q - 1) * VEC[2];
      var VARR = xyz2array([x, y, z]);
      if (VARR > 0) {
        var NVEC = array2xyz(n);
        var Rx = NVEC[0] + x,
          Ry = NVEC[1] + y,
          Rz = NVEC[2] + z;
        if (Rx < Q && Ry < Q && Rz < Q && Rx >= 0 && Ry >= 0 && Rz >= 0) {
          var RARR = xyz2array([Rx, Ry, Rz]);
          if (testLine(n, RARR, board)) {
            //console.log("Player" + board[i] + " won from " + n + " to " + RARR);
            winArr = computeWinArr(n, RARR);
            var ballsOnState = 0;
            for (var i = 0; i < board.length; i++) {
              if (board[i] != 0) ballsOnState++;
            }
            winTurn = ballsOnState % players;
            winBoard = board.slice(0);
            winBoardS = winBoard.slice(0);
            for (var i = 0; i < winArr.length; i++) {
              winBoard[winArr[i]] = 0;
            }
            running = false;
            score[(winTurn - 1 + players) % players] =
              score[(winTurn - 1 + players) % players] + 1;
            if (testTrophy()) alert(testTrophy());
            timer = setTimeout(function () {
              displayConfirm();
            }, 7000);
          }
        }
        if (empty_spaces <= 0) {
          running = false;
          winBoard = board.slice(0);
          winBoardS = winBoard.slice(0);
          winBoard = createBoard();
          document.getElementById("score").innerHTML = "Deu Velho!!!!!!";
          timer = setTimeout(function () {
            playagain();
          }, 3000);
        }
      }
    }
  }
}

function addTrophy(equipe) {
  if (equipe in trofeus) trofeus[equipe]++;
  if (!(equipe in trofeus)) trofeus[equipe] = 1;
}

function testTrophy() {
  var msg = "???";
  for (var i = 0; i < score.length; i++) {
    if (score[i] >= games) {
      if (i == 0) {
        msg = "O time " + eqA + " ganhou um Troféu!";
        addTrophy(eqA);
      } else if (i == 1 && AIplaying) {
        msg = "Unbeatable continua imbatível...";
        addTrophy("Unbeatable");
      } else if (i == 1 && !AIplaying) {
        msg = "O time " + eqL + " ganhou um Troféu!";
        addTrophy(eqL);
      } else if (i == 2 && !AIplaying) {
        msg = "O time " + eqV + " ganhou um Troféu!";
        addTrophy(eqV);
      }
      setTimeout(function () {
        settings(true);
      }, 200);
    }
  }
  if (msg == "???") return false;
  if (msg != "???") return msg;
}

function displayConfirm() {
  if (confirm("Jogar Novamente?")) {
    playagain();
  } else {
    //TODO;
  }
}

function playagain() {
  //clear game
  clearTimeout(timer);
  board = createBoard();
  empty_spaces = Q * Q * Q;
  running = true;
  winArr = winArr_.slice(0);
  winTurn = winTurn_;
  entries = entries_.slice(0);
  firstTurn = turn;
  //console.log(score);
  load(board);
}

function computeWinArr(a, b) {
  var mod = (b - a) / (Q - 1);
  var result = [];
  for (i = 0; i < Q; i++) {
    result.push(i * mod + a);
  }
  return result;
}

function testLine(a, b, state) {
  var mod = (b - a) / (Q - 1);
  if (state[a] != 0) {
    for (var i = 0; i < Q; i++) {
      if (state[a] != state[a + mod * i]) return false;
    }
    return true;
  }
  return false;
}

function testNLine(a, b, state) {
  var mainValue = 0;
  var times = 0;
  var mod = (b - a) / (Q - 1);
  while (mainValue == 0) {
    for (var i = 0; i < Q * Q * Q; i++) {
      if (state[a + mod * i] != 0) {
        mainValue = state[a + mod * i];
        break;
      }
    }
  }
  for (var i = 0; i < Q; i++) {
    var x = state[a + mod * i];
    if (x == mainValue) times++;
    if (x != mainValue && x != 0) return false;
  }
  return [mainValue, times];
}

function testAlmostLine(a, b, state) {
  var r = testNLine(a, b, state);
  if (r[1] != Q - 1 || r[0] == 0) {
    return false;
  } else {
    return true;
  }
}

function testAlmostLineID(a, b, state, id) {
  var r = testAlmostLine(a, b, state);
  //retorne true se r for true e as bolas forem da cor do id
  var A_valueturn = state[a] - 1;
  var B_valueturn = state[b] - 1;
  if (r == true && (id == A_valueturn || id == B_valueturn) == true)
    return true;
  return false;
}

function right() {
  if (running) {
    Mx = (Mx + 1 + Q) % Q;
    load(board);
  }
}
function left() {
  if (running) {
    Mx = (Mx - 1 + Q) % Q;
    load(board);
  }
}
function back() {
  if (running) {
    Mz = (Mz + 1 + Q) % Q;
    load(board);
  }
}
function front() {
  if (running) {
    Mz = (Mz - 1 + Q) % Q;
    load(board);
  }
}
function up() {
  if (running) {
    My = (My - 1 + Q) % Q;
    load(board);
  }
}
function down() {
  if (running) {
    My = (My + 1 + Q) % Q;
    load(board);
  }
}
function enter() {
  put();
}
function backspace() {
  undo();
}
function loadLastWin() {
  load(winBoardS);
}
function settings(forced = false) {
  if (!running || forced) {
    clearTimeout(timer);
    showOptions();
  }
}

function getChildren(state, isMaximizingPlayer) {
  var ch = [];
  if (isMaximizingPlayer) var inp = 1;
  else if (!isMaximizingPlayer) var inp = 2;
  for (i = 0; i < state.length; i++) {
    if (state[i] == 0) {
      var cn = state.slice(0);
      cn[i] = inp;
      ch.push(cn);
    }
  }
  return ch;
}

function bestMove(state = board) {
  var ballsOnState = 0;
  var IAturn = false;
  for (var i = 0; i < state.length; i++) {
    if (state[i] != 0) ballsOnState++;
  }
  if (ballsOnState % 2 == 1) IAturn = true;
  if (IAturn) {
    var childs = getChildren(state, false);
    var values = [];
    for (var i = 0; i < childs.length; i++) {
      values[i] = aval(childs[i]);
    }
    var target = Math.min(...values);
    var possibleMoves = [];
    for (var i = 0; i < values.length; i++) {
      if (values[i] == target) possibleMoves.push(i);
    }
    return [childs, possibleMoves, values];
  }
  return undefined;
}

function chooseMove(state = board) {
  var ballsOnState = 0;
  var IAturn = false;
  for (var i = 0; i < state.length; i++) {
    if (state[i] != 0) ballsOnState++;
  }
  if (ballsOnState % 2 == 1) IAturn = true;
  if (IAturn) {
    var result = bestMove(state);
    var rd = Math.floor(result[1].length * Math.random());
    var posChose = result[1][rd];
    var newState = result[0][posChose];
    board = newState;
    console.log([rd, result]);
    load(board);
  }
}

function findBestMove(state = board, isMaximizingPlayer = Infinity) {
  var possibleMoves = [];
  if (isMaximizingPlayer === Infinity) {
    var ballsOnState = 0;
    var isMaximizingPlayer = true;
    for (var i = 0; i < state.length; i++) {
      if (state[i] != 0) ballsOnState++;
    }
    if (ballsOnState % 2 == 1) isMaximizingPlayer = false;
    //console.log("Max player: " + isMaximizingPlayer)
  }
  var values = [];
  var children = getChildren(state, isMaximizingPlayer);
  //console.log(children);
  for (var i = 0; i < children.length; i++) {
    var mb = minimax(children[i], !isMaximizingPlayer);
    values.push(mb);
  }
  if (isMaximizingPlayer) var target = Math.max(...values);
  else if (!isMaximizingPlayer) var target = Math.min(...values);

  for (var i = 0; i < values.length; i++) {
    if (values[i] == target) possibleMoves.push(i);
  }

  var rd = Math.floor(possibleMoves.length * Math.random());
  var posChose = possibleMoves[rd];
  var newState = children[posChose];
  board = newState;
  load(board);
  return newState;
}

function minimax(state = board, isMaximizingPlayer = true, depth = 0) {
  mmCounter++;
  if (terminalState(state))
    return terminalState(state); //It will be executed if state is terminal
  else if (depth < depthMAX) {
    var values = [];
    var children = getChildren(state, isMaximizingPlayer);
    for (var i = 0; i < children.length; i++) {
      var mb = minimax(children[i], !isMaximizingPlayer, depth + 1);
      values.push(mb);
    }
    if (isMaximizingPlayer) return Math.max(...values);
    else if (!isMaximizingPlayer) return Math.min(...values);
  } else {
    //console.log("max depth");
    return aval(state, isMaximizingPlayer);
  }
}

window.onkeydown = function (e) {
  var code = e.keyCode ? e.keyCode : e.which;
  if (code === 69 || code === 38) {
    //E key or up key
    up();
  } else if (code === 81 || code === 40) {
    //Q key or down key
    down();
  } else if (code === 65) {
    //A key
    left();
  } else if (code === 87) {
    //W key
    front();
  } else if (code === 83) {
    //S key
    back();
  } else if (code === 68) {
    //D key
    right();
  } else if (code === 32) {
    //space key
    enter();
  } else if (code === 8) {
    //backspace key
    backspace();
  } else if (code === 76) {
    //L key
    loadLastWin();
  } else if (code === 79) {
    //O key
    settings();
  } else if (code === 84) {
    //T key
    alert(
      "Troféus:\n" +
        JSON.stringify(trofeus, null, 4).slice(2, -1).replaceAll('"', "")
    );
  }
};

//Graphical Part

function load(state = board) {
  var azul = eqA + " " + score[0],
    laranja = score[1] + " " + eqL,
    verde = score[2] + " " + eqV;
  if (turn == 0) azul = azul.bold().fontcolor("#00ccff");
  if (turn == 1) laranja = laranja.bold().fontcolor("#ff9933");
  if (turn == 2) verde = verde.bold().fontcolor("lime");
  var res = azul + " | " + laranja;
  if (players == 3) {
    res += " | " + verde;
  }
  document.getElementById("score").innerHTML = res;
  ctx.beginPath();
  ctx.clearRect(0, 0, c.width, c.height);
  multigrid(L, Q - 1, D, alfa);
  ctx.stroke();
  ctx.beginPath();
  for (var m = 0; m < state.length; m++) {
    var x = m % Q;
    var y = Math.floor(m / Q) % Q;
    var z = Math.floor(m / Q / Q);
    if (state[m] != 0) circleatxyz(x, y, z, R, colors[state[m]]);
  }
  circleatxyz(Mx, My, Mz, (R * 2) / 3, standardColor);
  ctx.stroke();
  if (running == true) verify();
}

function canvasDim() {
  var result = xyzCanvas(Q - 1, Q - 1, Q - 1, L, D, alfa, Ax, Ay);
  result = [Math.ceil(result[0] + Ax), Math.ceil(result[1] + Ay)];
  return result;
}

function circleatxyz(
  x,
  y,
  z,
  radius = R,
  color = standardColor,
  length = L,
  dist = D,
  angle = alfa,
  originX = Ax,
  originY = Ay
) {
  var result = xyzCanvas(x, y, z, length, dist, angle, originX, originY);
  circleat(result[0], result[1], radius, color);
}

function xyzCanvas(
  x,
  y,
  z,
  length = L,
  dist = D,
  angle = alfa,
  originX = Ax,
  originY = Ay
) {
  //converts coordinates from 3D to 2D
  var a = (angle * Math.PI) / 180;
  var distX = dist * Math.cos(a);
  var distY = dist * Math.sin(a);
  var resultX = originX + length * x + z * distX;
  var resultY = originY + length * y + z * distY;
  return [resultX, resultY];
}

function circleat(x, y, radius = E, color = standardColor) {
  var startX = Px;
  var startY = Py;
  moveto(x, y);
  circle(radius, color);
  moveto(startX, startY);
}

function multigrid(length, size, dist, angle) {
  var a = (angle * Math.PI) / 180;
  var startX = Px;
  var startY = Py;
  for (var i = 0; i < size + 1; i++) {
    grid(length, size);
    move(dist * Math.cos(a), dist * Math.sin(a));
  }
  for (var i = 0; i < size + 1; i++) {
    for (var j = 0; j < size + 1; j++) {
      moveto(startX + i * length, startY + j * length);
      lineacrossprof(dist, angle, size);
    }
  }
  moveto(startX, startY);
}

function lineacrossprof(dist, angle, size) {
  var a = (angle * Math.PI) / 180;
  var startX = Px;
  var startY = Py;
  lini(size * dist * Math.cos(a), size * dist * Math.sin(a));
}

function circlesMG(color, radius, length, size, dist, angle) {
  var a = (angle * Math.PI) / 180;
  var startX = Px;
  var startY = Py;
  for (var i = 0; i < size; i++) {
    circlesgrid(color, radius, length, size);
    move(dist * Math.cos(a), dist * Math.sin(a));
  }
  moveto(startX, startY);
}

function circlesline(color, radius, length, size) {
  for (var i = 0; i < size; i++) {
    circle(radius, color);
    move(length, 0);
  }
  move(-size * length, 0);
}

function circlesgrid(color, radius, length, size) {
  for (var i = 0; i < size; i++) {
    circlesline(color, radius, length, size);
    move(0, length);
  }
  move(0, -size * length);
}

function circle(radius = R, color = standardColor) {
  ctx.beginPath();
  ctx.arc(Px, Py, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  //ctx.stroke();
}

function grid(length, size) {
  //draws a grid size x size
  lini(0, 0);
  lini(size * length, 0);
  lini(0, size * length);

  for (j = 0; j < size; j++) {
    halfsquareline(length, size);
    move(0, length);
  }
  move(0, -size * length);
}

function squareline(length, size) {
  //draws a squareline 1 x size
  square(length);
  move(length, 0);

  for (i = 1; i < size; i++) {
    almostsquare(length);
    move(length, 0);
  }

  move(-size * length, 0);
}

function halfsquareline(length, size) {
  //draws a line of halfsquares
  for (i = 0; i < size; i++) {
    move(length, 0);
    halfsquare(length);
  }
  move(-size * length, 0);
}

function square(length) {
  //draws a square from the upper-left corner
  almostsquare(length);
  move(0, length);
  line(0, -length);
}

function halfsquare(length) {
  //draws the bottom and the right of a square
  line(0, length);
  line(-length, 0);
  move(length, -length);
}

function almostsquare(length) {
  //draws an almost-square from the upper left corner
  line(length, 0);
  line(0, length);
  line(-length, 0);
  //line (0, -length);
  move(0, -length);
}

function line(x, y) {
  //draws a given vector from current point
  ctx.lineTo(Px + x, Py + y);
  Px = Px + x;
  Py = Py + y;
}

function lini(x, y) {
  //as line, but returns the pointer to where it started
  var startX = Px;
  var startY = Py;
  line(x, y);
  moveto(startX, startY);
}

function moveto(x, y) {
  ctx.moveTo(x, y);
  Px = x;
  Py = y;
}

function move(x = 0, y = 0) {
  Px = Px + x;
  Py = Py + y;
  ctx.moveTo(Px, Py);
}

function vects() {
  var x = [];
  for (var i = -1; i <= 1; i++)
    for (var j = -1; j <= 1; j++)
      for (var k = -1; k <= 1; k++) x.push([i, j, k]);
  return x;
}

window.setInterval(function () {
  if (party === true && running === false && started === true) {
    party = false;
    load(winBoard);
  } else if (party === false && running === false && started == true) {
    party = true;
    load(winBoardS);
  }
}, 250);

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};
