var State = function() {
    var child = 0;
    var puberty = 1;
    var adult = 2;
    var old = 3;
    var state = child;

    return {
        setState : function( str ) {
            if( str == "child" )
                state = child;
            else if( str == "puberty" )
                state = puberty;
            else if( str == "adult" )
                state = adult;
            else if( str == "old" )
                state = old;
            },
        grow : function() {
            if( state != old )
                state++;
        },
        getState : function() { return state; },
        isChild : function() {
            if( state == child )
                return true;
            return false;
        },
        isPuberty : function() {
            if( state == puberty )
                return true;
            return false;
        },
        isAdult : function() {
            if( state == adult )
                return true;
            return false;
        },
        isOld : function() {
            if( state == old )
                return true;
            return false;
        }
    }
}