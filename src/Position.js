/*

  Vector <|---- Position
            |
            --- Velocity
*/

var Position = function ( x, y ) {
    this.x = x;
    this.y = y;
}
Position.prototype = new Vector();
