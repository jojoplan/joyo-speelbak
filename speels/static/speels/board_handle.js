/**
 * Handle board with questions and answers.
 * @constructor
 */
function handleAnswerBoard() {

    // board data
    const canvas = $( "#board-canvas" );
    const quests = $( "#game-questions" ).text().split(',');
    const answrs = $( "#game-answers" ).text().split(',');
    const urlchk = $( "#game-check" ).text();
    const ctx = canvas[0].getContext('2d');
    const isEmpty = -1;

    // Scoling changes these offsets
    let offsetX = canvas[0].getBoundingClientRect().left;
    let offsetY = canvas[0].getBoundingClientRect().top;
    
    // set width, height and font
    ctx.canvas.width  = 1204;
    ctx.canvas.height =  756;
    ctx.font = '22px sans-serif';

    // actual data
    current = -1;
    startX  =  0;
    startY  =  0;
    slots = []
    rectA = []
    for (let i = 0; i < quests.length; i++) {
        slots.push(isEmpty);
        rectA.push({'x':880, 'y':60 + 120 * i, 'isPlaced':false, 'isDragging': false});
    }
    
    // questions and answers
    myshowQuestions();
    mydrawAnswers();
    
    // drag-drop: listen to mouse events
    canvas[0].onmousedown = myDown;
    canvas[0].onmousemove = myMove;
    canvas[0].onmouseup   = myUp;
//     canvas.on("mousedown", myDown);
//     canvas.on("mousemove", myMove);
//     canvas.on("mouseup"  , myUp);
    
    // play hint
    let status = $( "#board-status" );
    status.animate({
        left: '-=200',
        opacity: 0.40,
    }, 2000 );
    
    /**
     * Show the questions.
     */
    function  myshowQuestions() {      
        ctx.strokeStyle = '#242027';
        ctx.fillStyle   = '#36424C';  // '#345157';
        for (let i = 0; i < quests.length; i++) {
          ctx.beginPath();
          ctx.moveTo( 20, 115 + 120 * i);
          ctx.lineTo(400, 115 + 120 * i);
          ctx.stroke();
          ctx.fillRect(20, 60 + 120 * i, 360, 50);;
        }

        ctx.fillStyle = '#CACACA';
        for (let i = 0; i < quests.length; i++) {
            ctx.fillText(quests[i], 30,  90 + 120 * i, 340);
        }
    }
    
    /** 
     * Draw the answers.
     */
    function mydrawAnswers() {
        ctx.fillStyle = '#B4A574';
        ctx.fillRect(400, 0, 804, 756);

        ctx.strokeStyle = '#242027';
        for (let i = 0; i < quests.length; i++) {
            ctx.beginPath();
            ctx.moveTo(400, 115 + 120 * i);
            ctx.lineTo(760, 115 + 120 * i);
            ctx.stroke();
        }


        for (let i = 0; i < quests.length; i++) {
            let r = rectA[i];
            if (r.isPlaced) {
                ctx.fillStyle = '#342027';
            } else if (r.isDragging) {
                ctx.fillStyle = '#742027';
            } else {
                ctx.fillStyle = '#542027';
            }
            ctx.fillRect(rectA[i].x, rectA[i].y, 300, 50);;
        }     
        
        ctx.fillStyle = '#CACACA';
        for (let i = 0; i < quests.length; i++) {
            ctx.fillText(answrs[i], 10 + rectA[i].x,  30 + rectA[i].y, 280);
        }
    }

    /**
     * Drag-drop: handle mouse-down
     * @event
     * @param event
     */
    function myDown(e) {
        e.preventDefault();
        e.stopPropagation();
        
        offsetX = canvas[0].getBoundingClientRect().left;
        offsetY = canvas[0].getBoundingClientRect().top;
        
        let mx = parseInt(e.clientX - offsetX);
        let my = parseInt(e.clientY - offsetY);
        
        current = -1;
        for (let i = 0; i < quests.length; i++) {
            if (current < 0) {
              let r = rectA[i];
              if (mx>r.x && mx<r.x+300 && my>r.y && my<r.y+50) {
                  current = i;
                  r.isPlaced   = false;
                  r.isDragging = true;
                  startX = mx;
                  startY = my;
                  mydrawAnswers();
                }
            }
        }
    }

    /**
     * Drag-drop: handle mouse-move
     * @event
     * @param event
     */
    function myMove(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (current >= 0) {
            let mx = parseInt(e.clientX - offsetX);
            let my = parseInt(e.clientY - offsetY);
            
            let dx = mx - startX;
            let dy = my - startY;
            
            let r = rectA[current];
            if (r.x+dx > 400) {
                r.x += dx;
                r.y += dy;
                startX = mx;
                startY = my;
                mydrawAnswers();
            }
        }
    }

    /**
     * Drag-drop: handle mouse-up
     * @event
     * @param event
     */
    function myUp(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (current >= 0) {
            let r = rectA[current]
            
            r.isDragging = false;
            r.isPlaced   = false;
            for (let i = 0; i < quests.length; i++) {
                if (slots[i] === current) {
                    slots[i] = isEmpty;
                }
            }

            if (r.x < 800) {
                let slot = parseInt((r.y + 25) / 120);
                if (slot >= quests.length) {
                    slot =  quests.length - 1;
                }
                if (slots[slot] === isEmpty) {
                    slots[slot] = current;
                    r.isPlaced = true;
                    r.x = 430;
                    r.y = 60 + 120 * slot;
                    
                    if (mycheckSlots()) {
                        myprocessAnswers();
                    }
                      
                } else {
                    r.x = 760;
                    r.y = 5 + 120 * slot;
                }
            }
            
            mydrawAnswers();
            
            current = -1;
        }
    }
    
    /**
     * Check if all slots are filled, thus all answers given.
     * @returns {boolean} ready
     */
    function mycheckSlots() {
        let ready = true;
        for (let i = 0; i < quests.length; i++) {
            if (slots[i] < 0) {
              ready = false;
            }
        }
        return ready;
    }
    
    /**
     * Process the results
     */
    function myprocessAnswers() {
        status.text("Antwoorden worden verwerkt.");
//         canvas.off("mousedown", myDown);
//         canvas.off("mousemove", myMove);
//         canvas.off("mouseup"  , myUp);

        $.ajax({
            url: urlchk,
            data: {'results': slots},
            type: "GET",
            dataType : "html",
        })
          .done(function( resp ) {
              status.text("Ga door naar de volgende.");
              ctx.lineWidth = 3;
              for (let i = 0; i < resp.length; i++) {
                  if (resp[i] === '1') {
                      ctx.strokeStyle = 'green';
                  } else{
                      ctx.strokeStyle = 'red';
                  }
                  
                  ctx.beginPath();
                  ctx.moveTo( 20, 115 + 120 * i);
                  ctx.lineTo(730, 115 + 120 * i);
                  ctx.stroke();
              }
          })
          .fail(function( xhr, status, errorThrown ) {
              console.log( "Error: " + errorThrown );
              console.log( "Status: " + status );
          })
          .always(function( xhr, status ) {
              //alert( "The request is complete!" );
          });
    }
}

$( document ).ready( handleAnswerBoard );
