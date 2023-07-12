//board
let board;
let boardWidth = 360;
let boardHeight =640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x:birdX,
    y :birdY,
    width:birdWidth,
    height:birdHeight
};

//pipe
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipImg;

//physis
let velocityX = -2; //pipe move
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function(){
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d');

    //draw flappy bird 
    //context.fillstyle = 'green';
    //context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load Image
    birdImg = new Image();
    birdImg.src = './flappybird.png  ';
    birdImg.onload = function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }
    topPipeImg =new Image();
    topPipeImg.src = './toppipe.png'

    bottomPipImg = new Image();
    bottomPipImg.src = './bottompipe.png'
    
    requestAnimationFrame(update);
    setInterval(placePipes,1500);
    document.addEventListener('keydown',moveBird);
    document.addEventListener('ontouchstart',moveBird);
    document.addEventListener('touchstart',moveBird);
}
function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.height)


    //bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY,0); //apply gravity to cutrrent bird.y ,limit the bird to.y  top
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    if(bird.y>board.height){
        gameOver=true;
    }

    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x+=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        
        if(!pipe.passed && bird.x >pipe.x + pipe.width){
            score+=0.5;
            pipe.passed = true;
        }
        if(detectCollision(bird,pipe)){
            gameOver = true;
        }
    }
    //clear pipes 
    while(pipeArray.length>0&& pipeArray[0].x<-pipeWidth){
        pipeArray.shift();
    }
    context.fillStyle = 'white';
    context.font = '45px sans-serif';
    context.fillText(score,5,45);
    if(gameOver){
        context.fillText("Game Over",5,90);
    }
}
function placePipes(){
    if(gameOver){
        return;
    }

    let randomPipeY = pipeY -pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe ={
        img:topPipeImg,
        x:pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }
    pipeArray.push(topPipe);

    let bottomPipe ={
        img:bottomPipImg,
        x:pipeX,
        y:randomPipeY +pipeHeight +openingSpace,
        width:pipeWidth,
        height:pipeHeight,
        passed:false,
    }
    pipeArray.push(bottomPipe);
}
function moveBird(e){
    if(e.code =="Space"|| e.code=="touchstart" || e.code =="ArrowUp" || e.code=="ontouchstart" ||e.code=="KeyX"){
        //jump
        velocityY = -6;
        //restet game
        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score =0;
            gameOver = false;
        }
    }
}
function detectCollision(a,b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y +a.height >b.y;
}