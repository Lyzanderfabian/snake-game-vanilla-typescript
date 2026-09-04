

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
    app!.innerHTML = ``

    const gameBoard = document.createElement("div");
    gameBoard.classList.add("game-board");

    const cellRow: number = 5;
    const cellCol :number = 7;
    const totalCell: number = cellRow * cellCol; 

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

    //game logic
    //
    //initialization

    // xy0 y1 y2 y3 y4
    // 1x
    // 2x
    // 3x
    // 4x

    
    let score = 0;
    let boardArray: number[][] = Array.from({length: cellRow}, () => Array(cellCol).fill(0))
    let snake: number[][] = Array.from({length: 3}, () => Array(2).fill(0))



    // console.log(structuredClone(snake))

    let head =[...snake[snake.length-1]];
    const up: string[] = ["KeyW", "ArrowUp"]
    const down: string[] = ["KeyS", "ArrowDown"]
    const left: string[] = ["KeyA", "ArrowLeft"]
    const right: string[] = ["KeyD", "ArrowRight"]
    type Directions = "North" | "South" | "East" | "West";
    let currentDirection: Directions = "East"
    let intervalId: number| undefined = undefined;

    //TODO: make function for this; the moveSnake
    for(let i = 0; i < snake.length; i++) 
        boardArray[snake[i][0]][snake[i][1]] = 1;

    //TODO: make function for this; the rerender
    for (let i = 0; i < cellRow; i++) {
        for (let j = 0; j < cellCol; j++) {
            if (boardArray[i][j] === 1){
                const snakeBody = document.querySelector(`#cell-${i}-${j}`)
                snakeBody!.classList.add("blue-square")
            }
        } 
    }

    //TODO: write setinterval in the notebook, memory leaks
    //TODO: write the event listeners in the notebook, memory leaks
    //TODO: write the array references bugs in the notebook


    //functions
    const handleKeydown = (event: KeyboardEvent) => {
        if(currentDirection !== "South" && up.includes(event.code)){
            currentDirection = "North";
        }else if(currentDirection !== "North" && down.includes(event.code)){
            currentDirection = "South";
        }else if(currentDirection !== "East" && left.includes(event.code)){
            currentDirection = "West";
        }else if(currentDirection !== "West" && right.includes(event.code)){
            currentDirection = "East";
        }
    }

    const userInput = () => {
        if (currentDirection === "North"){
            head[0] = head[0] - 1;
        } else if (currentDirection === "South"){
            head[0] = head[0] + 1;
        } else if (currentDirection === "East"){
            head[1] = head[1] + 1;
        } else if (currentDirection === "West"){
            head[1] = head[1] - 1;

        }
        // console.log(1, head);
        
    }

    const moveSnake = () => {
        // console.log(2, head);
        // console.log(structuredClone(head))
        let newHead = [...head]
        // console.log(newHead);
        console.log(snake);
        snake.push(newHead)
        snake.shift();

        for (let i = 0; i < cellRow; i++) {
            for (let j = 0; j < cellCol; j++) {
                boardArray[i][j] = 0
            } 
        }

        for(let i = 0; i < snake.length; i++) 
            boardArray[snake[i][0]][snake[i][1]] = 1;
        // console.log(snake);
        
    }

    const rerender = () => {
        type Cell = Element | null | undefined;
        let resetCell: Cell = document.querySelector("#cell-0-0")

        //TODO: add apple-square
        // console.log(snake);
        // debugger
        //this cleaning worksss
        for(let i = 0; i < totalCell; i++){
            // if(i===8)console.log(resetCell!.className, "hi")
            resetCell!.classList.remove("blue-square")

            // if(i===8)console.log(resetCell!.className)
            resetCell = resetCell!.nextElementSibling
        }
        for (let i = 0; i < cellRow; i++) {
            for (let j = 0; j < cellCol; j++) {
                boardArray[i][j] === 0
            } 
        }
        // console.log(boardArray);
        // debugger
        for (let i = 0; i < cellRow; i++) {
            for (let j = 0; j < cellCol; j++) {
                if (boardArray[i][j] === 1){
                    const snakeBody = document.querySelector(`#cell-${i}-${j}`)
                    snakeBody!.classList.add("blue-square")
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

        window.addEventListener("keydown", handleKeydown);
        intervalId = window.setInterval(gameloop, 1000);
    }

    //TODO: fix memory leak when backing and refreshing
    const gameStop = () => {
        if(intervalId !== undefined){
            window.removeEventListener("keydown", handleKeydown);
            clearInterval(intervalId);
            intervalId = undefined;
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



