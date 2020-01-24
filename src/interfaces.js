/**
 * @interface Point
 * @property {number} x - cartesian coord, left-right axis
 * @property {number} y - cartesian coord, up-down axis
 */
/**
 * TODO perhaps name 'Movable'
 * @interface Unit
 * @inheritDoc Point
 * @augments Point
 * @property {string} dir - direction
 * @property {number} id
 */

/**
 * @interface Snipe
 * @inheritDoc Point
 * @augments Unit
 * @property {number} movementStyle
 */

/**
 * @interface Hero
 * @inheritDoc Point
 * @augments Unit
 */

/**
 * @interface Bullet
 * @inheritDoc Point
 * @augments Unit
 */

/**
 * @interface Action
 * @property {string} type
 * @property {Object} payload
 */

/**
 * @interface State
 * @property {Array<Bullet>} bullets
 * @property {Hero} hero
 * @property {number} nrOfMoves
 * @property {Object<boolean, boolean>} settings
 * @property {Array<Snipe>} snipes
 * @property {Array<Wall>} walls
 * @property {Array<Point>} wallPoints
 */

/**
 * @interface Wall
 * @property {number} x1
 * @property {number} y1
 * @property {number} x2
 * @property {number} y2
 * @property {Array<Point>} points
 */
