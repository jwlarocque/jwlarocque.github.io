var c = document.getElementById("testCanvas");
var context = c.getContext('2d')
var totalOffsetX = 0;
var totalOffsetY = 0;
var currentElement = c;
var menuToggle = 0;
var pointArray = [];
var lastUpdate = 0;
const significantDistance = 350;

$(document).ready(function() {
    updateOffset();
    resizeCanvas();
});

$(window).resize(function() {resizeCanvas(); });

function resizeCanvas() {
    //updateCanvasDimensions;  I wrote this when I was 15, but I can't for the life of me figure out why.
    var dimension = [document.getElementById("testCanvas").clientWidth, document.getElementById("testCanvas").clientHeight];
    c.width = dimension[0];
    c.height = dimension[1];
    pointArray = [];
    var tempEvent = $.Event('mousemove', {pageX: 10, pageY: 10});
    $("#testCanvas").trigger(tempEvent); // Look it's fine.
};

function updateOffset() {
    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while (currentElement = currentElement.offsetParent)
};

$("#testCanvas").mousemove(function(ev) {
    e = jQuery.event.fix(ev);
    if (Date.now() - lastUpdate > 30) {
        lastUpdate = Date.now();

        context.clearRect(0, 0, c.width, c.height);

        if (typeof pointArray !== "undefined" && pointArray.length > 0) {
                for (var i = 0; i < pointArray.length; i++) {
                pointArray[i].update();
                pointArray[i].draw();
            };
        } else {
            for (var i = 20; i <= c.width; i = i + 50) {
                for (var j = 20; j <= c.height; j = j + 50) {
                    pointArray.push(new Point(i, j));
                    pointArray[pointArray.length - 1].update();
                    pointArray[pointArray.length - 1].draw();
                };
            };
        };
    };

    function Point(x, y) {
        var curPos = [x, y];
        var targetPos = [x, y];
        this.update = function() {
            var dx = e.pageX - totalOffsetX - curPos[0];
            var dy = e.pageY - totalOffsetY - curPos[1];
            if (dx < significantDistance && dx > -significantDistance && dy < significantDistance && dy > -significantDistance)
            {
                var d = Math.hypot(dx, dy) * .001;
                var theta = Math.atan(dy / dx);
                if (dx >= 0) {
                    targetPos[0] = curPos[0] + Math.cos(-theta) / d;
                    targetPos[1] = curPos[1] + Math.sin(theta) / d;
                } else if (dx <= 0) {
                    targetPos[0] = curPos[0] - Math.cos(-theta) / d;
                    targetPos[1] = curPos[1] - Math.sin(theta) / d;
                };
            } else {
                targetPos[0] = curPos[0];
                targetPos[1] = curPos[1];
            };
        };
        this.draw = function() {
            drawLine(curPos[0], curPos[1], targetPos[0], targetPos[1]);
        };
    };

    function updateCanvasDimensions() {
        canvas.attr({height: $(window).height(), width: $(window).width()});
        canvasWidth = canvas.width();
        canvasHeight = canvas.height();
    };

    function drawLine(x1, y1, x2, y2) {
        context.lineWidth = 3;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2, 6);
        context.strokeStyle = "red";
        context.stroke();
    };
});