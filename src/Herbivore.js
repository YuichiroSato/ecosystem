/*

    LivingThing<|------- Animal<|--------- Herbivore
                  |               |
                  |               ------- Carnivore
                  |
                  ------ Plant

*/

var Herbivore = function( p, en ) {
    this.p = p;
    this.v = new Velocity( 5, 0 );
    this.v.randomRotate();
    this.size = 8;
    this.energy = en;
    this.sightLength = 100;
    this.sightAngle = Math.PI;
    this.state = new State();

    this.end_of_child = 60;
    this.end_of_puberty = 100;
    this.end_of_adult = 1000;
}

Herbivore.prototype = new Animal();

Herbivore.prototype.graphics = function( head ) {
    ctx.beginPath();
    ctx.fillStyle = "rgb(0,0,200)";
    ctx.strokeStyle = "rgb(0,0,200)";
    if ( this.energy < 20 )
        ctx.fillStyle = "rgb(100,100,200)";

    ctx.moveTo( head.getX(), head.getY() );
    head.rotateAround( this.p, 135 );
    ctx.lineTo( head.getX(), head.getY() );
    head.rotateAround( this.p, 45 );
    ctx.lineTo( head.getX(), head.getY() );
    head.rotateAround( this.p, 45 );
    ctx.lineTo( head.getX(), head.getY() );
    ctx.closePath();

    ctx.stroke();
    ctx.fill();
}

Herbivore.prototype.move_option = function() {
    this.energy -= 0.1;
    if ( this.state.isAdult() ) 
        this.energy -= 0.3;
    if ( Math.random() < 0.1 ) {
        this.v.randomRotate();
    }

    var carn = world.getCarnivore();
    var enemy = this.findClosest( carn );
    if ( enemy ) {
        var result = enemy.getPosition().clone().subtract( this.p ).setLength( this.size ).rotate( 180 );
        this.v = new Velocity( result.getX(), result.getY() );
    }
    else {
        var plnt = world.getPlant();
        var target = this.findClosest( plnt );
        if ( target ) {
        var result = target.getPosition().clone().subtract( this.p ).setLength( this.size );
        this.v = new Velocity( result.getX(), result.getY() );
        }
    }
}

Herbivore.prototype.eat_option = function() {
    this.energy += 20;
}

Herbivore.prototype.grow_if = function() {
    if( this.age < this.end_of_child ) {
        this.state.setState("child");
        this.size = 5;
        this.v.normalize().extend( 3 );
    }
    else if ( this.state.isChild() && 60 < this.energy && this.end_of_child < this.age ) {
        this.state.grow();
        this.size = 7;
        this.v.normalize().extend( 4 );
        this.energy -= 20;
    }
    else if ( this.state.isPuberty() && 70 < this.energy && this.end_of_puberty < this.age ) {
        this.state.grow();
        this.size = 8;
        this.v.normalize().extend( 5 );
        this.energy -= 30;
    }
    else if ( !this.state.isOld() && this.end_of_adult < this.age ) {
        this.state.setState( "old" );
        this.v.normalize().extend( 2 );
    }

    this.age++;
}

Herbivore.prototype.birth_if = function() {
    if ( 70 <= this.energy && 200 < this.age) {
        this.energy -= 30;
        return new Herbivore( this.p.clone(), 50 );
    }
}

Herbivore.prototype.instanceOf = function() { return "Herbivore"; }