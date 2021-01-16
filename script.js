{ // Constants
var Q = 4;
var players = 2; //can be 2 or 3 players
var Ax = 30;
var Ay = 30;
var L = 150;
var alfa = 22;
var D = 2/5 * L;
var R = 1/15 * L;
var standardColor = 'white';
var colors = [null, '#00ccff', '#ff9933', 'lime']; //players'colors. The first one is null because it represents no ball at all
var depthMAX = 10;
var running = false;
var firstTurn_ = 0;
}

var party = false;
var scoreText = "";

 //Game Part
running = true;
var vectors = [];
vectors = vects();
var board = []; //this is the board, streched from a cube to a big line of length Q^3.
var board = createBoard();
var score = createScore();

var firstTurn = firstTurn_;
var turn = firstTurn;

var Mx = 0, My = 0, Mz = 0;
var Mx = 0, My = 0, Mz = 0;

var entries_ = []; var entries = entries_.slice(0);
var winArr_ = []; var winArr = winArr_.slice(0);
var winTurn_ = 0; var winTurn = winTurn_;

function put(){
	if(running){
		var Marr = xyz2array([Mx,My,Mz]);
		if (board[Marr] == 0){
			board[Marr] = turn + 1;
			turn = (turn + 1) % players;
			entries.push(Marr);
			load(board);
		}	
	}
}

function undo(){
	if (running){
		if (entries.length > 0){
			board[entries.pop()] = 0;
			turn = ((entries.length) + firstTurn) % players;
			load(board);
			console.log(entries);
		}
	}
}

function array2xyz (m){
	var x = m % Q;
	var y = Math.floor(m/Q) % Q;
	var z = Math.floor(m/Q/Q);
	return [x,y,z];
}

function xyz2array ([x,y,z]){
	return Q*Q*z + Q*y + x;
}


function createScore(){
	var sc = [];
	for (var i = 0; i < players; i++){
		sc.push(0);
	}
	return sc;
}

function createBoard(){
	var x = [];
	for (var i = 0; i < Q*Q*Q; i++){//fill board with 0, meaning there's no piece at all in any of Q^3 places of the board.
	x.push(0);
	}
	return x;
	
}

function randomboard(){
	var x = board.slice(0);
	for (var u = 0; u < x.length; u++){
		x[u] = (Math.floor(colors.length * Math.random())) % (players + 1);
	}
	return x;
}

function aval (state, isMaximizingPlayer){
	var id = 1;
	if (isMaximizingPlayer) var id = 0;
	var counter = 0;
	for (var n = 0; n < state.length; n++){
		for (var v = 0; v < vectors.length; v++){
			var VEC = vectors[v];
			var x = (Q-1) * VEC[0], y = (Q-1) * VEC[1], z = (Q-1) * VEC[2];
			var VARR = xyz2array([x,y,z]);
			if (VARR > 0){
				var NVEC = array2xyz(n);
				var Rx = NVEC[0] + x, Ry = NVEC[1] + y, Rz = NVEC[2] + z;
				if (Rx < Q && Ry < Q && Rz < Q && Rx >= 0 && Ry >= 0 && Rz >= 0){
					var RARR = xyz2array([Rx, Ry, Rz]);
					if(testAlmostLineID(n, RARR, state, id)){
						counter++;
					}
				}
			}
		}
	}
	return counter;
}

