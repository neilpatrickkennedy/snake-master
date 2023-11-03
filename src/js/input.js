export class Input {

    constructor(X, Y, uTurnForbidden) {
        if ([null, undefined].includes(uTurnForbidden)) uTurnForbidden = true;
        this.X = X || 0;
        this.Y = Y || 0;
        this.uTurnForbidden = uTurnForbidden;
        this.directionSet = false;
        this.paused = false;
    }

    setDirection(newMove) {
        this.unPauseGame();
        if (this.directionSet) return false;
        if (this.X == newMove.X && this.Y == newMove.Y) return false;
        if (this.uTurnForbidden) {
            if (Math.abs(this.X) > 0 && Math.abs(newMove.X)) return false;
            if (Math.abs(this.Y) > 0 && Math.abs(newMove.Y)) return false;
        }
        this.X = newMove.X;
        this.Y = newMove.Y;
        this.directionSet = true;
        return true;
    }

    getMove() {
        let move = {X: this.X, Y: this.Y};
        this.directionSet = false;
        return move;
    }

    pauseGame() {
        if (this.paused) return false;
        let pauseDiv = document.querySelector(".controls .pause");
        pauseDiv.innerHTML = "&#x23EF;"
        pauseDiv.classList.add("pause-active");
        this.paused = true;
        return true;
    }

    unPauseGame() {
        if (!this.paused) return false;
        let pauseDiv = document.querySelector(".controls .pause");
        pauseDiv.innerHTML = "&#x23EF;"
        pauseDiv.classList.remove("pause-active");
        this.paused = false;
        return true;
    }

    handlePause () {
        if (this.paused) this.unPauseGame();
        else this.pauseGame();
    }

    handleKeyPress(keyPress) {
        if (keyPress.code == "ArrowUp") return this.setDirection({X: 0, Y: 1});
        if (keyPress.code == "ArrowDown") return this.setDirection({X: 0, Y: -1});
        if (keyPress.code == "ArrowRight") return this.setDirection({X: 1, Y: 0});
        if (keyPress.code == "ArrowLeft") return this.setDirection({X: -1, Y: 0});
        if (keyPress.code == "Space") this.handlePause();
    }

    handleClick(click) {
        if (click.target.classList.value.includes("refresh")) return location.reload();
        if (click.target.classList.value.includes("arrow-up")) return this.setDirection({X: 0, Y: 1});
        if (click.target.classList.value.includes("arrow-down")) return this.setDirection({X: 0, Y: -1});
        if (click.target.classList.value.includes("arrow-right")) return this.setDirection({X: 1, Y: 0});
        if (click.target.classList.value.includes("arrow-left")) return this.setDirection({X: -1, Y: 0});
        if (click.target.classList.value.includes("pause")) return this.handlePause();
    }

    registerHandlers() {
        document.addEventListener("keyup", this.handleKeyPress.bind(this));
        document.addEventListener("click", this.handleClick.bind(this));
    }

}
