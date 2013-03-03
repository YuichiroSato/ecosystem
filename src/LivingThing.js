/*

    LivingThing<|------- Animal<|--------- Herbivore
                  |               |
                  |               ------- Carnivore
                  |
                  ------ Plant

*/

var LivingThing = function( p ) {
    this.p = p;
    this.energy;
    this.size;

    this.graphics;
    this.birth_if;
}

LivingThing.prototype = {

    draw : function() {
        this.graphics();
    },

    birth : function() {
        return this.birth_if();
    },

    die : function() {
        if ( this.energy <= 0 )
            return true;
        return false;
    },

    setPosition : function( p ) { this.p = p; },
    setEnergy : function( e ) { this.energy = e; },
    setSize : function( s ) { this.size = s; },

    getPosition : function() { return this.p; },
    getX : function() { return this.p.getX(); },
    getY : function() { return this.p.getY(); },
    getEnergy : function() { return this.energy; },
    getSize : function() { return this.size; },

    instanceOf : function() { return "LivingThing"; },
    toString : function() {
        return this.instanceOf()+"( positon "+this.p.toString()+", energy "+this.energy+", size "+this.size+" )";
    },
    print : function() { document.write( this.toString() ) ; },

    clone : function() {
        var f = function(){};
        f.prototype = this;
        return new f;
    }
}
