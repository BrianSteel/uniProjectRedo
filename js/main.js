var c = document.getElementById('canvas'),
    ctx = c.getContext("2d"),
    canvasWidth = 1000,
    canvasHeight = 1000;
var startx = 0;
var starty = 0;
var mouseX = 0;
var mouseY = 0;
var lineDragging = false;
var existingLines = [];
var bounds = null;

c.width = canvasWidth;
c.height = canvasHeight;
var WIDTH = c.width,
    snapshot,
    HEIGHT = c.height,
    canvasOffset = c.getBoundingClientRect(),
    offsetX = canvasOffset.left,
    offsetY = canvasOffset.top,
    dragging = false,
    lineDragging = false,
    startX,
    startY,
    rects = [],
    closeEnough = 8,
    dragTL = dragBL = dragTR = dragBR = dragTM = dragLM = dragRM = dragBM = false,
    selection = null,
    lineWidth = document.getElementById("lineWidth"),
    fillColor = document.getElementById("fillColor"),
    strokeColor = document.getElementById("strokeColor"),
    canvasColor = document.getElementById("backgroundColor"),
    clearCanvas = document.getElementById("clearCanvas"),
    fillBox = document.getElementById("fillBox");
bounds = c.getBoundingClientRect();


var brect = document.getElementById('rect');
var bline = document.getElementById('slantline');


ctx.strokeStyle = strokeColor.value;
ctx.fillStyle = fillColor.value;
ctx.lineWidth = lineWidth.value;


function rectangle(x, y, w, h, stroke, fill, isDrag) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.stroke = stroke || '#AAAAAA';
    this.fill = fill || '#AAAAAA';
    this.isDrag = false;
}


function removeBlineEvents() {
    c.removeEventListener('mousedown', onmousedown);
    c.removeEventListener('mousemove', onmousemove);
    c.removeEventListener('mouseup', onmouseup);
}

function removeBrectEvents() {
    c.removeEventListener('dblclick', doubleClick, false);
    c.removeEventListener('mousedown', mdown, true);
    c.removeEventListener('mousemove', mmove, true);
    c.removeEventListener('mouseup', mup, true);
}

// bRemoveEvent.addEventListener('click', removeAdds, false);
c.addEventListener('selectstart', function (e) { e.preventDefault(); return false; }, false);

brect.addEventListener('click', () => {
    removeBlineEvents();
    c.addEventListener('dblclick', doubleClick, false);
    c.addEventListener('mousedown', mdown, true);
    c.addEventListener('mousemove', mmove, true);
    c.addEventListener('mouseup', mup, true);
}, true);

bline.addEventListener('click', () => {
    removeBrectEvents();
    canvas.addEventListener('mousedown', onmousedown);
    canvas.addEventListener('mousemove', onmousemove);
    canvas.addEventListener('mouseup', onmouseup);
}, true);

lineWidth.addEventListener("input", changeLineWidth, false);
fillColor.addEventListener("input", changeFillStyle, false);
strokeColor.addEventListener("input", changeStrokeStyle, false);
canvasColor.addEventListener("input", changeBackgroundColor, false);
clearCanvas.addEventListener("click", eraseCanvas, false);


function doubleClick(e) {
    var mouse = getCanvasCoordinates(e);
    addShapeRects(new rectangle(mouse.x - 75, mouse.y - 50, 150, 100, strokeColor.value, fillColor.value, false));
    console.log(rects);
}

function addShapeRects(shape) {
    rects.push(shape);
    draw();
}

function rect(x, y, w, h, s, f) {
    ctx.beginPath();
    ctx.strokeStyle = s;
    ctx.fillStyle = f;
    ctx.rect(x, y, w, h);
    ctx.closePath();
    if (fillBox.checked) {
        ctx.fill();
    }
    else {
        ctx.stroke();
    }
}


function draw() {
    clear();
    if (existingLines.length >= 0) {
        drawline();
    }
    var l = rects.length;
    for (var i = 0; i < l; i++) {
        var r = rects[i];
        rect(r.x, r.y, r.w, r.h, r.stroke, r.fill);
    }
}


function drawCircle(x, y, radius) {
    ctx.globalCompositeOperation = 'xor';
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
}

function mdown(e) {
    e.preventDefault();
    e.stopPropagation();
    var selected = null;
    var mouse = getCanvasCoordinates(e),
        mx = mouse.x,
        my = mouse.y;
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (mx > r.x && mx < r.x + r.w && my > r.y && my < r.y + r.h) {
            dragging = true;
            r.isDrag = true;
            selected = r;
            selection = r;
            if (selected === r) {
                show(selected);
            }
        }
        if (selection !== null) {
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
        }
        if (selected === null) {
            draw();
        }

    }
    startX = mx;
    startY = my;
}


