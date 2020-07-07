var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


canvas.addEventListener('mousedown', start);
canvas.addEventListener('mouseup', end);

function start(ev){
    ctx.beginPath();
    ctx.moveTo(ev.offsetX, ev.offsetY);
}

function end(ev) {
    ctx.lineTo(ev.offsetX, ev.offsetY);
    ctx.stroke();
}
