//half the screen
//add snake texture
//acceleration and brakingx
//add animations?
//add scoring and timers

const renderHome = () => {
    //body
    const body = document.querySelector("body");
    body!.classList.add("full")

    //app
    const app = document.querySelector("#app");

    //background
    const background = document.createElement("div")
    background.classList.add("background")
    app!.append(background)

    //panel
    const panel = document.createElement("div")
    panel.classList.add("outer-container")
    app!.append(panel)

    panel!.innerHTML= `
        <div class="inner-container">
        <header class="header" id="home-header">
            <h1 class="title" id="game-title">Snake Game</h1>
            <h2>by Lyzander Fabian</h2>
        </header>
        <div class="buttons" id="home-buttons">
            <button class="play button" id="play-button">Play</button>
            <button class="settings button" id="settings-button">Settings</button>
        </div>
        </div>
    `;

    for (let i = 0; i < 253; i++) {
        const square = document.createElement("div")
        square.classList.add(i % 2 === 0 ? "light-square" : "dark-square")

        background!.append(square)
    }

    const playButton = document.querySelector("#play-button");
    const settingsButton = document.querySelector("#settings-button")

    playButton!.addEventListener("click", (event) => {
        // navigate("/game");
        renderGame();
    })
    settingsButton!.addEventListener("click", (event) => {
        // navigate("/settings");
    })
}


