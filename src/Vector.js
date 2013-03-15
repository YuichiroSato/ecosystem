/*

  Vector <|---- Position
            |
            --- Velocity
*/

var Vector = function( x, y ) {
    this.x = x;
    this.y = y;
}

Vector.prototype = {

    add : function( v ) {
        this.x += v.getX();
        this.y += v.getY();
        return this;
    },

    subtract : function( v ) {
        this.x -= v.getX();
        this.y -= v.getY();
        return this;
    },

    extend : function( c ) {
        this.x *= c;
        this.y *= c;
        return this;
    },

    normalize : function() {
        var c = this.getLength();
        this.x /= c;
        this.y /= c;
        return this;
    },

    rotate : function( angle ) {
        var rad = this.convertRadian( angle );
        var temx = this.x;
        var temy = this.y;
        this.x = Math.cos( rad ) * temx - Math.sin( rad ) * temy;
        this.y = Math.sin( rad ) * temx + Math.cos( rad ) * temy;
        return this;
    },

    convertRadian : function ( angle ) {
        return ( angle / 360 ) * 2 * Math.PI;
    },

    relativeMorphism : function( f, v ) {
        this.subtract( v );
        f();
        this.add( v );
    },

    rotateAround : function ( v, angle ) {
        this.subtract( v );
        this.rotate( angle );
        this.add( v );
    },

    extendDistance : function( v, c ) {
        this.subtract( v );
        this.extend( c );
        this.add( v );
    },

    setDistance : function( v, c ) {
        this.subtract( v ).setLength( c ).add( v );
    },

    distanceBetween : function( v ) {
        return Math.sqrt( ( v.getX() - this.x ) * ( v.getX() - this.x ) + ( v.getY() - this.y ) * ( v.getY() - this.y ) );
    },

    toString : function() {
        return "("+this.x+","+this.y+")";
    },

    print : function() {
        document.write( this.toString() );
    },

    toRoundString : function() {
         return "("+Math.round(this.x)+","+Math.round(this.y)+")";
    },

    roundPrint : function() {
        document.write( this.toRoundString() );
    },

    setVector : function( x, y ) { this.x = x; this.y = y; },
    setX : function( x ) { this.x = x; },
    setY : function( y ) { this.y = y; },
    setLength : function ( c ) {
        this.normalize();
        this.extend( c );
        return this;
    },
    getX : function() { return this.x; },
    getY : function() { return this.y; },
    getLength : function() { return Math.sqrt( this.x * this.x + this.y * this.y ); },
    getAngle : function() { return Math.asin( this.x / this.getLength() ); },
    getAngleAround : function( v ) {
        this.subtract( v );
        var ang = this.getAngle();
        this.add( v );
        return ang;
    },
    getVarticalAngle : function() {
        this.rotate( - Math.PI / 2 );
        var ang = this.getAngle();
        this.rotate( Math.PI / 2 );
        return ang;
//        return this.getAngle() - Math.PI / 2;
    },
    getVarticalAngleAround : function( v ) {
        this.subtract( v );
        var arg = this.getVarticalAngle();
        this.add( v );
        return arg;
    },

    clone : function() {
        var f = function(){};
        f.prototype = this;
        return new f;
    },

    equals : function( p ) {
        if ( this.x == p.getX() && this.y == p.getY() ) return true;
        else return false;
    }
}
