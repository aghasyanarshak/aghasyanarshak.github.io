let myFigures = {
    O:[
        [1,1],
        [1,1],
    ],
    I:[
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
    ],
    S:[
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    Z:[
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    L:[
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    J:[
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    T:[
        [1,1,1],
        [0,1,0],
        [0,0,0],
    ],
};
const board = document.querySelector('.board');
let pointsElem = document.getElementById('points');
let levelElem = document.getElementById('level');
let nextFigureElem = document.getElementById('next_Figure');
let startBtn = document.getElementById('start');
let pausetBtn = document.getElementById('pause');
let gameOver = document.getElementById('gameOver');
let isPaused = true;
let isStart = false;
let playfield = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
];
// let playfield = Array(20).fill(Array(10).fill(0));

let score = 0;
let gameTimerId;
let currentLevel = 1;
let possibleLevels ={
    1:{
        scorePerLine:10,
        speed:400,
        nextLevelScore:20,
    },
    2:{
        scorePerLine:15,
        speed:300,
        nextLevelScore:500,
    },
    3:{
        scorePerLine:20,
        speed:200,
        nextLevelScore:1000,
    },
    4:{
        scorePerLine:30,
        speed:100,
        nextLevelScore:2000,
    },
    5:{
        scorePerLine:50,
        speed:50,
        nextLevelScore:Infinity,
    },
    
}; 
let activeFigure = getNewFigure();
let nextFigure = getNewFigure();
function draw(){
    let bordInnerHtml = '';
    for(let y = 0; y < playfield.length; y++){
        for (let x = 0; x < playfield[y].length; x++) {
            if(playfield[y][x] === 1){
                bordInnerHtml +='<div class = "cell movingCell"></div>';
            }else if(playfield[y][x] === 2){
                bordInnerHtml +='<div class = "cell fixedCell"></div>';
            }
            else{
                bordInnerHtml +='<div class = "cell"></div>';
            }
        }
    }
    board.innerHTML = bordInnerHtml;
}

function showNextFigure() {
    let nextFigureInnerHtml = '';
    for (let y = 0; y < nextFigure.shape.length; y++) {
        for (let x = 0;x < nextFigure.shape[y].length;x++) {
           if(nextFigure.shape[y][x]){
                nextFigureInnerHtml += '<div class = "cell movingCell"></div>';
           }else{
            nextFigureInnerHtml +='<div class = "cell"></div>';
           }   
        }
        nextFigureInnerHtml += "<br/>"; 
    }
    nextFigureElem.innerHTML = nextFigureInnerHtml;
}

function removePrevActiveFigure() {
    for(let y = 0; y < playfield.length; y++){
        for (let x = 0; x < playfield[y].length; x++) {
            if(playfield[y][x] === 1){
                playfield[y][x] =0;
            }
        }
    }
}
function addActiveFigure() {
    removePrevActiveFigure();
    for (let y = 0; y < activeFigure.shape.length; y++) {
        for (let x = 0; x < activeFigure.shape[y].length; x++) {
           if(activeFigure.shape[y][x] === 1){
            playfield[activeFigure.y + y][activeFigure.x + x] = 
            activeFigure.shape[y][x];
           }  
        } 
    }
}

function rotateFigure() {
    const prevFigureState = activeFigure.shape;
    activeFigure.shape = activeFigure.shape[0].map((val, index)=>
    activeFigure.shape.map((row)=>row[index]).reverse()
    );
    if(hasMistakes()){
        activeFigure.shape = prevFigureState;
    }
}
function hasMistakes() {
    for (let y = 0; y < activeFigure.shape.length; y++) {
        for (let x = 0; x < activeFigure.shape[y].length; x++) {
            if(activeFigure.shape[y][x] &&
                 (playfield[activeFigure.y + y] === undefined ||
                 playfield[activeFigure.y + y][activeFigure.x + x] === undefined ||
                 playfield[activeFigure.y + y][activeFigure.x + x] === 2)
                 ){
                return true;
            }
        }
    }
    return false;
}
   

function removeFullLine() {
    let canRemoveLine = true,
    fullLines = 0;
    for(let y = 0; y < playfield.length; y++){
        for (let x = 0; x < playfield[y].length; x++) {
            if(playfield[y][x] !== 2){
                canRemoveLine = false;
                break;
            }
        }
        if(canRemoveLine){
            playfield.splice(y,1);
            playfield.splice(0,0,[0,0,0,0,0,0,0,0,0,0]);
            fullLines += 1;
            
        }
        canRemoveLine = true;
    }
    switch (fullLines) {
        case 1:
            score += possibleLevels[currentLevel].scorePerLine;
            break;
        case 2:
            score += possibleLevels[currentLevel].scorePerLine * 3;
            break;
        case 3:
            score += possibleLevels[currentLevel].scorePerLine * 6;
            break;
        case 4:
            score += possibleLevels[currentLevel].scorePerLine * 12;
            break;
    }
    pointsElem.innerHTML =score;
    if(score >= possibleLevels[currentLevel].nextLevelScore){
        currentLevel++;
        levelElem.innerHTML = currentLevel;
    }
}

function getNewFigure(){
    const possibleFigure = 'IOLJTSZ';
    const randFigure = Math.floor(Math.random()*7);
    const newFigure = myFigures[possibleFigure[randFigure]];
    return {
        x:Math.floor((10 - newFigure[0].length)/2),
        y:0,
        shape:newFigure,
    };
}
function fixFigure() {
    for(let y = 0; y < playfield.length; y++){
        for (let x = 0; x < playfield[y].length; x++) {
            if(playfield[y][x] === 1){
                playfield[y][x] = 2;
            }
        }
    }
}
function moveDown() {
    activeFigure.y +=1;
    if(hasMistakes()){
        activeFigure.y -= 1;
        fixFigure();
        removeFullLine();
        activeFigure = nextFigure;
        if(hasMistakes()){
            restart();
            // alert('over')
        }
        nextFigure = getNewFigure();  
    }   
}

function restart() {
    isPaused = true;
    clearTimeout(gameTimerId);
    playfield = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
    ];
    draw();
    gameOver.style.display = 'block';
    isStart = false;
    
}

function dropFifure(){
    for (let y = activeFigure.y; y < playfield.length; y++){
            activeFigure.y +=1;
            if(hasMistakes()){
                activeFigure.y -=1;
                break;
            }
    }
}
window.addEventListener('keydown', (e) => {
    // console.log(e);
    if(!isPaused){
        if (e.key === 'ArrowDown') {
            moveDown();
        }else if(e.key === 'ArrowLeft'){
            activeFigure.x -=1;
            if(hasMistakes()){
                activeFigure.x +=1;
            }
        }else if(e.key === 'ArrowRight'){
            activeFigure.x +=1;
            if(hasMistakes()){
                activeFigure.x -=1;
            }
        }else if(e.key === 'ArrowUp'){
            rotateFigure();
        }else if(e.key === " "){
            // console.log('test')
            dropFifure();
        }
        updateGame();
    }
    
});

function updateGame(){
    if(!isPaused){
        addActiveFigure();
        draw();
        showNextFigure();
        
    }
    
}
pausetBtn.addEventListener('click',(e) =>{ 
    if(e.target.innerHTML === 'Pause'){
        e.target.innerHTML = 'Play';
        clearTimeout(gameTimerId);
        
    }else{
        e.target.innerHTML = 'Pause';
        gameTimerId = setTimeout(startGame,possibleLevels[currentLevel].speed); 
    }
    isPaused = !isPaused;
    e.target.blur();
});

startBtn.addEventListener('click',(e) =>{
    // e.target.innerHTML = 'Start again';
    if( isStart === false ) {
        score = 0;
        currentLevel = 1;
        pointsElem.innerHTML =score;
        levelElem.innerHTML = currentLevel;
        isPaused = false;
        gameTimerId = setTimeout(startGame,possibleLevels[currentLevel].speed);
        gameOver.style.display ='none';
        isStart = true;
        // score = 0;
        // currentLevel = 1;    
        e.target.blur();
    }
  
});

pointsElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

// addActiveFigure();
draw();
// showNextFigure();

function startGame() {
    moveDown();
    if(!isPaused){
        updateGame()
        gameTimerId = setTimeout(startGame,possibleLevels[currentLevel].speed);
    } 
}


