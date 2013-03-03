function Graph() {

    var margin = 10;
    var graph_width = canvas.width - 2 * margin;
    var graph_height = canvas.height - canvas.width - margin;

    var pn = new Array(graph_width);
    var hn = new Array(graph_width);
    var cn = new Array(graph_width);
    var unit = 1;
    var upswitch = 90;
    var downswitch = 50;

    var begin_taxis = new Position( margin, canvas.height - margin );
    var end_taxis = new Position( margin + graph_width, canvas.height - margin );
    var begin_naxis = new Position( margin, canvas.height - margin );
    var end_naxis = new Position( margin, canvas.height - margin - graph_height );

    this.addLatestData = function( new_pn, new_hn, new_cn ) {
        pn.splice( 0, 1 );
        hn.splice( 0, 1 );
        cn.splice( 0, 1 );
        pn[pn.length] = new_pn;
        hn[hn.length] = new_hn;
        cn[cn.length] = new_cn;
        unit = this.unitSwitch( new_pn, new_hn, new_cn, unit );
    }

    this.unitSwitch = function( new_pn, new_hn, new_cn ) {
        if ( upswitch < new_pn || upswitch < new_hn || upswitch < new_cn )
            return 2;
        else if ( new_pn < downswitch && new_hn < downswitch && new_cn < downswitch )
            return 1;
        return unit;
    }

    this.draw = function() {
        this.drawAxis();
        this.plotData( pn, "rgb(0,200,0)" );
        this.plotData( hn, "rgb(0,0,200)" );
        this.plotData( cn, "rgb(200,0,0)" );
    }

    this.plotData = function( data, color ) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo( begin_taxis.getX(), begin_taxis.getY() - data[0] / unit );
        for (var i = 1; i < data.length; i++) {
            ctx.lineTo( begin_taxis.getX() + i, begin_taxis.getY() - data[i] / unit );
        }
        ctx.stroke();
    }

    this.drawAxis = function() {
        ctx.beginPath();
        ctx.strokeStyle = "rgb(124,124,124)";
        this.drawLine( begin_taxis, end_taxis );
        this.drawLine( begin_naxis, end_naxis );
        ctx.stroke();
    }

    this.drawLine = function( from, to ) {
        ctx.moveTo( from.getX(), from.getY() );
        ctx.lineTo( to.getX(), to.getY() );
    }
}