function mmove(e) {
    e.preventDefault();
    e.stopPropagation();
    var mouse = getCanvasCoordinates(e);
    var mx = mouse.x,
        my = mouse.y;
    if (dragging) {
        var dx = mx - startX;
        var dy = my - startY;
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            if (r.isDrag) {
                r.x += dx;
                r.y += dy;
                selection = r;
                draw();
            }
        }
    }
    if (dragTL) {
        selection.w += selection.x - mx;
        selection.h += selection.y - my;
        if ((selection.x < (selection.x + selection.w)) && (selection.y < (selection.y + selection.h))) {
            selection.x = mx;
            selection.y = my;
        }
        draw();
        if ((selection.x >= (selection.x + selection.w)) || (selection.y >= (selection.y + selection.h))) {
            alert('You have altered the x or y or both. This box can no longer be selected! Please try again')
        }
    }
    if (dragTR) {
        selection.w = mx - selection.x;
        selection.h += selection.y - my;
        selection.y = my;
        draw();
        if ((selection.x >= (selection.x + selection.w)) || (selection.y >= (selection.y + selection.h))) {
            alert('You have altered the x or y or both. This box can no longer be selected! Please try again')
        }
    }
    if (dragBL) {
        selection.w += selection.x - mx;
        selection.h = my - selection.y;
        selection.x = mx;
        draw();
        if ((selection.x >= (selection.x + selection.w)) || (selection.y >= (selection.y + selection.h))) {
            alert('You have altered the x or y or both. This box can no longer be selected! Please try again')
        }
    }
    if (dragBR) {
        selection.w = mx - selection.x;
        selection.h = my - selection.x;
        draw();
        if ((selection.x >= (selection.x + selection.w)) || (selection.y >= (selection.y + selection.h))) {
            alert('You have altered the x or y or both. This box can no longer be selected! Please try again')
        }
    }
    if (dragTM) {
        selection.h += selection.y - my;
        selection.y = my;
        draw();
        if ((selection.x >= (selection.x + selection.w)) || (selection.y >= (selection.y + selection.h))) {
            alert('You have altered the x or y or both. This box can no longer be selected! Please try again')
        }
    }
    if (dragLM) {
        selection.w += selection.x - mx;
        selection.x = mx;
        draw();
        if ((selection.x >= (selection.x + selection.w)) || (selection.y >= (selection.y + selection.h))) {
            alert('You have altered the x or y or both. This box can no longer be selected! Please try again')
        }
    }

    if (dragBM) {
        selection.h = my - selection.y;
        draw();
        if ((selection.x >= (selection.x + selection.w)) || (selection.y >= (selection.y + selection.h))) {
            alert('You have altered the x or y or both. This box can no longer be selected! Please try again')
        }
    }
    if (dragRM) {
        selection.w = mx - selection.x;
        draw();
        if ((selection.x >= (selection.x + selection.w)) || (selection.y >= (selection.y + selection.h))) {
            alert('You have altered the x or y or both. This box can no longer be selected! Please try again')
        }
    }
    startX = mx;
    startY = my;
}

function mup(e) {
    e.preventDefault();
    e.stopPropagation();
    dragging = false;
    for (var i = 0; i < rects.length; i++) {
        rects[i].isDrag = false;
    }
    dragTL = dragBL = dragTR = dragBR = dragTM = dragLM = dragRM = dragBM = false;
}



function show(selected) {
    ctx.strokeRect(selected.x, selected.y, selected.w, selected.h);
    drawCircle(selected.x, selected.y, closeEnough);
    drawCircle(selected.x + selected.w, selected.y, closeEnough);
    drawCircle(selected.x + selected.w, selected.y + selected.h, closeEnough);
    drawCircle(selected.x, selected.y + selected.h, closeEnough);
    drawCircle(selected.x + selected.w / 2, selected.y, closeEnough);
    drawCircle(selected.x, selected.y + selected.h / 2, closeEnough);
    drawCircle(selected.x + selected.w / 2, selected.y + selected.h, closeEnough);
    drawCircle(selected.x + selected.w, selected.y + selected.h / 2, closeEnough);
}

function changeLineWidth(e) {
    ctx.lineWidth = this.value;
    e.stopPropagation();
}

function changeFillStyle(e) {
    ctx.fillStyle = this.value;
    e.stopPropagation();
}

function changeStrokeStyle(e) {
    ctx.strokeStyle = this.value;
    e.stopPropagation();
}

function changeBackgroundColor() {
    ctx.save();
    ctx.fillStyle = document.getElementById("backgroundColor").value;
    c.style.background = ctx.fillStyle;
    ctx.restore();
}

function eraseCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    rects = [];
}


function drawline() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = strokeColor.value;

    ctx.beginPath();

    for (var i = 0; i < existingLines.length; ++i) {
        var line = existingLines[i];
        ctx.moveTo(line.startx, line.starty);
        ctx.lineTo(line.endX, line.endY);
    }

    ctx.stroke();

    if (lineDragging) {
        ctx.strokeStyle = "darkred";
        // ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startx, starty);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
    }
}

function onmousedown(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!lineDragging) {
        startx = e.pageX - bounds.left;
        starty = e.pageY - bounds.top;

        lineDragging = true;
    }
    //takeSnapshot();
    drawline();
    draw();
}

function onmouseup(e) {
    e.preventDefault();
    e.stopPropagation();
    if (lineDragging) {
        existingLines.push({
            startx: startx,
            starty: starty,
            endX: mouseX,
            endY: mouseY
        });

        lineDragging = false;
    }
    drawline();
    if (rect.length >= 0) {
        draw();
    }
}

function onmousemove(e) {
    e.preventDefault();
    e.stopPropagation();
    mouseX = e.pageX - bounds.left;
    mouseY = e.pageY - bounds.top;

    if (lineDragging) {

        drawline();
        if (rect.length >= 0) {
            draw();
        }
    }
}



function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function checkCloseEnough(p1, p2) {
    return Math.abs(p1 - p2) <= closeEnough;
}

function getCanvasCoordinates(event) {
    var x = event.pageX - offsetX,
        y = event.pageY - offsetY;

    return { x: x, y: y };
}


function takeSnapshot() {
    console.log('takesnapshot is triggered');

    snapshot = ctx.getImageData(0, 0, WIDTH, HEIGHT);
}

function restoreSnapshot() {
    console.log('restoreSnapshot is triggered');

    ctx.putImageData(snapshot, 0, 0);
}