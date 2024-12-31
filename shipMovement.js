"use strict";
let canvas;
let context;

// Note: split up the movement logic and the drawing

var shipAngle = 0; 
var shipSpeed = 0;
var windAngle = Math.PI; 
var shipX = 500; 
var shipY = 250;

var shipPath = [[shipX, shipY]];

function getShipSpeed(shipAngle, windAngle) {
    let theta = ((3*Math.PI/2) - windAngle + shipAngle) % (2*Math.PI);
    let speed = -1*(Math.sin(2-Math.sin(theta)) + Math.cos(theta)*Math.cos(theta));
    return speed;
}

window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
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
    const rotationSpeed = 0.1; // Rotation speed in radians

    switch (event.key) {
        case 'a':
            shipAngle -= rotationSpeed; // Rotate counterclockwise
            break;
        case 'd':
            shipAngle += rotationSpeed; // Rotate clockwise
            break;
        case 'w':
            shipX += Math.sin(shipAngle);
            shipY -= Math.cos(shipAngle); 
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
    let width = 20;
    let height = 60;

    context.fillStyle = '#7c4426';

    // Save the current context state
    context.save();

    // Update ship position
    shipSpeed = getShipSpeed(shipAngle, windAngle);
    shipX += Math.sin(shipAngle) * shipSpeed;
    shipY -= Math.cos(shipAngle) * shipSpeed;

    shipPath.push([shipX, shipY])

    // Translate and rotate the canvas
    context.translate(shipX, shipY);
    context.rotate(shipAngle);

    // Drawing the base rectangle for the ship

    // Drawing the border of the ship
    context.beginPath(); // Starting a new path to avoid persisting old paths

    context.moveTo(width/2, height/2);
    context.quadraticCurveTo(-width/5, 0, width / 2, -height / 2);

    context.moveTo(-width / 2, (height / 2)-1); 
    context.bezierCurveTo(0.4, height - 0.35,
                          0.6, height - 0.5,
                          width/2, (height / 2)-1);


    context.moveTo(-width / 2, -height / 2);
    context.quadraticCurveTo(0, -height*(3/5), width / 2, -height / 2);

    

    context.fill();
    context.closePath();

    // Restore the context to its previous state
    context.restore();

}

function drawWake () {
    context.save();

    for (let i = 0; i < shipPath.length; i++) {
        let x = shipPath[i][0];
        let y = shipPath[i][1];
        context.arc(x, y, 10, 0, Math.PI);
        context.strokeStyle = "#ffffff13";
      }
      context.stroke();
    context.restore();
}


function drawUI() {

    context.save();
    
    context.font = "20px sans"
    context.fillStyle = "#000000"

    let degrees = Math.round(shipAngle*(180/Math.PI),2) % 360;
    
    let speed = Math.round((shipSpeed + Number.EPSILON) * 100) / 100

    context.fillText(`Speed: ${speed}`, 30, 50);
    context.fillText(`Angle: ${degrees}°`, 30, 80);

    context.restore();
}