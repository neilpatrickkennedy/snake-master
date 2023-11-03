import { splitSeed, generateTargetCoord } from "./targets.js";
import { GridItem } from "./grid.js";
import { Score } from "./score.js";
import { Input } from "./input.js";
import moveSoundSrc from "../assets/audio/move.wav";
import removeSoundSrd from "../assets/audio/remove.wav";
import targetSoundSrc from "../assets/audio/target.wav";
import hitSoundSrc from "../assets/audio/hit.wav";


export class GameBoard {

    constructor(width, height, level, snakeSeed, targetSeed) {

        if ([null, undefined].includes(width) || width < 6 || width > 50) width = 30;
        if ([null, undefined].includes(height) || height < 6 || height > 50) height = 30;
        if (![0, 1, 2, 3].includes(level)) level = 0;
        if ([null, undefined].includes(snakeSeed) || snakeSeed < 0 || snakeSeed >= 1) snakeSeed = Math.random();
        if ([null, undefined].includes(targetSeed) || targetSeed < 0 || targetSeed >= 1) targetSeed = Math.random();
        
        this.width = width;
        this.height = height;
        this.level = level;
        this.snakeSeed = snakeSeed;
        this.targetSeed = targetSeed;
        this.paused = false;
        this.over = false;
        this.won = false;
        this.previousSnake = [];
        this.snake = [];
        this.target = [];
        this.targetLength = 0;
        this.hits = [];
        this.plays = 0;
        this.score = new Score();
        this.input = new Input(0, 0, true);

        this.initSnake();
        this.generateTarget();

    }

    initSnake() {
        let [seedX, seedY] = splitSeed(this.snakeSeed);
        let snakeX = Math.floor(seedX * this.width), 
            snakeY = Math.floor(seedY * this.height);
        let snake = [new GridItem(this.width, this.height, snakeX, snakeY, ["snake", "snake-new"])];
        this.snake = snake;
        this.previousSnake = this.copySnake();
    }

    generateTarget(clear, seed) {
        if (![true, false].includes(clear)) clear = true;
        if ([null, undefined].includes(seed) || seed < 0 || seed >= 1) seed = this.targetSeed;
        let target = generateTargetCoord(this.width, this.height, this.level, this.snake, seed)
            .map(cell => new GridItem(this.width, this.height, cell[0], cell[1], ["target", "target-new"]));
        if (clear) this.target = target;
        else this.target = [...this.target, ...target];
        this.targetLength = target.length;
        this.hits = [];
        return this.targetLength > 0;
    }

    getSnakeDirection() {
        let prevHead = this.previousSnake[0],
            head = this.snake[0];
        let dX = head.X - prevHead.X,
            dY = head.Y - prevHead.Y;
        if (dX > 0) return "right";
        if (dX < 0) return "left";
        if (dY > 0) return "up";
        if (dY < 0) return "down";
        return "none";
    }

    checkHitsWall() {
        let snakeX = this.snake[0].X, 
            snakeY = this.snake[0].Y;
        if (snakeX < 0 || snakeX >= this.width || snakeY < 0 || snakeY >= this.height) {
            let dir = this.getSnakeDirection(); 
            this.previousSnake.forEach((segment, idx) => {
                if (idx == 0) segment.addClasses(["snake", `snakehead-wall`])
                else segment.addClasses(["snake", `snake-wall-${dir}`])
            });
            this.snake = this.previousSnake;
            this.over = true;
            return true;
        }
        return false;
    }

    checkHitsItself() {
        let snakeHead = this.snake[0], 
            snakeBody = this.snake.slice(1);
        for (let segment of snakeBody) {
            if (segment.classNames.has("remove")) continue;
            if (snakeHead.X == segment.X && snakeHead.Y == segment.Y) {
                snakeHead.addClasses(["snake", "snake-collision"]);
                this.over = true;
                return true
            };
        }
        return false; 
    }

    checkHitsTarget() {
        let snakeHead = this.snake[0],
            target = this.target;
        for (let item of target) {
            if (snakeHead.X == item.X && snakeHead.Y == item.Y) {
                item.addClasses(["target-hit", "remove"]);
                this.hits.push(item);
                return true;
            }
        }
        return false;
    };

    cleanUp(){
        this.snake = this.snake.reduce((acc, segment) => {
            if (!segment.classNames.has("remove")) acc.push(segment);  
            return acc; 
        }, []);
        this.target = this.target.reduce((acc, segment) => {
            if (!segment.classNames.has("remove")) acc.push(segment);
            return acc;
        }, []);
        this.snake.forEach(segment => segment.removeClasses(["snake-new"]));
        this.target.forEach(segment => segment.removeClasses(["target-new"]));
    }

    copySnake() {
        return this.snake.map(segment => segment.copy());
    }

    moveSnake(move) {
        this.previousSnake = this.copySnake();
        let head = this.snake[0];
        let newHead = new GridItem(
            this.width, this.height, 
            head.X + move.X, 
            head.Y + move.Y, 
            ["snake"]
        );
        this.snake.pop();
        this.snake = [newHead, ...this.snake];
    }

    extendSnake() {
        let newTail = this.previousSnake[this.previousSnake.length - 1].copy();
        newTail.addClasses(["snake", "snake-new"]);
        this.snake.push(newTail);
    }

    removeSegments(n) {
        let m = this.snake.length;
        n = Math.min(m - 2, n);
        for (let i = m - n; i < m; i++) this.snake[i].addClasses(["snake", "snake-remove", "remove"]);
    }

    getHitSound() {
        return new Audio(hitSoundSrc);
    }

    getMoveSound() {
        if (this.input.X == 0 && this.input.Y == 0) return false;
        if (this.input.paused) return false;
        let moveSound = new Audio(moveSoundSrc);
        moveSound.volume = 0.25;
        return moveSound;
    }

    getRemoveSound() {
        return new Audio(removeSoundSrd);
    }

    getTargetSound() {
        return new Audio(targetSoundSrc);
    }

    renderSnake() {
        return this.snake.map(item => item.render()).join("\n");
    }

    renderTarget() {
        return this.target.map(item => item.render()).join("\n");
    }

    updateGameBoardElement() {
        let snakeHtml = this.renderSnake(),
            targetHtml = this.renderTarget();
        document.querySelector(".game-board").innerHTML = `${snakeHtml}\n${targetHtml}`;
    }

}
