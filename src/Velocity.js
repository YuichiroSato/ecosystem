/*

  Vector <|---- Position
            |
            --- Velocity
*/

var Velocity = function ( x, y ) {
    this.x = x;
    this.y = y;
}

Velocity.prototype = new Vector();

Velocity.prototype.randomRotate = function() {
    this.rotate( Math.random() * 360 );
}
