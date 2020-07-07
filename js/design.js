var c = document.getElementById('myCanvas');
var ca = document.getElementById('canvas2');
c.width = c.scrollWidth;
c.height = c.scrollHeight;
ca.width = ca.scrollWidth;
ca.height = ca.scrollHeight;
var WIDTH = c.width;
var HEIGHT = c.height;
var ctx = c.getContext("2d");
var gctx = ca.getContext("2d");
var rects = [];
var circs = [];
var lins = [];
var straights = [];
var canvasOffset = c.getBoundingClientRect();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var dragging = false;
var selection = null;
var dragoffx = 0; // See mousedown and mousemove events for explanation
var dragoffy = 0;
var snapshot;
var selectionBoxColor = 'red';
var closeEnough = 8;
var selectionHandle,
    dragTL = dragBL = dragTR = dragBR = dragTM = dragLM = dragRM = dragBM = false;
var img;
var update = document.getElementById('button1');
var centreLine = document.getElementById('button2');
function rectangle(x, y, w, h, stroke) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.stroke = stroke || '#AAAAAA';


}

rectangle.prototype.contains = function (mx, my) {

    return ((this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y <= my) && (this.y + this.h >= my));
}

rectangle.prototype.clear = function () {
    ctx.clearRect(this.x, this.y, this.w, this.h);
}

function line(xi, yi, xv, yv) {
    this.xi = xi;
    this.yi = yi;
    this.xv = xv;
    this.yv = yv;

    line.prototype.draw = function () {
        ctx.beginPath();
        ctx.moveTo(this.xi, this.yi);
        ctx.lineTo(this.xv, this.yv);
        ctx.stroke();
    }

    line.prototype.contains = function (mx, my) {

        return (this.xi - 5 <= mx) && (this.xi + 5 <= mx) && (this.xi + this.xv >= mx) &&
            (this.yi <= my) && (this.yi + this.yv >= my);
    }
}

function striaghtLine(x, y, w, h) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;

    striaghtLine.prototype.draw = function () {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        var x1 = this.x + this.w;
        var y1 = this.y + this.h;
        var dx = Math.abs(x1 - this.x);
        var dy = Math.abs(y1 - this.y);
        if (dx > dy) {
            ctx.lineTo(x1, this.y);
        } else {
            ctx.lineTo(this.y, y1);
        }
        ctx.stroke();
    }

}

function circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    circle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    circle.prototype.contains = function (mx, my) {

        return (Math.abs(this.x - mx) <= this.r) && (Math.abs(this.y - my) <= this.r);
    }
}

function getCanvasCoordinates(event) {
    var x = event.pageX - offsetX,
        y = event.pageY - offsetY;

    return { x: x, y: y };
}
c.addEventListener('selectstart', function (e) { e.preventDefault(); return false; }, false);

c.addEventListener('dblclick', function (e) {
    var mouse = getCanvasCoordinates(e);
    addShapeRects(new rectangle(mouse.x - 75, mouse.y - 50, 150, 100, 'rgba(0,255,0,.6)'));
    //addShapeCircle(new circle(mouse.x, mouse.y, 25));
}, false);

function takeSnapshot() {
    snapshot = ctx.getImageData(0, 0, WIDTH, HEIGHT);
}

function restoreSnapshot() {
    ctx.putImageData(snapshot, 0, 0);
}

function point(x, y) {
    return {
        x: x,
        y: y
    };
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.stroke();
}

function draw() {
    clear();
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        rects[i].stroke = 'green';
        ctx.strokeStyle =  rects[i].stroke;
        rect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
    }
}
function addShapeRects(shape) {
    rects.push(shape);
    var l = rects.length;
    for (var i = 0; i < l; i++) {
        var rect = rects[i];
        // We can skip the drawing of elements that have moved off the screen:
        if (rect.x > this.w || rect.y > this.h ||
            rect.x + rect.w < 0 || rect.y + rect.h < 0) continue;
        if (i === l - 1) {
            ctx.strokeStyle = 'green';
            ctx.rect(rects[l - 1].x, rects[l - 1].y, rects[l - 1].w, rects[l - 1].h);
            ctx.stroke();
        }
    }
}
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}


function addShapeCircle(shape) {
    circs.push(shape);
    var l = circs.length;
    for (var i = 0; i < l; i++) {
        var circ = circs[i];
        if (circ.x > this.width || circ.y > this.height ||
            circ.x + circ.w < 0 || circ.y + circ.h < 0) continue;
        circs[i].draw();
    }
}

function checkCloseEnough(p1, p2) {
    return Math.abs(p1 - p2) < closeEnough;
}

// function addShapeLine(shape) {
//     lins.push(shape);
//     var l = lins.length;
//     for (var i = 0; i < 1; i++) {
//         var lin = lins[i];
//         if (lin.x > this.width || lin.y > this.height ||
//             lin.x + lin.w < 0 || lin.y + lin.h < 0) continue;
//         lins[i].draw();
//     }
// }

// function addShapeLinestraight(shape) {
//     straights.push(shape);
//     var l = straights.length;
//     for (var i = 0; i < 1; i++) {
//         var straight = straights[i];
//         if (straight.x > this.width || straight.y > this.height ||
//             straight.x + straight.w < 0 || straight.y + straight.h < 0) continue;
//         straights[i].draw();
//     }
// }

function show() {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
    drawHandles();
}

function drawHandles() {
    drawCircle(selection.x, selection.y, closeEnough);
    drawCircle(selection.x + selection.w, selection.y, closeEnough);
    drawCircle(selection.x + selection.w, selection.y + selection.h, closeEnough);
    drawCircle(selection.x, selection.y + selection.h, closeEnough);
    drawCircle(selection.x + selection.w / 2, selection.y, closeEnough);
    drawCircle(selection.x, selection.y + selection.h / 2, closeEnough);
    drawCircle(selection.x + selection.w / 2, selection.y + selection.h, closeEnough);
    drawCircle(selection.x + selection.w, selection.y + selection.h / 2, closeEnough);

}

