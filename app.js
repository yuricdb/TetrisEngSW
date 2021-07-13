document.addEventListener('DOMContentLoaded', () => {
  let nome = document.querySelector('.nome'); //coloquei agora
  let verifyExistName = localStorage.getItem('name')
  if (verifyExistName === null) {
    var nomeDigitado = prompt('Digite seu nome de jogador:')
    nome.textContent = nomeDigitado;
    localStorage.setItem('name', nomeDigitado)
  } else {
    nome.textContent = verifyExistName;
  }
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const highestScoreDisplay = document.querySelector('#highestScore')
  const levelDisplay = document.querySelector('#level')
  const startBtn = document.querySelector('#start-button') 
  const onOffBtn = document.querySelector('#onOff-button'); 
  const resetBtn = document.querySelector("#reset-button");
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  let level = 0
  let status = 'off';

  // Audios game  
  let lineDrop = document.getElementById('lineDrop');    
  let slowHit = document.getElementById('slowHit');
  let audioRotation = document.getElementById('audioRotation'); 
  let audioPause = document.getElementById('audioPause'); 
  let audioGameOver = document.getElementById('audioGameOver');
  sound = 'off' 
  
  

   
  //The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const l2Tetromino = [
    [1,width+1,width*2+1, width*2+2], //
    [width, width+1, width+2, width*2], //
    [2, 1, width+2, width*2+2],
    [width+2, width*2, width*2+1, width*2+2] //
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const z2Tetromino = [
    [1,width+1,width, width*2],
    [width, width+1,width*2+1,width*2+2],
    [1,width+1,width, width*2],
    [width, width+1,width*2+1,width*2+2]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, l2Tetromino, zTetromino,  z2Tetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  //draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }

  //undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''

    })
  }

  //assign functions to keyCodes
  function control(e) {
    if (status === 'on') {
      if(e.keyCode === 37) {
        moveLeft()
      } else if (e.keyCode === 38) {
        rotate()
      } else if (e.keyCode === 39) {
        moveRight()
      } else if (e.keyCode === 40) {
        moveDown()
      }
    }
  }

  document.addEventListener('keyup', control)
  

  //move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()

  }

  //teste velocidade
  var segundos = 1000

  //Adicionando highest score
  let verifyExistHighestScore = localStorage.getItem('highestScore')
  if (verifyExistHighestScore === null) {
    localStorage.setItem('highestScore', 0)
    highestScoreDisplay.innerHTML = 0
  } else {
    highestScoreDisplay.innerHTML = verifyExistHighestScore
  }
  
  //freeze function
  function freeze() { 
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      if (sound === 'on'){
      slowHit.play();
      }
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() { 
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1      
    }
    draw()
  }

  
  ///FIX ROTATION OF TETROMINOS A THE EDGE 
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }
  
  //rotate the tetromino
  function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw()
    if (sound === 'on'){
    audioRotation.play();
    }
  }
  /////////
  
  
  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0


  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [2, 1, displayWidth+2, displayWidth*2+2], //(l2) verificar se a rotação é semelhante a de cima
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1,displayWidth+1,displayWidth, displayWidth*2], //z2
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }
  
  //add functionality to the button ON OFF
  onOffBtn.addEventListener('click',()=>{

    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })

    squares.forEach(index => {
      if(index.hasAttribute('tetromino'))        
        index.setAttribute('style', nullValue);
        index.classList.remove('tetromino');      
    })

    for (let i = 0; i < 199; i +=width) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        row.forEach(index => {
          squares[index].classList.remove('taken')
        })
    }

    clearInterval(timerId)
    timerId = null
    if (sound === 'on'){
    audioPause.play();
    }
    score = 0
    scoreDisplay.innerHTML = 0
    currentPosition = 4
    currentRotation = 0
    segundos = 1000 
    levelDisplay.innerHTML = 0
    level = 0

    if ((!timerId) && (status === 'off')) {
      let nomeDigitado = prompt('Digite seu nome de jogador:')
      nome.textContent = nomeDigitado;
      status = 'on';
      audioTheme.play()
      sound = 'on'
    } else {
      nome.textContent = "";
      status = 'off';
      audioTheme.pause()
      sound = 'off'
    }
    

  })
  


  //add functionality to the button star
  startBtn.addEventListener('click', () => {    

    if (status === 'off') {
      alert("Aparelho desligado. Ligar para iniciar!")
      return false;
    }

    if (timerId) {
      clearInterval(timerId)
      timerId = null
      if (sound === 'on'){
        audioPause.play();
      }
    } else {
      draw()
      timerId = setInterval(moveDown, segundos) //moveDown, 1000
      //nextRandom = Math.floor(Math.random()*theTetrominoes.length) //problema, sempre que aperta start muda o obj seguinte
      displayShape()
      
    }
  })
  
  //add functionality to the button reset
  resetBtn.addEventListener('click',()=>{

    if (status === 'off') {
      alert("Inicie o jogo.")
      return false;
    }

    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })

    squares.forEach(index => {
      if(index.hasAttribute('tetromino'))        
        index.setAttribute('style', nullValue);
        index.classList.remove('tetromino');      
    })

    for (let i = 0; i < 199; i +=width) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        row.forEach(index => {
          squares[index].classList.remove('taken')
        })
    }

    clearInterval(timerId)
    timerId = null
    if (sound === 'on'){
    audioPause.play();
    }
    score = 0
    scoreDisplay.innerHTML = 0
    currentPosition = 4
    currentRotation = 0
    level = 0
    levelDisplay.innerHTML = 0
    segundos = 1000

    draw()
    timerId = setInterval(moveDown, segundos) //moveDown, 1000
    //nextRandom = Math.floor(Math.random()*theTetrominoes.length) //problema, sempre que aperta start muda o obj seguinte
    displayShape()
  })

  //add score
  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
        if ((score%100) === 0){
          /*clearInterval(timerTeste)
          timerTeste = setInterval(teste2, 1000)*/
          segundos -= 100
          clearInterval(timerId)
          timerId = setInterval(moveDown, segundos) 
          level +=1
          levelDisplay.innerHTML = level
        }
        let highestScore = localStorage.getItem('highestScore')
        if (score > highestScore) {
          highestScoreDisplay.innerHTML = score
          localStorage.setItem('highestScore', score)
        }
        if (sound === 'on'){
          lineDrop.play();
        }
      }
    }
    console.log(segundos)
  }

  //game over
  function gameOver() {    
    let audioTheme = document.getElementById('audioTheme');

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      levelDisplay.innerHTML = 'end'
      clearInterval(timerId)

      let audioTheme = document.getElementById('audioTheme');
      if(audioTheme.paused){
        if (sound === 'on'){
        audioGameOver.play();
        } 
      }else{
        togglePlay(audioTheme);     
        setTimeout(function(){ 
          if (sound === 'on'){
          audioGameOver.play(); 
          }
        }, 500);
      }      
      
      
      //audioGameOver.play();

    }
  }

})

// AudioTheme
function togglePlay(audioTheme) {
  return audioTheme.paused ? audioTheme.play() : audioTheme.pause();
};

// Sound Theme of the Game
function activateSound(){  
  let audioTheme = document.getElementById('audioTheme');
  togglePlay(audioTheme)
  if (sound === 'on'){
    sound = 'off'
  } else {
    sound = 'on'
  }
   
}
