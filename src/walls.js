import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { makeLinePoints, makeUShape } from "./utils";

export const onCreateWalls = state => {
  const wall0 = { x1: 0, y1: 0, x2: CANVAS_WIDTH, y2: 0 };
  const wall1 = { x1: 0, y1: 0, x2: 0, y2: CANVAS_HEIGHT };
  const wall2 = {
    x1: 0,
    y1: CANVAS_HEIGHT,
    x2: CANVAS_WIDTH,
    y2: CANVAS_HEIGHT
  };
  const wall3 = {
    x1: CANVAS_WIDTH,
    y1: 0,
    x2: CANVAS_WIDTH,
    y2: CANVAS_HEIGHT
  };

  const wall4 = { x1: 0, y1: 100, x2: 500, y2: 100 };
  const wall5 = { x1: 200, y1: 100, x2: 200, y2: 500 };
  const wall6 = { x1: 500, y1: 700, x2: 700, y2: 700 };
  const wall7 = { x1: 100, y1: 700, x2: 400, y2: 700 };
  const wall8 = { x1: 650, y1: 200, x2: 650, y2: 400 };

  const updatedWalls = [
    wall0,
    wall1,
    wall2,
    wall3,
    wall4,
    wall5,
    wall6,
    wall7,
    wall8
  ];

  const freshWallPoints = [];
  updatedWalls.forEach(wall => freshWallPoints.push(...makeLinePoints(wall)));
  console.log("freshWallPoints #1 ", freshWallPoints.length);
  freshWallPoints.push(
    ...makeUShape(/** @type Point */ { x: 500, y: 500 }, 50)
  );
  console.log("freshWallPoints #2 ", freshWallPoints.length);

  return { ...state, walls: updatedWalls, wallPoints: freshWallPoints };
};
