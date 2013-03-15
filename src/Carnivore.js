/*

    LivingThing<|------- Animal<|--------- Herbivore
                  |               |
                  |               ------- Carnivore
                  |
                  ------ Plant

*/

var Carnivore = function( p, en ) {
    this.p = p;
    this.v = new Velocity( 8, 0 );
    this.v.randomRotate();
    this.size = 10;
    this.energy = en;
    this.sightLength = 100;
    this.sightAngle = Math.PI / 2;
    this.sightWidth = Math.PI / 4;
    this.state = new State();

    this.target = null;
    this.v_counter = 0;

    this.fill_color = "rgb(200,0,0)";
    this.stroke_color = "rgb(200,0,0)";
    this.color_changed = false;

    this.dt = 0.04
    this.end_of_child = 20;
    this.end_of_puberty = 40;
    this.end_of_adult = 600;
    this.changable_span = 0.5;
}

Carnivore.prototype = new Animal();

Carnivore.prototype.graphics = function( head ) {

    if ( !this.state.isAdult() && this.energy < 50 ) {
        this.fill_color = "rgb(200,100,100)";
    }
    else if ( !this.state.isAdult() && 50 <= this.energy ) {
        this.fill_color = "rgb(200,0,0)";
    }
    else if ( this.energy < 100 && !this.color_changed ) {
        this.fill_color = "rgb(255,200,200)";
        this.stroke_color = "rgb(255,0,0)";
        this.color_changed = true;
    }
    else if ( 200 < this.energy ) {
        this.fill_color = "rgb(200,0,0)";
        this.stroke_color = "rgb(200,0,0)";
        this.color_changed = false;
    }
    if ( this.state.isOld() ) {
        this.fill_color = "rgb(255,200,200)";
        this.stroke_color = "rgb(255,0,0)";
    }

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.fillStyle = this.fill_color;
    ctx.strokeStyle = this.stroke_color;

    var back = head.clone();

    back.rotateAround( this.p, 180 );
    back.extendDistance( this.p, 0.3 );
    ctx.moveTo( head.getX(), head.getY() );
    head.rotateAround( this.p, 140 );
    ctx.lineTo( head.getX(), head.getY() );
    ctx.lineTo( back.getX(), back.getY() );
    head.rotateAround( this.p, 80 );
    ctx.lineTo( head.getX(), head.getY() );

    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.lineWidth = 1;
}

Carnivore.prototype.move_option = function() {
    this.v_counter += this.dt;

    if( this.state.isChild() )
        this.energy -= 0.2;
    else if ( this.state.isAdult() )
        this.energy -= 12.0;
    else
        this.energy -= 5.0;

    if ( !this.state.isAdult() && Math.random() < 0.1 ) {
        this.v.randomRotateWith( 90 );
    }
    else if ( Math.random() < 0.1 )
        this.v.randomRotateWith( 90 );

    if ( this.target && !world.isExist( this.target ) )
        this.target = null;

    if ( !this.target || this.target.die() ) {
        if ( this.state.isPuberty() || this.state.isAdult() ) {
            this.target = this.findClosest( world.getHerbivore() );
            this.changeVelocityTo( this.target );
            this.v_counter = 0;
        }
    }
    else if ( this.inSight( this.target ) && this.target.die() == false )
        this.changeVelocityTo( this.target );
    else {
        this.target = null;
        this.v_counter = 0;
    }
}

Carnivore.prototype.changeVelocityTo = function( target ) {
    //var target = this.findClosest( herb );
    if ( target ) {
        var result = target.getPosition().clone().subtract( this.p ).setLength( this.v.getLength() );
        this.v = new Velocity( result.getX(), result.getY() );
    }
}

//bug
Carnivore.prototype.drawSight = function() {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.moveTo( this.p.getX(), this.p.getY() );
    var head = this.calculateHead();
    head.setDistance( this.p, this.sightLength );
    ctx.arc( this.p.getX(), this.p.getY(), this.sightLength, head.getAngleAround( this.p )/* - this.sightWidth / 2*/, head.getAngleAround( this.p )/* + this.sightWidth / 2*/, false);
    ctx.closePath();
    ctx.stroke();
}

Carnivore.prototype.drawLineToTarget = function() {
    if ( this.target ) {
        ctx.beginPath();
        ctx.strokeStyle = "rgb(255,64,64)";
        ctx.moveTo( this.p.getX(), this.p.getY() );
        ctx.lineTo( this.target.getPosition().getX(), this.target.getPosition().getY() );
        ctx.stroke();
    }
    else {
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect( this.p.getX(), this.p.getY(), 3, 3 );
    }
}

Carnivore.prototype.eat_option = function() {
    this.energy += 200;
    this.target = null;
}

Carnivore.prototype.grow_if = function() {
    if( this.age < this.end_of_child ) {
        this.state.setState("child");
        this.size = 5;
        this.v.normalize().extend( 6 );
    }
    else if ( this.state.isChild() && 100 < this.energy && this.end_of_child < this.age ) {
        this.state.grow();
        this.size = 7;
        this.v.normalize().extend( 7 );
        this.energy -= 50;
    }
    else if ( this.state.isPuberty() && 2000 < this.energy && this.end_of_puberty < this.age ) {
        this.state.grow();
        this.size = 10;
        this.v.normalize().extend( 9 );
        this.energy -= 800;
        this.age = this.end_of_adult - Math.random() * 10;
    }
    else if ( !this.state.isOld() && this.end_of_adult < this.age ) {
        this.state.setState( "old" );
        this.v.normalize().extend( 1 );
    }

    this.age += this.dt;
}

Carnivore.prototype.birth_if = function() {
    if ( this.state.isAdult() && 1450 <= this.energy ) {
        this.energy -= 1250;
        return new Carnivore( this.p.clone(), 100 );
    }
}

Carnivore.prototype.die = function() {
    if ( this.energy <= 0 )
        return true;
    if ( this.state.isOld() && Math.random() < 0.01 )
        return true;
    return false;
}
