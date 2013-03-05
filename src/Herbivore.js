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
    this.sightLength = 50;
    this.sightAngle = -Math.PI / 4;
    this.sightWidth = 3 * Math.PI / 4;
    this.state = new State();

    this.enemy = null;
    this.v_counter = 0;

    this.dt = 0.04;
    this.end_of_child = 2;
    this.end_of_puberty = 4;
    this.end_of_adult = 50;
    this.changable_span = 2;
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
    this.v_counter += this.dt;

    if ( this.state.isAdult() ) 
        this.energy -= 0.3;
    if ( Math.random() < 0.1 ) {
        this.v.randomRotate();
    }

    if ( this.changable_span < this.v_counter ) {
        if ( !this.enemy ) {
            this.enemy = this.findClosest( world.getCarnivore() );
            this.v_counter = 0;
        }
        else if ( !this.inSight( this.enemy ) )
            this.enemy = null;
    }

    if ( this.enemy ) {
        var result = this.enemy.getPosition().clone().subtract( this.p ).setLength( this.size ).rotate( 180 );
        this.v = new Velocity( result.getX(), result.getY() );
    }
    else if ( this.state.isChild ) {
	;//    this.v.changeVelocityTo( this.findClosest( world.getHerbivore() ) );
    }
    else if ( this.changable_span < this.v_counter ) {
        var plnt = world.getPlant();
        var target = this.findClosest( plnt );
        if ( target ) {
            var result = target.getPosition().clone().subtract( this.p ).setLength( this.size );
            this.v = new Velocity( result.getX(), result.getY() );
            this.v_counter = 0;
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

    this.age += this.dt;
}

Herbivore.prototype.birth_if = function() {
    if ( 70 <= this.energy && this.age < this.end_of_adult ) {
        this.energy -= 30;
        return new Herbivore( this.p.clone(), 50 );
    }
}

Herbivore.prototype.instanceOf = function() { return "Herbivore"; }