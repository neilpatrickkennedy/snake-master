import scoreSound from "../assets/audio/score.wav";


export class Score {

    constructor(score, highScore) {
        if ([null, undefined].includes(score)) score = 0;
        if ([null, undefined].includes(highScore)) highScore = score;
        if ([null, undefined].includes(localStorage["high-score"])) localStorage["high-score"] = 0;
        localStorage["high-score"] = Math.max(localStorage["high-score"], highScore);
        highScore = localStorage["high-score"];
        this.score = score;
        this.highScore = highScore;
        this.scores = [];
    }

    updateScoreBoardElement(score, bonus, newHighScore) {

        let scoreElement = document.querySelector(".score-board .score"),
            bonusElement = document.querySelector(".score-board .bonus"),
            highScoreElement = document.querySelector(".score-board .high-score");
        highScoreElement.classList.remove("high-score-new");
        scoreElement.innerText = `Score: ${this.score}`;
        if (bonus) bonusElement.innerText = `Bonus +${score}`;
        else bonusElement.innerText = "";
        highScoreElement.innerText = `High Score: ${this.highScore}`;
        if (newHighScore) highScoreElement.classList.add("high-score-new");

        let scoreBoardElement = document.querySelector(".score-board");
        scoreBoardElement.replaceChildren();
        [scoreElement, bonusElement, highScoreElement].forEach(child => scoreBoardElement.appendChild(child));

    }

    addScore(score, bonus) {
        this.score += score;
        let updateHighScore = this.score > this.highScore;
        if (updateHighScore) {
            this.highScore = this.score;
            localStorage["high-score"] = this.highScore;
        }
        this.updateScoreBoardElement(score, bonus, updateHighScore);
    }

    saveScore() {
        this.scores.push(this.score);
    }

    getLevelScore(level){
        if (level == 0) return this.score;
        else return this.score - this.scores[level - 1];
    }

    getScoreSound() {
        return new Audio(scoreSound);
    }
}
