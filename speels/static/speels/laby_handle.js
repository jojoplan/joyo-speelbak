/**
 * Handle board to play with shapes.
 * @constructor
 */
function handleLabyBoard() {

    // board data
    const canvas = $( "#board-canvas" );
    const wallsH = $( "#laby-walls-horz" ).text().split(';');
    const wallsV = $( "#laby-walls-vert" ).text().split(';');
    const ctx = canvas[0].getContext('2d');
    const BB  = canvas[0].getBoundingClientRect();
    const offsetX = BB.left;
    const offsetY = BB.top;
    const scale   = 28;
    const shalf   = scale / 2;

    // set width, height and font
    ctx.canvas.width  = 1204;
    ctx.canvas.height =  756;
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#B4A574';
    ctx.fillRect(0, 0, 1204, 756);

    // play data
    var ball = {'x': 1, 'y':0};
    
    
    // draw the walls
    mydrawWalls();


    // draw ball
    ctx.fillStyle = '#AA4524';
    mydrawBall(shalf - 1);
    
    // play hint
    let status = $( "#board-status" );
    status.animate({
        opacity: 0.40,
    }, 2000 );
    
    /** Draw the walls. */
    function mydrawWalls() {
        ctx.fillStyle = '#4A4524';
        for (let i = 0; i < wallsH.length; i++) {
            let part = wallsH[i].split(',');
            let x = parseInt(part[0]) * scale;
            let y = parseInt(part[1]) * scale;
            let w = parseInt(part[2]) * scale;
            ctx.fillRect(x, y, w, scale);
        }

        for (let i = 0; i < wallsV.length; i++) {
            let part = wallsV[i].split(',');
            let x = parseInt(part[0]) * scale;
            let y = parseInt(part[1]) * scale;
            let h = parseInt(part[2]) * scale;
            ctx.fillRect(x, y, scale, h);
        }
    }
    
    /** 
     * Draw the ball
     * @param radius
     */
    function mydrawBall(radius) {
        ctx.beginPath();
        ctx.arc(scale * ball.x + shalf, scale * ball.y + shalf, radius, 0, 6.28, false);
        ctx.fill();
    }
    
    /** 
     * Move the balls, but not if there is a wall.
     * @param dx displacement in x-direction
     * @param dy displacement in y-direction
     */
    function mymoveBall(dx, dy) {
        var sample = ctx.getImageData(scale * (ball.x+dx) + shalf, scale * (ball.y+dy) + shalf, 1, 1).data;
        
        if (sample[0] === 180) {
            ctx.fillStyle = '#B4A574';
            mydrawBall(shalf - 2);
            ball.x += dx;
            ball.y += dy;
            ctx.fillStyle = '#AA4524';
            mydrawBall(shalf - 1);
        }
    }
    
    document.onkeydown = mycheckKey;

    /**
     * Handle arrow keys to move the ball.
     * @event
     * @param event
     */
    function mycheckKey(e) {
        switch(e.which) {
            case 37: mymoveBall(-1, 0); break;
            case 38: mymoveBall( 0,-1); break;
            case 39: mymoveBall( 1, 0); break;
            case 40: mymoveBall( 0, 1); break;
            
            default: return;
        }
        e.preventDefault();
        e.stopPropagation();
    }
}

$( document ).ready( handleLabyBoard );
