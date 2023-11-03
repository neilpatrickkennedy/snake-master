const targets = require("../src/js/targets");

describe ("'generateLine4' tests", () => {

    let dim = 30,
        seed1 = 0.9,
        seed2 = 0.1; 
    let expLine1 = {shape: [[0, 0], [1, 0], [2, 0], [3, 0]], xMax: dim - 4, yMax: dim - 1},
        expLine2 = {shape: [[0, 0], [0, 1], [0, 2], [0, 3]], xMax: dim - 1, yMax: dim - 4};
    expLine1.shape.sort();
    expLine2.shape.sort();
    let line1 = targets.generateLine4(dim, seed1),
        line2 = targets.generateLine4(dim, seed2);
    line1.shape.sort();
    line2.shape.sort();

    test(`seed=[${seed1}] should result horizontal line`, () => {
      expect(line1).toEqual(expLine1);
    });

    test(`seed=[${seed2}] should result vertical line`, () => {
        expect(line2).toEqual(expLine2);
    });

});

describe ("'generateL4' tests", () => {

    let dim = 30,
        seed1 = 0.01,
        seed2 = 0.99; 
    let expLine1 = {shape: [[0, 2], [0, 1], [0, 0], [1, 0]], xMax: dim - 2, yMax: dim - 3},
        expLine2 = {shape: [[0, 1], [1, 1], [2, 1], [0, 2]], xMax: dim - 3, yMax: dim - 2};
    expLine1.shape.sort();
    expLine2.shape.sort();
    let line1 = targets.generateL4(dim, seed1),
        line2 = targets.generateL4(dim, seed2);
    line1.shape.sort();
    line2.shape.sort();

    test(`seed=[${seed1}] should result upright L`, () => {
      expect(line1).toEqual(expLine1);
    });

    test(`seed=[${seed2}] should result in horizontal gamma`, () => {
        expect(line2).toEqual(expLine2);
    });

});

describe ("'splitSeed' tests", () => {

    test('[0.123456789] should result in "[0.13579, 0.2468]"', () => {
      expect(targets.splitSeed(0.123456789)).toEqual([0.13579, 0.2468]);
    });

    test('[0.12121212121212] should result in "[0.1111111, 0.2222222]"', () => {
        expect(targets.splitSeed(0.12121212121212)).toEqual([0.1111111, 0.2222222]);
      });

});

describe ("'positionShape' tests", () => {

    let shape = [[0, 2], [0, 1], [0, 0], [1, 0]];
    let startX = 3, startY = 4;
    let target = targets.positionShape(shape, startX, startY);
    let expTarget = [[3, 6], [3, 5], [3, 4], [4, 4]];
    target.sort();
    expTarget.sort();

    test(`Moving shape ${shape} to point ${[startX, startY]}`, () => {
      expect(target).toEqual(expTarget);
    });

});

describe ("'doesTargetIntersect' tests", () => {

    let snake = [[0, 0], [1, 0], [2, 0], [2, 1]];
    let target1 = [[1, 1], [2, 1]];
    let target2 = [[1, 1], [1, 2]];

    test('snake [[0, 0], [1, 0], [2, 0], [2, 1]] intersects target [[1, 1], [2, 1]]', () => {
      expect(targets.doesTargetIntersect(snake, target1)).toBeTruthy;
    });

    test('snake [[0, 0], [1, 0], [2, 0], [2, 1]] intersects target [[1, 1], [1, 2]]', () => {
        expect(targets.doesTargetIntersect(snake, target2)).toBeFalsy;
      });

});

describe ("'createTargetFromShape' tests", () => {

    let dim = 30;
    let shape = [[0, 0], [1, 0], [2, 0], [2, 1]];
    let xMax = dim - 3, yMax = dim - 2;
    let snake1 = [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1]];
    let snake2 = [];
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            snake2.push([i, j]);
        }
    }
    let seed = 0.000001;
    let expTarget1 = [[0, 2], [1, 2], [2, 2], [2, 3]];
    expTarget1.sort();
    let target1 = targets.createTargetFromShape(snake1, shape,xMax, yMax, seed);
    target1.sort();
    let target2 = targets.createTargetFromShape(snake2, shape,xMax, yMax, seed);

    test('target should exist', () => {
      expect(target1).toEqual(expTarget1);
    });

    test('target should not exist', () => {
        expect(target2).toBeFalsy;
    });

});

describe ("'generateTarget' tests", () => {

    let dim = 30;
    let shape = [[0, 0], [1, 0], [2, 0], [3, 0]];
    let xMax = dim - 3, yMax = dim - 2;
    let snake1 = [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1]];
    let snake2 = [];
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            snake2.push([i, j]);
        }
    }
    let seed = 0.000001;
    let expTarget1 = [[0, 1], [0, 2], [0, 3], [0, 4] ];
    let target1 = targets.generateTarget(dim, 3, snake1, seed);
    let target2 = targets.generateTarget(dim, 3, snake2, seed);

    test('successfully generated target', () => {
        expect(target1).toEqual(expTarget1);
    });

    test('unsuccessful target generation', () => {
        expect(target2).toBeFalsy;
    });

});