function drawCircle(x, y, radius) {
    ctx.globalCompositeOperation = 'xor';
    ctx.srokeStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
}

// function clear(e) {
//     var mouse = getCanvasCoordinates(e);
//     var mx = mouse.x;
//     var my = mouse.y;
//     var rect = rects;
//     var l = rect.length;
//     for (var i = l - 1; i >= 0; i--) {
//         if (rect[i].contains(mx, my)) {
//             ctx.clearRect(rect[i].x, rect[i].y, rect[i].w, rect[i].h);
//         }
//     }
// }
c.addEventListener('mousedown', function (e) {
    takeSnapshot();
    var mouse = getCanvasCoordinates(e);
    var mx = mouse.x;
    var my = mouse.y;
    var rect = rects;
    //var rect = circs;
    //var rect = lins;
    //var rect = straights;
    var l = rect.length;
    for (var i = l - 1; i >= 0; i--) {
        if (rect[i].contains(mx, my)) {
            var mySel = rect[i];
            dragoffx = mx - mySel.x;
            dragoffy = my - mySel.y;
            dragging = true;
            selection = mySel;
            if (selection === rect[i]) {
                show();
            }
        }

        if (selection !== null) {
            console.log(selection + 'selection value 0');
            if (checkCloseEnough(mx, selection.x) && checkCloseEnough(my, selection.y)) {
                dragTL = true;
            }
            if (checkCloseEnough(mx, selection.x + selection.w) && checkCloseEnough(my, selection.y)) {
                dragTR = true;
            }
            if (checkCloseEnough(mx, selection.x + selection.w / 2) && checkCloseEnough(my, selection.y)) {
                dragTM = true;
            }
            if (checkCloseEnough(mx, selection.x) && checkCloseEnough(my, selection.y + selection.h)) {
                dragBL = true;
            }
            if (checkCloseEnough(mx, selection.x + selection.w) && checkCloseEnough(my, selection.y + selection.h)) {
                dragBR = true;
            }
            if (checkCloseEnough(mx, selection.x) && checkCloseEnough(my, selection.y + selection.h / 2)) {
                dragLM = true;
            }
            if (checkCloseEnough(mx, selection.x + selection.w) && checkCloseEnough(my, selection.y + selection.h / 2)) {
                dragRM = true;
            }
            if (checkCloseEnough(mx, selection.x + selection.w / 2) && checkCloseEnough(my, selection.y + selection.h)) {
                dragBM = true;
            }
            show();
            return;
        }
        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        // if (selection) {
        //     selection = null;
        // }
    }


}, true);
c.addEventListener('mousemove', function (e) {
    var mouse = getCanvasCoordinates(e);

    if (dragging) {
        //ctx.clearRect(rects[i].x, rects[i].y, rects[i].w, rects[i].h); IMPORTANT
        selection.x = mouse.x - dragoffx;
        selection.y = mouse.y - dragoffy;

        if (selection != null) {
            var mySel = selection;
            restoreSnapshot();
            ctx.strokeRect(mySel.x, mySel.y, mySel.w, mySel.h);
        }
    }
    if (dragTL) {
        selection.w += selection.x - mouse.x;
        selection.h += selection.y - mouse.y;
        selection.x = mouse.x;
        selection.y = mouse.y;
        show();
    }
    if (dragTR) {
        selection.w = Math.abs(selection.x - mouse.x);
        selection.h += selection.y - mouse.y;
        selection.y = mouse.y;
        show();
    }
    if (dragBL) {
        selection.w += selection.x - mouse.x;
        selection.h = mouse.y - selection.y;
        selection.x = mouse.x;
        show();
    }
    if (dragBR) {
        selection.w = mouse.x - selection.x;
        selection.h = mouse.y - selection.x;
        show();
    }
    if (dragTM) {
        selection.h += selection.y - mouse.y;
        selection.y = mouse.y;
        show();
    }
    if (dragLM) {
        selection.w += selection.x - mouse.x;
        selection.x = mouse.x;
        show();
    }
    if (dragBM) {
        selection.h = mouse.y - selection.y;
        show();
    }
    if (dragRM) {
        selection.w = mouse.x - selection.x;
        show();
    }
    //show();
    //
    //ctx.arc(mySel.x, mySel.y, mySel.r, 0, 2 * Math.PI, false);
    //ctx.stroke();
    //
    // ctx.moveTo(mySel.x, mySel.y);
    // ctx.lineTo(mySel.x + mySel.w, mySel.y + mySel.h);
    // ctx.stroke();

}, true);
c.addEventListener('mouseup', function (e) {
    dragging = false;
    dragTL = dragBL = dragTR = dragBR = dragTM = dragLM = dragRM = dragBM = false;
}, true);






update.addEventListener('click', () => {
    img = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    gctx.drawImage(c, 0, 0, img.width, img.height, 0, 0, ca.width / 2, ca.height / 2);
    gctx.drawImage(c, 0, 0, img.width, img.height, 0, 0, ca.width / 2, ca.height / 2);

});

function download() {
    var download = document.getElementById("download");
    var image = c.toDataURL("image/png").replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}

centreLine.addEventListener('click', function drawCentreLine(e) {
    if (selection !== null) {
        var xHalf = selection.x + selection.w / 2;
        var yhalf = selection.y + selection.h;
        ctx.moveTo(xHalf, selection.y);
        ctx.lineTo(xHalf, yhalf);
        ctx.stroke();
    }
});












