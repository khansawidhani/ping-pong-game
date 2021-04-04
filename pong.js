//selecting elements
let canvas = document.getElementById('grid');
let draw = canvas.getContext('2d');

//Defining Objects 
// user paddle
const user = {
    x: 0,
    y: canvas.height/2 -100/2,
    width: 10,
    height: 100,
    color: 'orange', 
    score: 0,

}
// computer paddle
const computer = {
    x: canvas.width - 10,
    y: canvas.height/2 -100/2,
    width: 10,
    height: 100,
    color: 'orange', 
    score: 0,
    
}
// create the ball
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: 'white' 
}
// creating net object
const net = {
    x: canvas.width/2 -1,
    y: 0,
    width: 2,
    height: 10,
    color:'green'
}

// defining Functions here
// draw rectangle
function drawRect(x, y, w, h, color){
    draw.fillStyle = color;
    draw.fillRect(x, y, w, h);
}
// draw circle
function drawBall(x, y, r, color){
    draw.fillStyle = color;
    draw.beginPath();
    draw.arc(x, y, r, 0, Math.PI*2, false);
    draw.closePath();
    draw.fill();
}
// draw text
function drawText(text, x, y, color){
    draw.fillStyle = color;
    draw.font = '60px fantasy';
    draw.fillText(text, x, y);
}
// draw Net
function drawNet(){
    for(let i = 0; i < canvas.height; i+=15){
        drawRect(net.x, net.y+i, net.width, net.height, net.color);
    }
}
function render(){
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    
    // draw net
    drawNet();

    //draw scores
    drawText(user.score, canvas.width/4, canvas.height/5, 'white');
    drawText(computer.score, 3*canvas.width/4, canvas.height/5, 'white');
    
    //draw user and computer paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);

    //draw the ball
    drawBall(ball.x, ball.y, ball.radius, 'white');
}
// controlling user's paddle
canvas.addEventListener('mousemove', movePaddle);
function movePaddle(event){
    let rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height/2;
}
// collision detection
function collision(b, p){ //ball and player
    //player
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    //ball
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
}
// creating reset function for ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height /2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}
// update : position, movement, scores ...
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
     // creating simpel AI to control computer's paddle
     let computerLevel = 0.1;
     computer.y += (ball.y - (computer.y + computer.height/2)) * computerLevel;

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < canvas.width/2) ? user : computer;
    if(collision(ball, player)){
        //where the ball hit the player
        let collidePoint = ball.y - (user.y + user.height/2);

        // normalization
        collidePoint = collidePoint/(player.height/2);

        // calculating angle in radian
        let angle = (Math.PI/4) * collidePoint;
        // X direction of the ball when it hits
        let direction = (ball.x < canvas.width/2) ? 1 : -1;
        
        // changing velocity X and Y 
        ball.velocityX = direction* ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        // everytime the ball hit the paddle, it will increase its speed
        ball.speed += 0.1;
    }
    // update the scores
    if(ball.x - ball.radius < 0){
        // the computer win
        computer.score++;
        resetBall();
    }
    else if(ball.x + ball.radius > canvas.width){
        // the user win
        user.score++;
        resetBall();
    }

}
// game init
function game(){
    //Movement, collision detection, update of scores
    update();
    // lets render it all
    render();

}
// looping it
const framesPerSecond = 50;
setInterval(game, 1000/framesPerSecond);
