import {
  correctUnitPosition,
  createRandomDir,
  moveHero,
  createNextPoint,
  makeBullet,
  isCollisions,
  getDirBetween,
  createOppositeDir,
  hasValue,
  distance,
  seesHero,
  makePoint,
  fromNullable
} from "./utils";
import {
  DIRECTION_LIMIT,
  PX_PER_MOVE,
  SNIPE_SIZE,
  MOVE_SNIPES_CMD,
  MOVE_HERO_CMD,
  HERO_SHOOT_CMD,
  MOVE_BULLETS_CMD,
  BULLET_SIZE,
  HERO_SIZE,
  CHANGE_SETTING_CMD,
  CREATE_WALLS_CMD,
  SNIPE_SHOOT_INTERVAL,
  MovementStyles
} from "./constants";
import { onCreateWalls } from "./walls";

/**
 * makeNextState is what is commonly known a 'reducer', but I don't like the word.
 * It is NOT in utils.js, since it manipulates state
 * @param {Object<State>} state
 * @param {Object<Action>} action - contains instructions on how to make next state
 * @returns {Object<State>} next state
 */
export const makeNextState = (state, action) => {
  if (MOVE_BULLETS_CMD === action.type) {
    const updatedBullets = state.bullets.map(bullet => {
      if (hasValue(bullet)) {
        let nextPoint = createNextPoint(
          bullet.dir,
          makePoint(bullet),
          PX_PER_MOVE
        );
        return correctUnitPosition(
          { ...bullet, ...nextPoint },
          BULLET_SIZE,
          [state.hero, ...state.snipes, ...state.wallPoints],
          () => {
            return null; // nullify bullet on impact
          }
        );
      }
      // return [];
    });
    const updatedHero =
      state.hero === null ||
      isCollisions(state.bullets, state.hero, HERO_SIZE * 2)
        ? null
        : state.hero;
    const updatedSnipes = state.snipes.map(snipe => {
      if (
        hasValue(snipe) &&
        !isCollisions(state.bullets, snipe, SNIPE_SIZE * 2.5)
      ) {
        return snipe;
      }
      // return [];
    });
    return {
      ...state,
      bullets: updatedBullets,
      snipes: updatedSnipes,
      hero: updatedHero
    };
  }
  if (MOVE_SNIPES_CMD === action.type) {
    const updatedSnipes = state.snipes.map(
      /** @type Snipe */ snipe => {
        // fromNullable(snipe).map(snipe => hasValue(snipe) ? console.log("snipe is", snipe.id) : console.log("snipe is null"));

        if (hasValue(snipe)) {
          // TODO a snipe should remember how long it has been moving in the same dir
          if (state.nrOfMoves % DIRECTION_LIMIT === 0) {
            snipe.dir = createRandomDir();
          }
          // check distance with snipe and decide on next direction based on movement type
          if (seesHero(state.hero, snipe)) {
            if (snipe.movementStyle === MovementStyles.AGGRESSIVE) {
              snipe.dir = getDirBetween(snipe, state.hero); // towards Hero
              if (distance(snipe, state.hero) < 15) {
                // TODO this causes a bounce when snipe is moving away an sees hero and moves away again and sees hero
                snipe.dir = createOppositeDir(snipe.dir, makePoint(snipe));
              }
            }

            if (snipe.movementStyle === MovementStyles.EVASIVE) {
              snipe.dir = createOppositeDir(
                getDirBetween(snipe, state.hero),
                makePoint(snipe)
              );
            }
          }

          let prevPoint = makePoint(snipe);
          let nextPoint = createNextPoint(snipe.dir, prevPoint, PX_PER_MOVE);

          return /** @type Snipe */ {
            ...snipe,
            ...nextPoint,
            ...correctUnitPosition(
              /** @type Snipe */ { ...snipe, ...nextPoint },
              SNIPE_SIZE,
              [
                ...state.wallPoints,
                ...state.bullets,
                ...state.snipes,
                state.hero
              ],
              snipe => {
                // console.log("collisionHandler snipe collided with something");
                const updatedSnipe = {};
                updatedSnipe.x = prevPoint.x;
                updatedSnipe.y = prevPoint.y;
                updatedSnipe.dir = createOppositeDir(snipe.dir, nextPoint);
                return updatedSnipe;
              }
            )
          };
        }
        // return [];
      }
    );
    const updatedBullets = /** @type Array<Unit> */ [...state.bullets];
    // scan circle of terror and when a hero is in it: 1. decide which dir hero is, 2. stop moving 3. shoot in dir
    if (state.settings.snipesMayShoot) {
      state.snipes.map(_snipe => {
        if (state.nrOfMoves % SNIPE_SHOOT_INTERVAL === 0) {
          if (_snipe && state.hero && distance(_snipe, state.hero) < 200) {
            let dir = getDirBetween(_snipe, state.hero);
            if (dir) {
              updatedBullets.push(makeBullet(_snipe, HERO_SIZE, dir));
            }
          }
        }
        // return [];
      });
    }
    state.nrOfMoves++;
    return { ...state, snipes: updatedSnipes, bullets: updatedBullets };
  }
  if (MOVE_HERO_CMD === action.type) {
    const prevPoint = hasValue(state.hero) ? makePoint(state.hero) : null;
    const nextPoint = createNextPoint(action.dir, prevPoint, PX_PER_MOVE);
    console.log("moveHero", action.dir, prevPoint, nextPoint);
    const updatedHero = moveHero(
      state.hero,
      [...state.wallPoints, ...state.snipes],
      nextPoint
    );
    return { ...state, hero: updatedHero };
  }
  if (HERO_SHOOT_CMD === action.type) {
    state.bullets.push(makeBullet(state.hero, HERO_SIZE, action.shootDir));
    return { ...state };
  }
  if (CHANGE_SETTING_CMD === action.type) {
    const updatedSettings = state.settings;
    updatedSettings[action.settingKey] = action.settingValue;
    return { ...state, settings: updatedSettings };
  }
  if (CREATE_WALLS_CMD === action.type) {
    return onCreateWalls(state);
  }
  return state;
};
