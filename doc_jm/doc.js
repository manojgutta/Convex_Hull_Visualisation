/**
 * @type {number[]} Setting up the color of the points to be plotted.
 */
let pointColor = [249, 127, 81];

/**
 * @type {number[]} Differentiating the color of the hull from the points.
 */
let hullColor = [255, 0, 0];

/**
 * @type {number[]} Representing the points traversed through line connections.
 */
let lineColor = [37, 204, 247];

/**
 * @type {number[][]} Data structure to store all the generated points.
 */
let coords = [];

/**
 * @type {number[][]} Data structure to store all the points that can be part of the convex hull.
 */
let hull = [];

/**
 * @type {number[]} Variable to store the current point we are assessing for determining the hull.
 */
let currentPoint;

/**
 * @type {HTMLInputElement}
 */
let sampleInput = document.getElementById('sampleInput');

/**
 * @type {HTMLCanvasElement} Represents the canvas element.
 */
let canvas;

/**
 * @type {boolean} Indicates whether points are currently being added to the canvas.
 */
let addingPoints = true;

/**
 * Sets up the canvas.
 */
function setupCanvas() {
    canvas = createCanvas(6000, 2750);
    canvas.parent('canvasContainer');
}

/**
 * Initializes the canvas and sets the frame rate.
 */
function setup() {
    setupCanvas();
    frameRate(4); // Set the frame rate to 1 frame per second
}

/**
 * Clears the canvas and resets variables.
 */
function clearCanvas() {
    coords = [];
    hull = [];
    clear();
    addingPoints = true;
}


/**
 * Generates random points on the canvas.
 */
function generateRandomPoints() {
    clearCanvas();
    let sample = parseInt(sampleInput.value);
    coords = [];
    for (let i = 0; i < sample; i++) {
        let x = random(30, width-100);
        let y = random(30, height-100);
        coords.push([x, y]);
    }
    drawPoints();
}

/**
 * Starts the convex hull algorithm by initially calculating the left-most point.
 */
function runConvexHull() {
    if (coords.length < 3) {
        alert("At least 3 points are needed to run Convex Hull.");
        return;
    }
    addingPoints = false;
    hull = [];
    let leftmostX = Math.min(...coords.map(coord => coord[0]));
    currentPoint = coords.find(coord => coord[0] === leftmostX);
    hull.push(currentPoint);
    loop();
}

/**
 * Handles mouse click event for adding points to the canvas.
 */
function mouseClicked() {
    if (addingPoints && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        coords.push([mouseX, mouseY]);
        clear();
        drawPoints();
    }
}

/**
 * Marks the user input points on the canvas.
 */
function drawPoints() {
    background(255);
    for (let coord of coords) {
        fill(pointColor);
        noStroke();
        circle(coord[0], coord[1], 20);
    }
}

/**
 * This is the main driver function corresponding to the algorithm.
 * Draws the points, lines, and the convex hull on the canvas. It makes the necessary function calls for 
 * looping through each point in the coords array, to fill a circle at that point with the color specified by pointColor.
 * Next, it loops through the points in the hull array and draws lines between consecutive points to visualize the convex hull.
 * It then determines the next point to consider in the convex hull algorithm. This is done by looping through all points and checking if they form a counterclockwise turn with the current point (currentPoint) and the next point in the coords array. The direction() function is used for this purpose.
 * Once the next point is determined, it becomes the new currentPoint. The current point is added to the hull array. If the last point added to the hull matches the second point added (i.e., if the hull is closed), it draws a line connecting the last point to the first point to complete the convex hull. 
 * Additionally, if the hull has at least three points and the current point matches the second point added to the hull, it stops the loop using noLoop(), indicating that the convex hull has been fully constructed.
 */
function draw() {
    if (!addingPoints) {
        // Draw convex hull algorithm
        for (let i = 0; i < hull.length - 1; i++) {
            stroke(hullColor);
            strokeWeight(8);
            line(hull[i][0], hull[i][1], hull[i + 1][0], hull[i + 1][1]);
        }

        let nextPoint = coords[(coords.indexOf(currentPoint) + 1) % coords.length];
        for (let checkPoint of coords) {
            stroke(lineColor);
            strokeWeight(1);
            line(currentPoint[0], currentPoint[1], checkPoint[0], checkPoint[1]);
            if (direction(currentPoint, nextPoint, checkPoint)) {
                nextPoint = checkPoint;
            }
        }
        currentPoint = nextPoint;
        hull.push(currentPoint);
        if (hull.length > 2 && currentPoint[0] === hull[0][0] && currentPoint[1] === hull[0][1]) {
            stroke(hullColor);
            strokeWeight(8);
            line(hull[hull.length - 1][0], hull[hull.length - 1][1], hull[0][0], hull[0][1]); // Connect last point to first point
        }
        if (hull.length > 2 && currentPoint[0] === hull[1][0] && currentPoint[1] === hull[1][1]) {
            noLoop();
        }
    }
}

/**
 * Determines the direction of three points (clockwise or counterclockwise).
 * @param {number[]} a The first point [x, y].
 * @param {number[]} b The second point [x, y].
 * @param {number[]} c The third point [x, y].
 * @returns {boolean} True if the direction is counterclockwise, false if clockwise.
 */
function direction(a, b, c) {
    return ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) < 0;
}
