let shipAngle = 0;
let rudderAngle = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function rotateShip(degrees) {
    shipAngle += degrees;
    await sleep(100);
    $(".ship").css("transform", `rotate(${shipAngle }deg)`);
}

async function rotateRudder(direction) {
    $(".rudder").css("transform", `translate(50%, 200%)`);
    if (direction == 1) {
        $(".rudder").css("transform", `rotate(${-40}deg)`);
    }  else if (direction == -1) {
        $(".rudder").css("transform", `rotate(${40}deg)`);
    }
    await sleep(1000);
    $(".rudder").css("transform", `rotate(${0}deg)`);
}


$(document).on("keydown", function (event) {
    if (event.key === "a" || event.key === "A") {
        rotateRudder(-1);
        rotateShip(-5);

    } else if (event.key === "d" || event.key === "D") {
        rotateRudder(1);
        rotateShip(5);
    }
});