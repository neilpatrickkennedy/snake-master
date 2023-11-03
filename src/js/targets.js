
const generatePoint = (width, height, seed) => {
    return {shape: [[0, 0]], xMax: width - 1, yMax: height - 1};
};

const generateLine = (len, width, height, seed) => {
    let line = [], xMax, yMax;
    let horizontal = seed >= 0.5;
    if (horizontal) { 
        for (let i = 0; i < len; i++){
            line.push([i, 0])
        }
        xMax = width - len;
        yMax = height - 1;
    } else {
        for (let j = 0; j < len; j++){
            line.push([0, j])
        }
        xMax = height - 1;
        yMax = height - len;
    }
    return {shape: line, xMax: xMax, yMax: yMax};
};

const generateLine2 = (width, height, seed) => {return generateLine(2, width, height, seed)};

const generateLine3 = (width, height, seed) => {return generateLine(3, width, height, seed)};

const generateLine4 = (width, height, seed) => {return generateLine(4, width, height, seed)};

const generateL3 = (width, height, seed) => {
    let quadrant = Math.floor(seed * 4) + 1;
    let L;
    switch (quadrant) {
        case 1:
            L = [[0, 1], [0, 0], [1, 0]];
            break;
        case 2:
            L = [[0, 0], [1, 0], [1, 1]];
            break;
        case 3:
            L = [[0, 1], [1, 1], [1, 0]];
            break;
        case 4:
            L = [[0, 0], [0, 1], [1, 1]];
            break;
    }
    return {shape: L, xMax: width - 2, yMax: height - 2};
};

const generateL4 = (width, height, seed) => {
    let signedQuadrant = Math.floor(seed * 8) + 1;
    let L, xMax, yMax;
    switch (signedQuadrant) {
        case 1:
            L = [[0, 2], [0, 1], [0, 0], [1, 0]];
            xMax = width - 2;
            yMax = height - 3;
            break;
        case 2:
            L = [[1, 2], [1, 1], [1, 0], [0, 0]];
            xMax = width - 2;
            yMax = height - 3;
            break;
        case 3:
            L = [[0, 0], [1, 0], [2, 0], [2, 1]];
            xMax = width - 3;
            yMax = height - 2;
            break;
        case 4:
            L = [[2, 0], [1, 0], [0, 0], [0, 1]];
            xMax = width - 3;
            yMax = height - 2;
            break;
        case 5:
            L = [[1, 0], [1, 1], [1, 2],[0, 2]];
            xMax = width - 2;
            yMax = height - 3;
            break;
        case 6:
            L = [[0, 0], [0, 1], [0, 2], [1, 2]];
            xMax = width - 2;
            yMax = height - 3;
            break;
        case 7:
            L = [[2, 1], [1, 1], [0, 1], [0, 0]];
            xMax = width - 3;
            yMax = height - 2;
            break;
        case 8:
            L = [[0, 1], [1, 1], [2, 1], [0, 2]];
            xMax = width - 3;
            yMax = height - 2;
            break;
    }
    return {shape: L, xMax: xMax, yMax: yMax};
};

const generateSquare = (width, height, seed) => {
    return {shape: [[0, 0], [1, 0], [0, 1], [1, 1]], xMax: width - 2, yMax: height - 2};
};

const generateZ = (width, height, seed) => {
    let signedRotation = Math.floor(seed * 4) + 1;
    let Z, xMax, yMax;
    switch (signedRotation) {
        case 1:
            Z = [[0, 0], [0, 1], [1, 1], [2, 1]];
            xMax = width - 3;
            yMax = height - 2;
            break;
        case 2:
            Z = [[0, 1], [1, 1], [1, 0], [2, 0]];
            xMax = width - 3;
            yMax = height - 2;
            break;
        case 3:
            Z = [[0, 2], [0, 1], [1, 1], [1, 0]];
            xMax = width - 2;
            yMax = height - 3;
            break;
        case 4:
            Z = [[1, 0], [1, 1], [0, 1], [0, 2]];
            xMax = width - 2;
            yMax = height - 3;
            break;
    }
    return {shape: Z, xMax: xMax, yMax: yMax};
};

const doesTargetIntersect = (snake, target) => {
    for (let targetCell of target) {
        for (let snakeCell of snake) {
            if ((targetCell[0] == snakeCell[0]) && (targetCell[1] == snakeCell[1])) {
                return true;
            }
        }
    }
    return false;
};

const positionShape = (shape, startX, startY) => {
    let target = [];
    shape.forEach(cell => {
        let x = cell[0], y = cell[1];
        x += startX;
        y += startY;
        target.push([x, y]);
    });
    return target;
};

export const splitSeed = (seed) => {
    let seedStr = seed.toString().slice(2);
    let seedStr1 = "", seedStr2 = "";
    for (let i = 0; i < seedStr.length; i ++) {
        if (i % 2 == 0) seedStr1 += seedStr[i];
        else seedStr2 += seedStr[i];
    }
    let seed1 = parseFloat(`0.${seedStr1}`), 
        seed2 = parseFloat(`0.${seedStr2}`);
    return [seed1, seed2];
};

const createTargetFromShape = (snake, shape, xMax, yMax, seed) => {
    let [xSeed, ySeed] = splitSeed(seed);
    let x0 = Math.floor(xSeed * (xMax + 1)), 
        y0 = Math.floor(ySeed * (yMax + 1));
    for (let xOffset = 0; xOffset <= xMax; xOffset++) {
        for (let yOffset = 0; yOffset <= yMax; yOffset++) {
            let startX = (x0 + xOffset) % (xMax + 1);
            let startY = (y0 + yOffset) % (yMax + 1);
            let target = positionShape(shape, startX, startY);
            if (doesTargetIntersect(snake, target)) continue;
            return target;
        }
    }
    return;
};

const LEVELS = [
    [generatePoint],
    [generateLine2],
    [generateLine3, generateL3],
    [generateLine4, generateL4, generateSquare, generateZ]
];

export const generateTargetCoord = (width, height, level, snake, seed) => {
    if ([null, undefined].includes(seed) || seed < 0 || seed >= 1) seed = Math.random();
    const genFcts = LEVELS[level];
    const n = genFcts.length;
    const i0 = Math.floor(seed * n);
    for (let offset = 0; offset < n; offset++) {
        let genFct = genFcts[(i0 + offset) % n];
        let {shape, xMax, yMax} = genFct(width, height, seed);
        let target = createTargetFromShape(snake, shape, xMax, yMax, seed);
        if (!target) continue;
        return target;
    }
    return [];
};
