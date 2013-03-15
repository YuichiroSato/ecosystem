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
    return this;
}

Velocity.prototype.randomRotateWith = function( rang ) {
    this.rotate( Math.random() * rang - rang / 2 );
    return this;
}

Velocity.prototype.changeVelocityTo = function( liv, self ) {
    if ( liv ) {
        var result = liv.getPosition().clone().subtract( self ).setLength( this.getLength() );
        this.x = result.getX();
        this.y = result.getY();
        return this;
    }
}