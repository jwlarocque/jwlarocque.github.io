paper.install(window);

var width;
var height;

var path;
var canvas;

var anchors = [];
var anchorGroup;
var strokes = [];
var intersections = new Set();
var constructionGroup;
var invisibleGroup;

var lastStroke;
var center;

var startAnchor;
var endAnchor;

var lockPreview = false;
var previewStroke;
var tool1;

var currentTool = 0;
var arcFactor = .4; // quarter circle, 1 for half
var startSelected = false;
var intersectTolerance = 10;
var drawInfinite = false;
var drawSymmetry = false;
var drawVisible = true;

var symmetryDeg = 4;

var toolReprs = ["L", "A", "C"];

var defaultColor = new Color(.6, .6, .6);
var previewColor = new Color(.8, .8, .8);
var highlightColor = new Color(1, 0, 0);
var invisibleColor = new Color(.9, .9, .9);
var drawColor = defaultColor;

$(document).ready(function(){
    canvas = $("#drawing");

    width = canvas.width();
    canvas.height(width)
    height = canvas.height();
    width -= 10;
    height -= 10;
    console.log("Drawing width: " + width + ", height: " + height);

    paper.setup(canvas[0]);
    path = new paper.Path();
    path.strokeColor = "black";
    var start = new Point(50, 50);
    var end = new Point(200, 200);

    anchorGroup = new Group();
    invisibleGroup = new Group();
    constructionGroup = new Group();

    // draw bounding box
    // checkIntersects(drawLine(new Point(10, 10), new Point(10, width), drawColor));
    // checkIntersects(drawLine(new Point(10, width), new Point(width, width), drawColor));
    // checkIntersects(drawLine(new Point(width, 10), new Point(width, width), drawColor));
    // checkIntersects(drawLine(new Point(10, 10), new Point(width, 10), drawColor));
    drawStroke(new Point(10, 10), new Point(10, width));
    drawStroke(new Point(10, width), new Point(width, width));
    drawStroke(new Point(width, 10), new Point(width, width));
    drawStroke(new Point(10, 10), new Point(width, 10));

    // draw cross lines
    // checkIntersects(drawLine(new Point(10 + (width - 10) / 2, 10), new Point(10 + (width - 10) / 2, width), drawColor));
    // checkIntersects(drawLine(new Point(10, 10 + (width - 10) / 2), new Point(width, 10 + (width - 10) / 2), drawColor));
    drawStroke(new Point(10 + (width - 10) / 2, 10), new Point(10 + (width - 10) / 2, width));
    drawStroke(new Point(10, 10 + (width - 10) / 2), new Point(width, 10 + (width - 10) / 2));
    calculateAnchors();

    center = new Point(width / 2, width / 2);

    tool1 = new Tool();
    tool1.onMouseMove = function(event) {
        if (startSelected && !lockPreview) {
            eraseStroke(previewStroke);
            previewStroke = drawStroke(startAnchor.position, new Point(event.point), previewColor);
        }
    }
    tool1.onMouseUp = function(event) {
        eraseStroke(previewStroke);
    }
    tool1.onMouseDown = function(event) {
        if (event.event.button == 2) {
            startAnchor = null;
            startSelected = false;
            eraseStroke(previewStroke);
        }
    }
});

function drawStroke(start, end) {
    var ret;
    if (currentTool == 0) {
        ret = drawLine(start, end, (drawVisible ? drawColor : invisibleColor));
    } else if (currentTool == 1) {
        ret = drawArc(start, end, (drawVisible ? drawColor : invisibleColor));
    } else if (currentTool == 2) {
        ret = drawCircle(start, end, (drawVisible ? drawColor : invisibleColor));
    }
    if (!drawVisible) {
        invisibleGroup.addChild(ret);
    } else if (drawColor.equals(defaultColor)) {
        constructionGroup.addChild(ret);
    }
    if (drawSymmetry) {
        for (var i = 1; i < symmetryDeg; i++) {
            var clone = ret.clone();
            clone.rotate(i * (360 / symmetryDeg), center);
            ret.addChild(clone);
        }
    }
    return ret;
}

function eraseStroke(stroke) {
    if (stroke) {
        strokes = strokes.filter(item => item !== stroke);
        //console.log(stroke.children[0]);
        //stroke.removeChildren();
        stroke.remove();
    }
}

function undo() {
    console.log("undo called");
    if (lastStroke) {
        eraseStroke(lastStroke);
        lastStroke = null;
    } else {
        strokes.pop().remove();
        console.log("Nothing to undo.");
    }
    calculateAnchors();
}

function drawLine(start, end, color) {
    var stroke = new Path.Line(start, end);
    stroke.moveBelow(anchorGroup);
    stroke.strokeColor = color;
    stroke.strokeWidth = 4;
    stroke.strokeCap = 'square';
    if (drawInfinite) {
        stroke.scale(100);
    }
    strokes.push(stroke);
    view.draw();
    return stroke;
}

function drawArc(start, end, color) {
    var between = new Path.Line(start, end);
    var offset = between.length / 2;
    var normal = between.getNormalAt(offset).multiply(offset * arcFactor);
    var stroke = new Path.Arc(start, between.getPointAt(offset).add(normal), end);
    between.remove();
    stroke.moveBelow(anchorGroup);
    stroke.strokeColor = color;
    stroke.strokeWidth = 4;
    stroke.strokeCap = 'round';
    strokes.push(stroke);
    view.draw();
    return stroke;
}