const renderGame = () => {

    const app = document.querySelector("#app");
    const cellRow: number = 6;
    const cellCol :number = 7;
    document.documentElement.style.setProperty('--cellRow', String(cellRow))
    document.documentElement.style.setProperty('--cellCol', String(cellCol))
    const totalCell: number = cellRow * cellCol; 
    let boardArray: number[][] = Array.from({length: cellRow}, () => Array(cellCol).fill(0))
    let snake: number[][] = [[1,1], [1,2], [1,3]]
    let head =[...snake[snake.length-1]];
    let apple: number[] = [2, 2];
    let score = 0;

    const up: string[] = ["KeyW", "ArrowUp"]
    const down: string[] = ["KeyS", "ArrowDown"]
    const left: string[] = ["KeyA", "ArrowLeft"]
    const right: string[] = ["KeyD", "ArrowRight"]
    type Directions = "North" | "South" | "East" | "West";
    let currentDirection: Directions = "East"
    let trueDirection: Directions = "East"

    let intervalId: number| undefined = undefined;

    
    //TODO: write setinterval in the notebook, memory leaks
    //TODO: write the event listeners in the notebook, memory leaks
    //TODO: write the array references bugs in the notebook
    //debugger, structured clone
    //TODO: write .includes doesnt work on 2d arrays
    //TODO:write how to connect variables in js to css

    //functions
    const initializeBoard = () => {
        boardArray = Array.from({length: cellRow}, () => Array(cellCol).fill(0))

        app!.innerHTML = ``

        const gameBoard = document.createElement("div");
        gameBoard.classList.add("game-board");

        for (let i = 0, k = 0; i < cellRow; i++) {
            for (let j = 0; j < cellCol; j++) {
                const cell = document.createElement("div");
                cell.setAttribute("id", `cell-${i}-${j}`);
                cell.classList.add(k % 2 === 0 ? "light-square" : "dark-square")
                gameBoard.append(cell);
                k++;
            }
        }
        app!.append(gameBoard);
    }

    const initializeSnake = () => {
        snake = [[1,1], [1,2], [1,3]]
        head = [...snake[snake.length-1]];
        currentDirection = "East"

        for(let i = 0; i < snake.length; i++) 
            boardArray[snake[i][0]][snake[i][1]] = 1;

        for (let i = 0; i < cellRow; i++) {
            for (let j = 0; j < cellCol; j++) {
                if (boardArray[i][j] === 1){
                    const snakeBody = document.querySelector(`#cell-${i}-${j}`)
                    snakeBody!.classList.add("blue-square")
                }
            } 
        }
    }

    const initializeApple = () => {
        apple = [2, 2];

        const currentApple = document.querySelector(`#cell-${apple[0]}-${apple[1]}`)
        currentApple!.classList.add("red-square")
    }

    const handleKeydown = (event: KeyboardEvent) => {
        if(trueDirection !== "South" && up.includes(event.code)){
            currentDirection = "North";
        }else 
            
        if(trueDirection !== "North" && down.includes(event.code)){
            currentDirection = "South";
        }else 
            
        if(trueDirection !== "East" && left.includes(event.code)){
            currentDirection = "West";
        }else 
            
        if(trueDirection !== "West" && right.includes(event.code)){
            currentDirection = "East";
        }
    }

    const userInput = () => {
        if (currentDirection === "North"){
            head[0]--;
        } else 

        if (currentDirection === "South"){
            head[0]++;
        } else 

        if (currentDirection === "East"){
            head[1]++;
        } else 

        if (currentDirection === "West"){
            head[1]--;
        }      
    }

    const appleEaten = (head: number[]): boolean => {
        let eligiblePosition: number[][] = [];

        if(apple[0] === head[0] && apple[1] === head[1]){
            boardArray[head[0]][head[1]] = 1;

            const currentApple = document.querySelector(`#cell-${apple[0]}-${apple[1]}`)
            currentApple!.classList.remove("red-square")

            for(let i = 0; i < cellRow; i++){
                for(let j = 0; j < cellCol; j++){
                    if(boardArray[i][j] === 0){
                        eligiblePosition.push([i,j])
                    }
                }
            }

            if(eligiblePosition.length === 0) {
                score++;
                gameStop("Win");
            }

            const pickPosition: number[] = eligiblePosition[Math.floor(Math.random()*eligiblePosition.length)]         

            apple[0] = pickPosition[0];
            apple[1] = pickPosition[1];

            return true
        }

        return false
    }

    const moveSnake = () => {
        if (head[0] === -1 || head[0] === cellRow ||
            head[1] === -1 || head[1] === cellCol)
        {
            gameStop("Lose")
        }

        let newHead = [...head]

        const tail: number[] = snake.shift()!;

        if(snake.some(row => JSON.stringify(row) === JSON.stringify(newHead))){
            gameStop("Lose")
        }

        snake.unshift(tail)

        trueDirection = currentDirection

        snake.push(newHead)

        if(appleEaten(newHead)){
            score++;
        } else {
            snake.shift();
        }

        for (let i = 0; i < cellRow; i++) {
            for (let j = 0; j < cellCol; j++) {
                boardArray[i][j] = 0
            } 
        }

        for(let i = 0; i < snake.length; i++) {
            boardArray[snake[i][0]][snake[i][1]] = 1;
        }

        boardArray[apple[0]][apple[1]] = 2;

    }

    const rerender = () => {
        type Cell = Element | null | undefined;
        let resetCell: Cell = document.querySelector("#cell-0-0")

        for(let i = 0; i < totalCell; i++){
            resetCell!.classList.remove("blue-square", "red-square")
            resetCell = resetCell!.nextElementSibling
        }

        for (let i = 0; i < cellRow; i++) {
            for (let j = 0; j < cellCol; j++) {
                boardArray[i][j] === 0
            } 
        }

        for (let i = 0; i < cellRow; i++) {
            for (let j = 0; j < cellCol; j++) {
                if (boardArray[i][j] === 1){
                    const snakeBody = document.querySelector(`#cell-${i}-${j}`)
                    snakeBody!.classList.add("blue-square")
                } else if (boardArray[i][j] === 2){
                    const apple = document.querySelector(`#cell-${i}-${j}`)
                    apple!.classList.add("red-square")
                }
            } 
        }
    }

    const gameloop = () => {
        userInput()
        moveSnake()
        rerender()
    }

    const gameStart = () => {
        if (intervalId !== undefined) return

        initializeBoard();
        initializeSnake();
        initializeApple();

        window.addEventListener("keydown", handleKeydown);
        intervalId = window.setInterval(gameloop, 500);
    }

    const handleWin = () => {
        rerender();
        app!.innerHTML = `
            <div class="outer-container">
                <header class="header" id="home-header">
                    <h1 class="title" id="game-title">WIN</h1>
                </header>
                <div class="buttons" id="home-buttons">
                    <button class="retry button" id="retry-button">Retry</button>
                </div>
            </div>
        `
        //TODO: write this shit
        const retryButton = document.querySelector("#retry-button") as HTMLElement;
        retryButton!.addEventListener("click", handleRetryButton);

    }

    const handleRetryButton = (event: MouseEvent) => {
        if(event.type === "click"){
            gameStart();
        } 
    }

    const handleLose = () => {
        
        app!.innerHTML = `
            <div class="outer-container">
                <header class="header" id="home-header">
                    <h1 class="title" id="game-title">LOSE</h1>
                </header>
                <div class="buttons" id="home-buttons">
                    <button class="retry button" id="retry-button">Retry</button>
                </div>
            </div>
        `
        const retryButton = document.querySelector("#retry-button") as HTMLElement;
        retryButton!.addEventListener("click", handleRetryButton);

    }

    //TODO: add / fix memory leak when backing and refreshing
    const gameStop = (reason:string) => {
        if(intervalId !== undefined){
            window.removeEventListener("keydown", handleKeydown);
            clearInterval(intervalId);
            intervalId = undefined;

            if(reason === "Lose") handleLose()
            if(reason === "Win") handleWin()
            
        }
    }
    clearInterval(intervalId);
    gameStart();
}











const renderSettings = () => {
    const app = document.querySelector("#app");
    app!.innerHTML = `<div class= "settings-board"> </div>`
}











// const router = () => {
//     const path = window.location.pathname;

//     if(path === "/home"){
//       renderHome();
//     } else if (path === "/game") {
//         renderGame();
//     } else if (path === "/settings"){
//       renderSettings();
//     } 
// }

// const navigate = (path: string) => {
//     history.pushState({}, "", path)
//     router()
// }


// navigate("/home");


renderHome();

    // xy0 y1 y2 y3 y4
    // 1x
    // 2x
    // 3x
    // 4x

