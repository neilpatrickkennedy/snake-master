import playGameSound from "../assets/audio/play-game.mp3";
import gameOverSound from "../assets/audio/death.ogg";
import winSound from "../assets/audio/win.ogg";


const openModal = () => {
    document.querySelector(".modal").style.display = "block"
    document.querySelector(".modal").classList.add("show")
};

const closeModal = () => {
    document.querySelector(".modal").style.display = "none"
    document.querySelector(".modal").classList.remove("show")
};

export const renderStartModal = (show) => {
    if ([undefined, null].includes(show)) show = true;
    let modalElement = document.querySelector(".modal");
    modalElement.querySelector(".modal-title").innerText = "::: Snake Master ::: ";
    modalElement.querySelector(".modal-body").innerHTML = `
        <div class="modal-body">
            <p> Use arrow keys to move snake. </p>
            <p> Spacebar to pause game. </p>
            <p> Arrow keys or spacebar to unpause. </p>
            <p> Or use control pad below. </p>
        </div>`;
    let btn = modalElement.querySelector(".modal-footer .btn");
    btn.innerText = "PLAY";
    btn.addEventListener("click", () => {
        (new Audio(playGameSound)).play();
        closeModal();
    });
    if (show) openModal();
}

export const renderGameOverModal = async (score, highScore) => {
    let modalElement = document.querySelector(".modal");
    modalElement.querySelector(".modal-title").innerText = "::: Game Over ::: ";
    let content = `
        <p> Congratulations! Your score is: ${score}! </p>
        <p> Try to beat the high score of ${highScore} </p>
        <p> Press 'RESTART' to play again. </p>`;
    modalElement.querySelector(".modal-body").setHTML(content);
    let btn = modalElement.querySelector(".modal-footer .btn");
    btn.innerText = "RESTART";
    openModal();
    btn.addEventListener("click", () => location.reload());
    await (new Audio(gameOverSound)).play();
}

export const renderGameWonModal = async (score, highScore) => {
    let modalElement = document.querySelector(".modal");
    modalElement.querySelector(".modal-title").innerText = "::: You Win! ::: ";
    let content = `
        <p> Congratulations! You've won! </p>
        <p> Your score is: ${score}! </p>
        <p> Try to beat the high score of ${highScore} </p>
        <p> Press 'RESTART' to play again. </p>`;
    modalElement.querySelector(".modal-body").setHTML(content);
    let btn = modalElement.querySelector(".modal-footer .btn");
    btn.innerText = "RESTART";
    openModal();
    btn.addEventListener("click", () => location.reload());
    await (new Audio(winSound)).play();
}