function drawCircle(start, end, color) {
    var between = new Path.Line(start, end);
    var stroke = new Path.Circle(start, between.length);
    stroke.moveBelow(anchorGroup);
    stroke.strokeColor = color;
    stroke.strokeWidth = 4;
    stroke.strokeCap = 'round';
    strokes.push(stroke);
    view.draw();
    return stroke;
}

function checkIntersects(stroke) {
    var temp = [];
    var isDuplicate;
    for (var i = 0; i < strokes.length; i++) {
        temp = temp.concat(stroke.getIntersections(strokes[i]));
    }
    console.log("Temp: " + temp);
    for (let intersection of temp) {
        isDuplicate = false;
        for (let other of intersections) {
            if (other.point.isClose(intersection.point, intersectTolerance)) {
                isDuplicate = true;
            }
        }
        if (!isDuplicate) {
            intersections.add(intersection);
            anchors.push(new Path.Circle({
                center: intersection.point,
                radius: 10,
                fillColor: "#CCCCCC",
                strokeColor: "#444444",
                strokeWidth: 2,
                opacity: .2
            }));
            anchorGroup.addChild(anchors[anchors.length - 1]);
            anchors[anchors.length - 1].onMouseEnter = function(e) {
                this.opacity = 1;
                if (startSelected) {
                    lockPreview = true;
                    eraseStroke(previewStroke);
                    previewStroke = drawStroke(startAnchor.position, this.position, "#66666");
                }
            }
            anchors[anchors.length - 1].onMouseLeave = function(e) {
                this.opacity = .1;
                lockPreview = false;
                eraseStroke(previewStroke);
            }
            anchors[anchors.length - 1].onMouseUp = function(e) {
                if (e.event.button == 0) {
                    if (!startSelected) {
                        startAnchor = this;
                        startSelected = true;
                    } else {
                        endAnchor = this;
                        if (startAnchor && startAnchor != endAnchor) {
                            lastStroke = drawStroke(startAnchor.position, endAnchor.position);
                            //checkIntersects(lastStroke);
                            calculateAnchors();
                            startSelected = false;
                        }
                    }
                }
            }
        }
    }
    for (var j = 0; j < temp.length; j++) {
        intersections.add(temp[j]);
    }
    view.draw();
}

function calculateAnchors() {
    intersections = new Set();
    anchorGroup = new Group();
    for (let anchor of anchors) {
        anchor.remove();
    }
    var temp = [];
    var supertemp = [];
    var isDuplicate;
    for (var i = 0; i < strokes.length; i++) {
        for (var j = 0; j < strokes.length; j++) {
            supertemp = strokes[j].getIntersections(strokes[i]);
            for (let tempIntersection of supertemp) {
                tempIntersection["strokeOne"] = i;
                tempIntersection["strokeTwo"] = j;
            }
            temp = temp.concat(supertemp);
        }
    }
    for (let intersection of temp) {
        isDuplicate = false;
        for (let other of intersections) {
            if (other.point.isClose(intersection.point, intersectTolerance)) {
                isDuplicate = true;
            }
        }
        if (!isDuplicate) {
            intersections.add(intersection);
            anchors.push(new Path.Circle({
                center: intersection.point,
                radius: 10,
                fillColor: "#CCCCCC",
                strokeColor: "#444444",
                strokeWidth: 2,
                opacity: .2
            }));
            anchors[anchors.length - 1]["strokeOne"] = intersection["strokeOne"];
            anchors[anchors.length - 1]["strokeTwo"] = intersection["strokeTwo"];
            anchorGroup.addChild(anchors[anchors.length - 1]);
            anchors[anchors.length - 1].onMouseEnter = function(e) {
                this.opacity = 1;
                if (startSelected) {
                    lockPreview = true;
                    eraseStroke(previewStroke);
                    previewStroke = drawStroke(startAnchor.position, this.position, "#66666");
                }
            }
            anchors[anchors.length - 1].onMouseLeave = function(e) {
                this.opacity = .1;
                lockPreview = false;
                eraseStroke(previewStroke);
            }
            anchors[anchors.length - 1].onMouseUp = function(e) {
                if (e.event.button == 0) {
                    if (!startSelected) {
                        startAnchor = this;
                        startSelected = true;
                    } else {
                        endAnchor = this;
                        if (startAnchor && startAnchor != endAnchor) {
                            lastStroke = drawStroke(startAnchor.position, endAnchor.position);
                            $("#steps").append("<p" + (drawColor.equals(highlightColor) ? " style=\"color: red\"" : "") + ">" +
                                (strokes.length - 2) + ": " +
                                toolReprs[currentTool] + (currentTool == 1 ? arcFactor.toString() : "") + "(" +
                                startAnchor["strokeOne"] + " + " + startAnchor["strokeTwo"] + ", " +
                                endAnchor["strokeOne"] + " + " + endAnchor["strokeTwo"] +
                                "), " +
                                (drawColor.equals(highlightColor) ? "R" : "G") +
                                (currentTool == 0 ? (", " + (drawInfinite ? "I" : "F")) : "") + "</p>");
                            console.log("Stroke from the intersection of: " + startAnchor["strokeOne"] + " and " + startAnchor["strokeTwo"] + " to the intersection of " + endAnchor["strokeOne"] + " and " + endAnchor["strokeTwo"] + ".")
                            //checkIntersects(lastStroke);
                            calculateAnchors();
                            startSelected = false;
                        }
                    }
                }
            }
        }
    }
    for (var j = 0; j < temp.length; j++) {
        intersections.add(temp[j]);
    }
    view.draw();
}
