/*

    LivingThing<|------- Animal<|--------- Herbivore
                  |               |
                  |               ------- Carnivore
                  |
                  ------ Plant

*/

var Animal = function( p, v, energy ) {
    this.p = p;
    this.v = v;
    this.energy = energy;
    this.size = 5;
    this.age = 0;
    this.sightLength = 10;
    this.sightAngle = Math.PI / 4;
    this.sightWidth = Math.PI / 2;
    this.state = new State();

    this.graphics;
    this.move_option;
    this.eat_option;
    this.birth_if;
    this.grow_if;
}

Animal.prototype = new LivingThing();

Animal.prototype.draw = function() {
    this.graphics( this.calculateHead() );
}

Animal.prototype.calculateHead = function() {
    return this.p.clone().add( this.v.clone().normalize().extend( this.size ) );
}

Animal.prototype.move = function() {
        this.p.add( this.v );

        if( this.p.getX() < 0 )
           this.p.setX( canvas.width );
        else if( canvas.width < this.p.getX() )
           this.p.setX( 0 );
        if( this.p.getY() < 0)
            this.p.setY( canvas.width );  // to fix ecosystem field as square
        else if( canvas.width < this.p.getY() )
            this.p.setY( 0 );

        this.move_option();
}

Animal.prototype.findClosest = function( liv_ary ) {

    var options = this.inSight( liv_ary, this.findCondition );

    if ( 0 < options.length ) {

        var closer = function( liv1, liv2 ) {
            if( liv1.getPosition().distanceBetween( this.p ) < liv2.getPosition().distanceBetween( this.p ) )
                return liv1;
            else return liv2; 
        }

        var closest_liv = options[0];
        for(var i = 0; i < options.length; i++)
            closest_liv = closer.call( this, closest_liv, options[i] );
        return closest_liv;
    }
}

Animal.prototype.findCondition = function( liv ) {
    var rel_position = this.p.clone().subtract( liv.getPosition() );
    var rel_head = this.calculateHead().subtract( this.p );
    var rel_angle = rel_position.getAngle() - rel_head.getAngle();
    if( rel_position.getLength() < this.sightLength && this.sightAngle < rel_angle && rel_angle < this.sightAngle + this.sightWidth ) return true;
    else return false;
}

Animal.prototype.inSight = function( liv_ary, cond ) {
    var targets = new Array();
    for (var i = 0; i < liv_ary.length; i++) {
        if( cond.call( this, liv_ary[i] ) )
            targets[targets.length] = liv_ary[i];
    }
    return targets;
}

Animal.prototype.eat = function( liv_ary ) {
    var index = this.binarySearch( liv_ary, 0, liv_ary.length - 1 );
    if ( index ) {
        liv_ary.splice( index, 1 );
        this.eat_option();
    }
    return liv_ary;
}

Animal.prototype.binarySearch = function( liv_ary, lower, upper ) {
    var index = Math.floor( ( upper + lower ) / 2 );
    var dis = liv_ary[index].getPosition().distanceBetween( this.p );

    if ( dis < this.size )
        return index;
    if ( upper == lower )
        return null;
    else if ( liv_ary[index].getPosition().getX() < this.p.getX() )
        lower = index + 1;
    else
        upper = index;
    return this.binarySearch( liv_ary, lower, upper );
}

Animal.prototype.grow = function() {
    this.grow_if();
}

Animal.prototype.birth = function() {
    return this.birth_if();
}

Animal.prototype.setVelocity = function( v ) { this.v = v; }
Animal.prototype.getVelocity = function() { return this.v; }
Animal.prototype.setAge = function( age ) { this.age = age; }
Animal.prototype.getAge = function() { return this.age; }
Animal.prototype.getState = function() { return this.state; }
Animal.prototype.setState = function( s ) { this.state = s; }
Animal.prototype.instanceOf = function() { return "Animal"; }