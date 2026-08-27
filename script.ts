const body = document.querySelector("body");
body!.classList.add("full")

const app = document.querySelector("#app");

const background = document.createElement("div")
background.classList.add("background")
app!.append(background)

const panel = document.createElement("div")
panel.classList.add("container")
app!.append(panel)

panel!.innerHTML= `
  <div class="container" id="main-container">
    <h1 class="title" id="game-title">Snake Game</h1>
    <div class="buttons" id="home-buttons">
        <button class="play button" id="play-button">Play</button>
        <button class="settings button" id="settings-button">Settings</button>
    </div>
  </div>
`;


for (let i = 0; i < 4; i++) {
  const square = document.createElement("div")

  square.classList.add(i % 2 === 0 ? "light-square" : "dark-square")

  background!.append(square)
}




