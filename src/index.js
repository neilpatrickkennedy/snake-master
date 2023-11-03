import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/style.css";
import { GameBoard } from "./js/gameboard.js";
import { renderStartModal, renderGameOverModal, renderGameWonModal } from "./js/modal.js";
import levelUpSoundSrc from "./assets/audio/level-up.wav";


class Game {

    constructor(width, height, level, snakeSeed, targetSeed, period) {
        
        if ([null, undefined].includes(width) || width < 6 || width > 50) width = 30;
        if ([null, undefined].includes(height) || height < 6 || height > 50) height = 30;
        if (![0, 1, 2, 3].includes(level)) level = 0;
        if ([null, undefined].includes(snakeSeed) || snakeSeed < 0 || snakeSeed >= 1) snakeSeed = Math.random();
        if ([null, undefined].includes(targetSeed) || targetSeed < 0 || targetSeed >= 1) targetSeed = Math.random();
        if ([null, undefined].includes(period) || period < 50 || period >= 10000) period = 150;
        
        this.width = width;
        this.height = height;
        this.cycles = 0;
        this.snakeSeed = snakeSeed;
        this.targetSeed = targetSeed;
        this.period = period;
        this.moves = [];
        this.sounds = [];
        this.gameBoard = new GameBoard(this.width, this.height, level, this.snakeSeed, this.targetSeed);

    }

    startGame() {
        this.gameBoard.input.registerHandlers(this.gameBoard.level > 0);
        renderStartModal(true);
        this.gameBoard.score.updateScoreBoardElement();
        this.gameBoard.updateGameBoardElement();
        document.querySelector(".controls .level").innerHTML = `Level ${this.gameBoard.level + 1}`;
    }

    async handleGameOver() {
        await renderGameOverModal(this.gameBoard.score.score, this.gameBoard.score.highScore);
    }
    
    async handleGameWon() {
        await renderGameWonModal(this.gameBoard.score.score, this.gameBoard.score.highScore);
    }

    checkLevelUp() {
        document.querySelector(".controls .level").classList.remove("level-up");
        let level = this.gameBoard.level;
        if (level == 3) return false;
        let lastScore = this.gameBoard.score.getLevelScore(level);
        if (level == 0) return (lastScore >= 10);
        if (level == 1) return (lastScore >= 30);
        if (level == 2) return (lastScore >= 50);
    }

    levelUp(){
        this.gameBoard.score.saveScore()
        this.gameBoard.level++;
        let levelUpElement = document.querySelector(".controls .level");
        levelUpElement.classList.add("level-up");
        levelUpElement.innerText = `Level ${this.gameBoard.level + 1}`;
        this.sounds.push(new Audio(levelUpSoundSrc));
    }

    updateScore(score, bonus) {
        if ([null, undefined].includes(bonus)) bonus = false;
        this.gameBoard.score.addScore(score, bonus);
        if (this.checkLevelUp()) this.levelUp();
    }

    addMoveSound() {
        let moveSound  = this.gameBoard.getMoveSound();
        if (!moveSound) return;
        this.sounds.push(moveSound);
    }

    addHitSound() {
        this.sounds.push(this.gameBoard.getHitSound());
    }

    addRemoveSound() {
        this.sounds.push(this.gameBoard.getRemoveSound());
    }

    addScoreSound() {
        this.sounds.push(this.gameBoard.score.getScoreSound());
    }

    addTargetSound() {
        this.sounds.push(this.gameBoard.getTargetSound());
    }

    playSounds() {
        Promise.all(this.sounds.map(sound => sound.play()));
    }

    async playRounds(targetSeed) {

        this.sounds = [];

        if (this.gameBoard.over) return await this.handleGameOver();
        if (this.gameBoard.won) return await this.handleGameWon();

        if (!this.gameBoard.input.paused) {

            if ([null, undefined].includes(targetSeed) || targetSeed < 0 || targetSeed >= 1) targetSeed = Math.random();
            let move = this.gameBoard.input.getMove();
            this.moves.push(move);
            let previousSnake = this.gameBoard.copySnake();
            this.gameBoard.moveSnake(move);
            this.addMoveSound();

            // Check for target hits
            if (this.gameBoard.checkHitsTarget()) {
                // Add point and segment for single hit
                this.updateScore(1, false);
                this.addHitSound();
                this.gameBoard.extendSnake();
                let t = this.gameBoard.targetLength;
                if (this.gameBoard.hits.length == t) {
                    // If target was completely eliminated, give bonus & remove segments for level > 0
                    if (this.gameBoard.level > 0) {
                        this.updateScore(t, true);
                        this.gameBoard.removeSegments(t);
                        this.addRemoveSound()
                        this.addScoreSound();
                    }
                    // Generate target. If cannot fit another target, you win!
                    let found = this.gameBoard.generateTarget(false, targetSeed);
                    if (!found) this.gameBoard.won = true;
                    this.addTargetSound();
                }
            } else {
                if (this.gameBoard.hits.length > 0){
                    // If target not completely eliminated, remove target & reset
                    let found = this.gameBoard.generateTarget(true, targetSeed);
                    if (!found) this.gameBoard.won = true;
                    this.addTargetSound();
                }
            }

            // Check for collision, if so end game
            this.gameBoard.checkHitsWall(previousSnake);
            this.gameBoard.checkHitsItself()

            // Update gameboard html
            this.gameBoard.updateGameBoardElement();
            this.playSounds();
            // Clean up temp grid items and classes
            this.gameBoard.cleanUp();

        }

        this.cycles++;

        setTimeout(this.playRounds.bind(this), this.period);

    }

    async play() {
        this.startGame();
        await this.playRounds();
    }
    
}

window.onload = async () => {
    let game = new Game();
    await game.play();
}; 