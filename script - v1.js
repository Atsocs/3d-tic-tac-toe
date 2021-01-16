var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var Px = 0;
var Py = 0;

var Ax = 10;//don't erase
var Ay = 10;

var L = 150;
var Q = 4;
var alfa = 22;
var D = 2/5 * L;
var R = 1/20 * L;
var standardColor = 'green';

moveto (Ax, Ay);
multigrid(L, Q-1, D, alfa);
ctx.stroke();
circlesMG('#3fd321', R, L, Q, D, alfa);

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