"use strict";
let canvas;
let context;

var shipAngle = 0; 
var windAngle = Math.PI; 
var shipX = 250; 
var shipY = 250;

function getShipSpeed(shipAngle, windAngle) {
    let theta = (Math.PI - windAngle + shipAngle) % (2*Math.PI);
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
    const rotationSpeed = 0.07; // Rotation speed in radians

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
    let width = 30;
    let height = 100;

    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    context.fillStyle = '#ff8080';

    var offsetX = shipX - canvas.width / 2;
    var offsetY = shipY - canvas.height / 2;

    // Save the current context state
    context.save();

    context.translate(offsetX, offsetY); // Translate the canvas

    let shipSpeed = getShipSpeed(shipAngle, windAngle);
    shipX += 0.3*Math.sin(shipAngle)*shipSpeed;
    shipY -= 0.3*Math.cos(shipAngle)*shipSpeed; 

    // Move the origin to the center of the rectangle
    context.translate(shipX + width / 2, shipY + height / 2);
    
    // Rotate the context based on the ship angle
    context.rotate(shipAngle);
    
    // Draw the rectangle, with the new transformed coordinates
    context.fillRect(-width / 2, -height / 2, width, height);
    
    // Restore the context to its previous state
    context.restore();


    context.font = "bold 20px serif"
    context.fillStyle = "#000000"

    let degrees = Math.round(shipAngle*(180/Math.PI),2) % 360;
    
    let speed = Math.round((shipSpeed + Number.EPSILON) * 100) / 100

    context.fillText(`Speed = ${speed}`, 30, 50);
    context.fillText(`Angle = ${degrees}°`, 30, 80);


}
