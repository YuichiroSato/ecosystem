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
    this.sightWidth = Math.PI;
    this.state = new State();

    this.enemy = null;
    this.friend = null;

    this.dt = 0.04;
    this.end_of_child = 2;
    this.end_of_puberty = 5;
    this.end_of_adult = 120;
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

    if ( this.state.isAdult() ) 
        this.energy -= 0.3;
    if ( Math.random() < 0.1 ) {
        this.v.randomRotateWith( 45 );
    }
/*
    if ( this.friend && !world.isExist( this.friend ) )
        this.friend = null;

    if ( !this.friend ) {
        var liv = this.findClosestNoMe( world.getHerbivore() );
        //if ( liv && this.inSight( liv ) ) this.friend = liv;
    }
    else if ( !this.inSight( this.friend ) )
        ;//this.friend = null;
    else if ( this.friend )
        ;//this.synchro();
*/
    if ( this.enemy && !world.isExist( this.enemy ) )
        this.enemy = null;

    if ( !this.enemy ) {
        var liv = this.findClosest( world.getCarnivore() );
        if ( liv && this.inSight( liv ) ) this.enemy = liv;
    }
    else if ( !this.inSight( this.enemy ) )
        this.enemy = null;

    if ( this.enemy && !this.state.isChild() ) {
        var result = this.enemy.getPosition().clone().subtract( this.p ).setLength( this.v.getLength() ).rotate( 180 );
        this.v = new Velocity( result.getX(), result.getY() );
    }
    else if ( Math.random() < 0.1 ) {
	var target = this.findClosest( world.getPlant() );
        if ( target ) {
            var result= target.getPosition().clone().subtract( this.p ).setLength( this.v.getLength() );
            this.v.setVector( result.getX(), result.getY() );
        }
    }
}

Herbivore.prototype.synchro = function() {
    var fang = this.friend.getVelocity().getAngle();
    var mang = this.v.getAngle();
    var dis = fang - mang;
    var thr = Math.PI/10;

    if ( this.friend ) {
    if ( this.p.distanceBetween( this.friend.getPosition() ) < this.size * 2 ) {
        if ( thr < fang - mang )
            this.v.rotate(2);
        else if ( thr < mang - fang )
            this.v.rotate(-2);
    }
    else if ( this.inSight( this.friend ) ) {
        if ( -thr < dis || dis < thr )
            return;
        else if ( dis < -thr )
            this.v.rotate(thr);
        else
            this.v.rotate(-thr);
    }
    }
}

Herbivore.prototype.eat_option = function() {
    this.energy += 20;
}

Herbivore.prototype.grow_if = function() {
    if( this.age < this.end_of_child ) {
        this.state.setState("child");
        this.size = 4;
        this.v.normalize().extend( 4 );
    }
    else if ( this.state.isChild() && 60 < this.energy && this.end_of_child < this.age ) {
        this.state.grow();
        this.size = 5;
        this.v.normalize().extend( 5 );
        this.energy -= 20;
    }
    else if ( this.state.isPuberty() && 70 < this.energy && this.end_of_puberty < this.age ) {
        this.state.grow();
        this.size = 8;
        this.v.normalize().extend( 6 );
        this.energy -= 30;
    }
    else if ( !this.state.isOld() && this.end_of_adult < this.age ) {
        this.state.setState( "old" );
        this.v.normalize().extend( 1 );
    }

    this.age += this.dt;
}

Herbivore.prototype.birth_if = function() {
    if ( 100 <= this.energy && this.age < this.end_of_adult ) {
        this.energy -= 70;
        return new Herbivore( this.p.clone(), 50 );
    }
}

Herbivore.prototype.instanceOf = function() { return "Herbivore"; }