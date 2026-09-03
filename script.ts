

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
        navigate("/game");
    })
    settingsButton!.addEventListener("click", (event) => {
        navigate("/settings");
    })
}


const renderGame = () => {
    const app = document.querySelector("#app");
    app!.innerHTML = ``

    const gameBoard = document.createElement("div");
    gameBoard.classList.add("game-board");

    const cellRow: number = 7;
    const cellCol :number = 5;

    for (let i = 0, j=0; i < cellRow * cellCol; i++) {
        const cell = document.createElement("div");
        cell.setAttribute("id", `cell-${i}`)
        cell.classList.add(i % 2 === 0 ? "light-square" : "dark-square")
        gameBoard.append(cell);
    }
    app!.append(gameBoard);


}




const renderSettings = () => {
    const app = document.querySelector("#app");
    app!.innerHTML = `<div class= "settings-board"> </div>`
}

const router = () => {
    const path = window.location.pathname;

    if(path === "/home"){
      renderHome();
    } else if (path === "/game") {
        renderGame();
    } else if (path === "/settings"){
      renderSettings();
    } 
}

const navigate = (path: string) => {
    history.pushState({}, "", path)
    router()
}


navigate("/home");






