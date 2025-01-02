"use strict";
let canvas;
let context;

// Note: split up the movement logic and the drawing

var shipPosition = [500, 500];
var shipVelocity = [0, -10];
var shipAcceleration = [10, -10];

const dt = 1 / 60; // Time step for 60fps

var shipAngle = 0;
var windAngle = Math.PI;

var shipPath = [shipPosition];

function updateAcceleration() {
    let theta = ((3*Math.PI/2) - windAngle + shipAngle) % (2*Math.PI);
    let magnitude = -1*(Math.sin(2-Math.sin(theta)) + Math.cos(theta)*Math.cos(theta));

    shipAcceleration[0] = Math.cos(theta)*magnitude;
    shipAcceleration[1] = Math.sin(theta)*magnitude;
}

function updateVelocity() {
    shipVelocity[0] += 0.5*shipAcceleration[0]*dt,
    shipVelocity[1] += 0.5*shipAcceleration[1]*dt;
}

function getShipSpeed() {
    let speed = Math.sqrt(Math.pow(shipVelocity[0], 2) + Math.pow(shipVelocity[1], 2))
    return speed;
}

function updatePosition() {
    shipPosition[0] += shipVelocity[0]*dt + 0.5*shipAcceleration[0]*dt*dt;
    shipPosition[1] += shipVelocity[1]*dt + 0.5*shipAcceleration[1]*dt*dt;
}



window.onload = init;

function init() {
    canvas = document.getElementById('shipsLayer');
    context = canvas.getContext('2d');

    var sizeWidth = 80 * window.innerWidth / 100,
    sizeHeight = 100 * window.innerHeight / 100 || 766;

    canvas.width = sizeWidth;
    canvas.height = sizeHeight;

    // Add event listener for key presses
    window.addEventListener('keydown', handleKeydown);

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function handleKeydown(event) {
    const rotationSpeed = getShipSpeed()/5000; // Rotation speed in radians


    switch (event.key) {
        case 'a':
            shipAngle -= rotationSpeed; // Rotate counterclockwise
            break;
        case 'd':
            shipAngle += rotationSpeed; // Rotate clockwise
            break;
        break;
    }
}

function gameLoop(timeStamp) {

    draw();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawWake();
    drawShip();
    drawUI();
}

function drawShip() {

    let width = 30;
    let height = 110;


    // Save the current context state
    context.save();

    // Update ship position
    updateAcceleration();
    updateVelocity();
    updatePosition();

    shipPath.push(shipPosition)

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Translate and rotate the canvas
    context.translate(centerX, centerY);
    context.rotate(shipAngle);
    

    context.beginPath(); // Starting a new path to avoid persisting old paths
    context.fillStyle = '#7c4426';
    context.fillRect(width/2, height/2, -width, -height);
    context.moveTo(-width/2, height/2);
    context.quadraticCurveTo(-width*(4/5), 0, -width / 2, -height/2);

    context.moveTo(width/2, -height/2);
    context.quadraticCurveTo(width*(4/5), 0, width / 2, height/2);

    context.moveTo(width / 2, -(height / 2)+1);
    context.bezierCurveTo(-width/2, -height,
                          width/2 , -height,
                          -width/2, -(height / 2)+1);          
    
    context.moveTo(width / 2, height / 2);
    context.quadraticCurveTo(0, height*(3/5), -width / 2, height / 2);

    context.fillStyle = '#7c4426';
    context.fill();
    context.closePath();
    

    // Bowsprit
    context.fillStyle = '#b3664c';
    context.fillRect(-1.5, -height, 3, 70);
    context.fillStyle = '#f9f6f5';
    context.fillRect(-width*(2/5), -height*(48/50), (4/5)*width, 2);

    // foremast
    context.beginPath();
    context.fillStyle = '#b3664c';
    context.arc(0, -height*(2/5), 5, 0, 2*Math.PI);
    context.fill();
    context.fillStyle = '#f9f6f5';
    context.fillRect(-(8/7)*width, -height*(2/5), (16/7)*width, 2);
    context.closePath();

    // main mast
    context.beginPath();
    context.fillStyle = '#b3664c';
    context.arc(0, 0, 5, 0, 2*Math.PI);
    context.fill();
    context.fillStyle = '#f9f6f5';
    context.fillRect(-(7/5)*width, 0, (14/5)*width, 2);
    context.closePath();

    // Mizzen mast
    context.beginPath();
    context.fillStyle = '#b3664c';
    context.arc(0, height/2.5, 5, 0, 2*Math.PI);
    context.fill();
    context.fillStyle = '#f9f6f5';
    context.fillRect(-(8/7)*width, height/2.5, (16/7)*width, 2);
    context.closePath();

    // Restore the context to its previous state
    context.restore();


}

function drawWake () {
    context.save();

    for (let i = 0; i < shipPath.length; i++) {
        let x = shipPath[i][0];
        let y = shipPath[i][1];

        context.moveTo(shipPosition[0], shipPosition[1]);
        context.fillStyle = "#fffffd58";
        context.fillRect(x,y,3,1);
    }
    context.restore();
}


function drawUI() {

    context.save();
    
    context.font = "20px sans"
    context.fillStyle = "#000000"

    let degrees = Math.round(shipAngle*(180/Math.PI),2) % 360;
    
    let speed = Math.round((getShipSpeed() + Number.EPSILON) * 100) / 100

    context.fillText(`Speed: ${speed}`, 30, 50);
    context.fillText(`Angle: ${degrees}°`, 30, 80);

    context.restore();
}