function terminalState(state){
	for (var n = 0; n < state.length; n++){
		for (var v = 0; v < vectors.length; v++){
			var VEC = vectors[v];
			var x = (Q-1) * VEC[0], y = (Q-1) * VEC[1], z = (Q-1) * VEC[2];
			var VARR = xyz2array([x,y,z]);
			if (VARR > 0){
				var NVEC = array2xyz(n);
				var Rx = NVEC[0] + x, Ry = NVEC[1] + y, Rz = NVEC[2] + z;
				if (Rx < Q && Ry < Q && Rz < Q && Rx >= 0 && Ry >= 0 && Rz >= 0){
					var RARR = xyz2array([Rx, Ry, Rz]);
					if(testLine(n, RARR, state)){
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

var m =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var n = [2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var b = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var u = [1, 0, 1, 0, 0, 0, 0, 0, 0, 2, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function verify(){
	for (var n = 0; n < board.length; n++){
		for (var v = 0; v < vectors.length; v++){
			var VEC = vectors[v];
			var x = (Q-1) * VEC[0], y = (Q-1) * VEC[1], z = (Q-1) * VEC[2];
			var VARR = xyz2array([x,y,z]);
			if (VARR > 0){
				var NVEC = array2xyz(n);
				var Rx = NVEC[0] + x, Ry = NVEC[1] + y, Rz = NVEC[2] + z;
				if (Rx < Q && Ry < Q && Rz < Q && Rx >= 0 && Ry >= 0 && Rz >= 0){
					var RARR = xyz2array([Rx, Ry, Rz]);
					if(testLine(n, RARR, board)){
						//console.log("Player" + board[i] + " won from " + n + " to " + RARR);
						winArr = computeWinArr(n, RARR);
						winTurn = turn;
						running = false;
						score[(winTurn-1+players)%players] = score[(winTurn-1+players)%players] + 1;
						setTimeout(function(){displayConfirm(); }, 3000);
					}
				}
			}
		}
	}
}

function displayConfirm(){
	if (confirm("Play Again?")){
		//clear game
		board = createBoard();
		running = true;
		winArr = winArr_.slice(0);
		winTurn = winTurn_;
		entries = entries_.slice(0);
		firstTurn = turn;
		console.log(score);
		load(board);
	} else {
		//TODO;
	}	
}
function computeWinArr(a,b){
	var mod = (b - a)/(Q-1);
	var result = [];
	for (i = 0; i < Q; i++){
		result.push(i*mod + a);
	}
	return result;
}

function testLine(a, b, state){
	var mod = (b - a)/(Q-1);
	if (state[a] != 0){
		for (var i = 0; i < Q; i++){
			if (state[a] != state[a + mod * i]) return false;
		}
		return true;
	}
	return false;
}

function testNLine(a, b, state){
	var mainValue = 0;
	var times = 0;
	var mod = (b - a)/(Q-1);
		while (mainValue == 0){
			for (var i = 0; i < Q*Q*Q; i++){
				if(state[a + mod * i] != 0){
					mainValue = state[a + mod * i];
					break;
				} 
			}
		};
		for (var i = 0; i < Q; i++){
			var x = state[a + mod * i];
			if(x == mainValue) times++;
			if(x != mainValue && x != 0) return false;
		}
	return [mainValue, times];
}

function testAlmostLine(a, b, state){
	var r = testNLine(a, b, state);
	if (r[1] != Q-1 || r[0] == 0){
		return false;
	} else {
		return true;
	}
}

function testAlmostLineID(a, b, state, id){
	var r = testAlmostLine(a, b, state);
	//retorne true se r for true e as bolas forem da cor do id
	var A_valueturn = state[a] - 1;
	var B_valueturn = state[b] - 1;
	if (r == true && (id == A_valueturn || id == B_valueturn) == true) return true;
	return false;
}

function right(){
	if(running){
	Mx = (Mx + 1 + Q) % Q;
	load(board);}
}
function left(){
	if(running){
	Mx = (Mx - 1 + Q) % Q;
	load(board);}
}
function back(){
	if(running){
	Mz = (Mz + 1 + Q) % Q;
	load(board);}
}
function front(){
	if(running){
	Mz = (Mz - 1 + Q) % Q;
	load(board);}
}
function up(){
	if(running){
	My = (My - 1 + Q) % Q;
	load(board);}
}
function down(){
	if(running){
		My = (My + 1 + Q) % Q;
		load(board);}
}
function enter(){
	put();
}
function backspace(){
	undo();
}

function minimax(state, depth = 0, isMaximizingPlayer = true){
	if (terminalState(state)) return terminalState(state);
	if (depth >= depthMAX){
		console.log('depth max reached');
		if (isMaximizingPlayer == true){
			var id = 0;
		} else {
			var id = 1;
		}
		return (aval(state,isMaximizingPlayer) - aval(state, !isMaximizingPlayer));
	}
	if (isMaximizingPlayer){
		var bestVal = -Infinity;
		for (i = 0; i < Q*Q*Q; i++){
			if (state[i] == 0){
				var value = minimax(state, depth+1, false);
				bestVal = Math.max(bestVal, value);
				console.log(bestVal);
			}
		}
		return bestVal;
	} else {
		var bestVal = +Infinity;
		for (i = 0; i < Q*Q*Q; i++){
			if (state[i] == 0){
				var value = minimax(state, depth+1, true);
				bestVal = Math.min(bestVal, value);
			}
		}
		return bestVal;
	}
}

window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if        (code === 69 || code === 38) { //E key or up key
		up();
    } else if (code === 81 || code === 40) { //Q key or down key
		down();
	} else if (code === 65) { //A key
        left();
    } else if (code === 87) { //W key
        front();
    } else if (code === 83) { //S key
        back();
    } else if (code === 68) { //D key
        right();
    } else if (code === 32) { //space key
		enter();
	} else if (code === 08) { //backspace key
		backspace();
	}
};

 //Graphical Part
var c = document.getElementById("myCanvas");
c.width = canvasDim()[0]; c.height = canvasDim()[1];
var ctx = c.getContext("2d");
var Px = 0;
var Py = 0;

moveto (Ax, Ay);
//multigrid(L, Q-1, D, alfa);
//ctx.stroke();
load(board);;
//circlesMG('#3fd321', R, L, Q, D, alfa);

function load(state = board){
	document.getElementById("score").innerHTML = "Score: " + score;
	ctx.beginPath();
	ctx.clearRect(0, 0, c.width, c.height);
	multigrid(L, Q-1, D, alfa);
	ctx.stroke();
	ctx.beginPath();
	for (var m = 0; m < state.length; m++){
		var x = m % Q;
		var y = Math.floor(m/Q) % Q;
		var z = Math.floor(m/Q/Q);
		if (state[m] != 0 ) circleatxyz(x, y, z, R, colors[state[m]]);
	}
	circleatxyz(Mx, My, Mz, R*2/3, standardColor);
	ctx.stroke();
	if (running == true) verify();
	if (running == false && party === true) {
		for (var i = 0; i < winArr.length; i++){
			board[winArr[i]] = 0;
		}
		//party = false;
	}
	if (running == false && party === false) {
		for (var i = 0; i < winArr.length; i++){
			board[winArr[i]] = winTurn;
		}
		//party = true;
	}
}

function canvasDim(){
	var result = xyzCanvas(Q-1, Q-1, Q-1, L, D, alfa, Ax, Ay);
	result = [Math.ceil(result[0] + Ax), Math.ceil(result[1] + Ay)];
	return result;
}
	

function circleatxyz (x, y, z, radius = R, color = standardColor, length=L, dist=D, angle=alfa, originX=Ax, originY=Ay){
	var result = xyzCanvas(x,y,z,length, dist, angle, originX, originY);
	circleat(result[0], result[1], radius, color);
}

function xyzCanvas(x, y, z, length=L, dist=D, angle=alfa, originX=Ax, originY=Ay){//converts coordinates from 3D to 2D
	var a = angle * Math.PI/180;
	var distX = dist * Math.cos(a);
	var distY = dist * Math.sin(a);
	var resultX = originX + length * x + z * distX;
	var resultY = originY + length * y + z * distY;
	return [resultX, resultY];
}

function circleat(x, y, radius = E, color = standardColor){
	var startX = Px;
	var startY = Py;
	moveto(x,y);
	circle(radius, color);
	moveto(startX, startY);
}

function multigrid (length, size, dist, angle){
	var a = angle * Math.PI/180;
	var startX = Px;
	var startY = Py;
	for (var i = 0; i < size + 1; i++){
		grid (length,size);
		move (dist * Math.cos(a), dist * Math.sin(a));
	}
	for (var i = 0; i < size + 1; i++){
		for (var j = 0; j < size + 1; j++){
			moveto(startX + i * length, startY + j * length);
			lineacrossprof(dist, angle, size);
		}
	}
	moveto (startX, startY);
}

function lineacrossprof (dist, angle, size){
	var a = angle * Math.PI/180;
	var startX = Px;
	var startY = Py;
	lini (size * dist * Math.cos(a), size * dist * Math.sin(a));
}

function circlesMG(color, radius, length, size, dist, angle){
	var a = angle * Math.PI/180;
	var startX = Px;
	var startY = Py;
	for (var i = 0; i < size; i++){
		circlesgrid (color, radius, length, size);
		move (dist * Math.cos(a), dist * Math.sin(a));
	}
	moveto (startX, startY);
}

function circlesline(color, radius, length, size){
	for (var i = 0; i < size; i++){
		circle (radius, color);
		move (length, 0);
	}
	move (-size * length, 0)
}

function circlesgrid(color, radius, length, size){
	for (var i = 0; i < size; i++){
		circlesline (color, radius, length, size);
		move (0, length);
	}
	move (0, -size * length);
}

function circle (radius = R, color = standardColor){
  ctx.beginPath();
  ctx.arc(Px, Py, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  //ctx.stroke();
}

function grid(length, size){//draws a grid size x size
	lini(0,0);
	lini(size*length, 0);
	lini(0, size * length);
	
	for (j = 0; j < size; j++){
		halfsquareline(length , size);
		move (0, length);
	}
	move (0, -size * length);
}

function squareline(length, size){//draws a squareline 1 x size
	square(length);
	move (length, 0);
	
	for (i = 1; i < size; i++){
		almostsquare(length);
		move (length, 0);
	}
	
	move (-size * length, 0)
}

function halfsquareline (length, size){//draws a line of halfsquares
	for (i = 0; i < size; i++){
		move(length, 0);
		halfsquare(length);
	}
	move (-size * length, 0);
}

function square (length){//draws a square from the upper-left corner
	almostsquare(length);
	move (0,  length);
	line (0, -length);
}

function halfsquare (length){//draws the bottom and the right of a square
	line (0, length);
	line (-length, 0);
	move (length, -length);
}

function almostsquare (length){//draws an almost-square from the upper left corner
	line ( length, 0);
	line (0,  length);
	line (-length, 0);
	//line (0, -length);
	move (0, -length);
}

function line (x,y){//draws a given vector from current point
	ctx.lineTo(Px + x, Py + y);
	Px = Px + x;
	Py = Py + y;
}

function lini (x,y){//as line, but returns the pointer to where it started
	var startX = Px;
	var startY = Py;
	line(x,y);
	moveto(startX, startY);
}

function moveto (x,y){
	ctx.moveTo(x,y);
	Px = x;
	Py = y;
}

function move (x = 0,y = 0){
	Px = Px + x;
	Py = Py + y;
	ctx.moveTo(Px, Py);
}

function vects(){
	var x = [];
	for (var i = -1; i <= 1; i++)for (var j = -1; j <= 1; j++)for (var k = -1; k <= 1; k++)x.push([i,j,k]);
	return x;
}

window.setInterval(function(){
if (party === true){party = false;} else {party = true;};
if (running === false) load(board);
}, 500);