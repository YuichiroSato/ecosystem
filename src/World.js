/*
 ######################################################################

                         Ecosystem Symulator

 ######################################################################
*/

var World = function ( num_plant, num_herbivore, num_carnivore ) {

    var p = new Array(num_plant);
    var h = new Array(num_herbivore);
    var c = new Array(num_carnivore);

    var pconst = function() {
        return new Plant( new Position( Math.random()*300, Math.random()*300));
    };
    var hconst = function() {
        return new Herbivore( new Position( Math.random()*300, Math.random()*300), 50);
    };
    var cconst = function() {
        return new Carnivore( new Position( Math.random()*300, Math.random()*300), 100);
    };

    for (var i = 0; i < num_plant; i++)
        p[i] = pconst();
    for (var i = 0; i < num_herbivore; i++)
        h[i] = hconst();
    for (var i = 0; i < num_carnivore; i++)
        c[i] = cconst();


    this.evolve = function() {
        this.moveAll();
        this.eatAll();
        this.growAll();
        this.birthAll();
        this.dieAll();
    }

    this.moveAll = function() {
        for (var i = 0; i < h.length; i++)
            h[i].move();
        for (var i = 0; i < c.length; i++)
            c[i].move();
    }

    this.eatAll = function() {
        var alg = function( liv1, liv2 ){
    	    if( liv1.getPosition().getX() < liv2.getPosition().getX() ) return -1;
            if( liv1.getPosition().getX() > liv2.getPosition().getX() ) return 1;
            return 0;
        };
        p.sort( alg );
        h.sort( alg );
        for (var i = 0; i < h.length; i++)
            p = h[i].eat( p );
        for (var i = 0; i < c.length; i++)
            h = c[i].eat( h );
    }

    this.growAll = function() {
        for (var i = 0; i < h.length; i++)
            h[i].grow();
        for (var i = 0; i < c.length; i++)
            c[i].grow();
    }

    this.birthAll = function() {
        //for (var i = 0; i < p.length; i++) {
        //    var tem = p[i].birth();
        //    if (tem) p[p.length] = tem;
        //}
        if ( Math.random() < 0.8 ) 
            p[p.length] = new Plant( new Position( 20+Math.random()*360, 20+Math.random()*360 ) );
        for (var i = 0; i < h.length; i++) {
            var tem = h[i].birth();
            if (tem) h[h.length] = tem;
        }
        for (var i = 0; i < c.length; i++) {
            var tem = c[i].birth();
            if (tem) c[c.length] = tem;
        }
    }

    this.dieAll = function() {
        for (var i = h.length - 1; -1 < i; i--)
            if( h[i].die() ) h.splice( i, 1 );
        for (var i = c.length - 1; -1 < i; i--)
            if( c[i].die() ) c.splice( i, 1 );
    }

    this.draw = function() {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        for (var i = 0; i < p.length; i++)
            p[i].draw();
        for (var i = 0; i < h.length; i++)
            h[i].draw();
        for (var i = 0; i < c.length; i++)
            c[i].draw();
    }

    this.initArray = function( size, constractor ) {
        var ary = new Array( size );
        for (var i = 0; i < size; i++)
            ary[i] = constractor();
        return ary;
    }

    this.getPlant = function() { return p; }
    this.getHerbivore = function() { return h; }
    this.getCarnivore = function() { return c; }
    this.getPlantPopulation = function() { return p.length; }
    this.getHerbivorePopulation = function() { return h.length; }
    this.getCarnivorePopulation = function() { return c.length; }
}
