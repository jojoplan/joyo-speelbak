/**
 * Handle board to play with shapes.
 * @constructor
 */ 
function handleShapeBoard() {

    // board data
    const canvas   = $( "#board-canvas-2" );
    const ctx      = canvas[0].getContext('2d');
    const ctxSmall = $( "#board-canvas-small" )[0].getContext('2d');
    const pin_sets = $( "#shape-pins" ).text().split(';');
    const scale    = 14;

    const txtStart = $( "#start").text()
    const txtBend  = $( "#bend").text()
    const txtNode  = $( "#node").text()
    
    // set width, height and font
    ctx.canvas.width  = 85 * scale;
    ctx.canvas.height =  50 * scale;
    ctxSmall.canvas.width  = 32 * scale;
    ctxSmall.canvas.height = 10 * scale;
    ctxSmall.font = '16px sans-serif';

         
    // play hint
    let status = $( "#board-status" );
    status.animate({
        left: '-=200',
        opacity: 0.40,
    }, 2000 );

    let gaining = false;
    let current = 0;
    let pins = [];
    let p = [];

    myloadPins(current);
    myshowBoard();

    canvas[0].onmousedown = myDown;
    
    let set_count = 0;
    if (pin_sets.length > 0) {
        let pin = pin_sets[pin_sets.length - 1].split(',');
        set_count = parseInt(pin[2]);
    }

    if ( set_count > current) {
        $( "#next-shape" ).attr("class", 'button-enabled');
    } else {
        $( "#next-shape" ).attr("class", 'button-disabled');
    }
    
    $( "#again" ).attr("class", 'button-enabled');
    $( "#prev-shape" ).attr("class", 'button-disabled');

    $( "#again" ).on("click", function() {
        myshowBoard()
    });
      
    $( "#next-shape" ).on("click", function() {
        if (set_count > current) {
            current++;
            if (current === 1) {
                $( "#prev-shape" ).attr("class", 'button-enabled');
            }
            if (set_count > current) {
                $( "#next-shape" ).attr("class", 'button-enabled');
            } else {
                $( "#next-shape" ).attr("class", 'button-disabled');
            }
            myloadPins(current);
            myshowBoard();
        }
    });
    
    $( "#prev-shape" ).on("click", function() {
        if (current > 0) {
            current--;
            if (current === 0) {
                $( "#prev-shape" ).attr("class", 'button-disabled');
            }
            $( "#next-shape" ).attr("class", 'button-enabled');
            myloadPins(current);
            myshowBoard();
        }
    });

    /** Show new board with current pins. */
    function myshowBoard() {
        p = [];
        myclearSmallBoard();
        mydrawSmallExample(pins);
        myclearBoard();
        mydrawPins(pins);
    }
    
    /**
     * Load the current pins.
     */
    function myloadPins(setno) {
        pins = [];
        for (let i = 0; i < pin_sets.length; i++) {
            let pin = pin_sets[i].split(',');
            if ( parseInt(pin[2]) === setno ) {
                pins.push( {'x': parseInt(pin[0]) * scale, 'y': parseInt(pin[1] * scale)} );
            }
        }
    }

    /**
     * Draw board.
     */
    function myclearBoard() {
      ctx.fillStyle = '#6F7580';
      ctx.fillRect(0, 0, 1204, 756);
    }

    /**
     * Draw pins.
     * @param {array} points
     */
    function mydrawPins(points) {
        if (points.length > 0) {
            ctx.fillStyle = 'rgb(180, 5, 1)';
            mydrawPin(points[0], scale * 1.4);
            for (let i = 1; i < points.length - 1; i++) {
                if ((i % 2) === 1) {
                    ctx.fillStyle = 'rgb(180,120, 102)';
                } else {
                    ctx.fillStyle = 'rgb(180, 205, 180)';
                }
                mydrawPin(points[i], scale * 1.4);
            }
        }
    }
    
    /** Draw the pin */
    function mydrawPin(point, radius) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, 6.28, false);
        ctx.fill();
    }
    
    /**
     * Draw pin in the legend to explain pin color
     */
    function mydrawLegendPin(point, radius) {
        ctxSmall.beginPath();
        ctxSmall.arc(point.x, point.y, radius, 0, 6.28, false);
        ctxSmall.fill();
    }

    /**
     * Clear small boardand draw pin legend.
     */
    function myclearSmallBoard() {
        ctxSmall.fillStyle = '#36424C';
        ctxSmall.fillRect(0, 0, 440, 136);
        
        ctxSmall.fillStyle = '#6F7580';
        ctxSmall.fillRect(260, 8, 30, 120);
        
        ctxSmall.fillStyle = 'rgb(180, 5, 1)';
        mydrawLegendPin({'x': 275, 'y':33}, scale * 0.5);

        ctxSmall.fillStyle = 'rgb(180,120, 102)';
        mydrawLegendPin({'x': 275, 'y':66}, scale * 0.5);
       
        ctxSmall.fillStyle = 'rgb(180, 205, 180)';
        mydrawLegendPin({'x': 275, 'y':99}, scale * 0.5);
        
        ctxSmall.fillStyle = 'silver'
        ctxSmall.fillText( txtStart, 300,  38);
        ctxSmall.fillText( txtBend,  300,  71);
        ctxSmall.fillText( txtNode,  300, 104);
    }

    /** Draw a small example of the wanted shape. */
    function mydrawSmallExample(points) {
        if (points.length > 0 ) {
            let ds = 0.2;
            ctxSmall.fillStyle = 'silver';
            ctxSmall.beginPath();
            ctxSmall.moveTo(points[0].x*ds, points[0].y*ds);
            for (let i = 1; i < points.length - 1; i +=2) {
                ctxSmall.quadraticCurveTo(points[i].x*ds, points[i].y*ds,points[i+1].x*ds, points[i+1].y*ds);
            }
            ctxSmall.stroke();
            ctxSmall.fill();
        }
    }
    
    /** Draw a shape */
    function mydrawShape(points, filled) {
        if (points.length > 0 ) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length - 1; i +=2) {
                ctx.quadraticCurveTo(points[i].x, points[i].y,points[i+1].x, points[i+1].y);
            }
            ctx.stroke();
            if (filled) ctx.fill();
        }
    }

    /**
     * @event myDown to handle mouse clicks 
     * @param event
     */
    function myDown(e) {
        e.preventDefault();
        e.stopPropagation();
        
        let offsetX = canvas[0].getBoundingClientRect().left;
        let offsetY = canvas[0].getBoundingClientRect().top;        
        let mx = parseInt(e.clientX - offsetX);
        let my = parseInt(e.clientY - offsetY);
         
        if (!gaining) {
            gaining = true;
        }

        var sample = ctx.getImageData(mx, my, 1, 1).data;
        if (sample[0] === 180) {
            ctx.fillStyle = '#6C7378';        //'#A1B5B4';
            mydrawPin({'x': mx, 'y':my}, scale * 1.4);
            p.push({'x': mx, 'y':my});
            if (p.length >= pins.length - 1) {
                p.push(p[0]);
                ctx.fillStyle = '#6A8AB4';
                mydrawShape(p, true);
                p = [];
                gaining = false;
                
            } else if (p.length > 2) {
                mydrawShape(p, false);
            }
        }
    }

}

$( document ).ready( handleShapeBoard );

