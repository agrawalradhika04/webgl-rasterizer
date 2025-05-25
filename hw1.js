// Radhika Agrawal
// CS 390 - HW 1

"use strict"

var gl;
var canvas;
var increase = 0.001;
var points = [];

function main(){
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    // Initialize the data for the circles
    // Initialize center and radius of the first circle
    var center1 = [-0.5, 0.0];
    var radius1 = 0.2;

    // Call for function to draw first circle based on the data
    drawCircle(center1, radius1);

    // Initialize center and radius of the second circle
    var center2 = [0.0, 0.25];
    var radius2 = 0.1;
    
    // Call for function to draw second circle based on the data
    drawCircle(center2, radius2);

    // Initialize the data for the line segment
    // Initialize the start and the end position
    var start = [-1, -1];
    var end = [1, 1];

    // Call for function to draw line segment based on the data
    drawLineSegment(start, end);

    // Initialize the data for the triangle
    // Initialize the three vertices
    var vertexA = [0.5, 0];
    var vertexB = [0.6, 0.1];
    var vertexC = [0.7, -0.15];

    // Call for function to draw triangle based on the data
    drawTriangle(vertexA, vertexB, vertexC);

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Supply data to the program
    // In this case. it is aPosition
    var positionLoc = gl.getAttribLocation( program, "aPosition" );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

    // Send data to GPU
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );	

    // Associate shader variables with data buffer
    gl.enableVertexAttribArray( positionLoc );	
    var size = 2;	// 2 components per iteration
	var type = gl.FLOAT;	// the data is 32bit floats
	var normalize = false; 	// don't normalize the data
	var stride = 0; 	// 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0; 	// start at the beginning of the buffer
	gl.vertexAttribPointer(positionLoc, size, type, normalize, stride, offset);

    render();
};

// Function that draws a filled circle, given the center and the radius
function drawCircle(center, radius){

    // Looping through each pixel [i,j] on the canvas
    for(var i = -1; i <= 1; i+= increase){
        for(var j = -1; j <= 1 ; j+= increase){

            // Calculating the distance using the formula 
            // of distance between two points
            var a = Math.pow((i - center[0]), 2); 
            var b = Math.pow((j - center[1]), 2); 

            // d is the distance between the center and the pixel [i, j]
            var d = Math.sqrt( a + b ); 

            if(d <= radius){
                points.push([i, j]);
            }
        }
    }
}

// Function that draws a line segment, given the start and the end point
function drawLineSegment(start, end){

    // y2 - y1
    var numerator = (end[1] - start[1]); 

    // x2 - x1
    var denominator = (end[0] - start[0]); 

    if(denominator != 0){
        // Line is not vertical

        // Calculating the slope of the line segment 
        // joining the start and the end point
        var slope = numerator/ denominator;

        // Looping through each pixel [i,j] on the canvas
        if(slope != 0){
            for(var i = -1; i <= 1; i+= increase){
                for(var j = -1; j <= 1 ; j+= increase){

                    // Calculating the slope of the line segment 
                    // joining the pixel [i, j] and the end point
                    var checkSlope = (end[1] - j) / (end[0] - i);

                    // Any point on the line segment will have the same slope
                    if(checkSlope == slope){
                        points.push([i, j]);
                    }
                }
            }
        }
    }
    else{
        // Line is vertical
        // For each point on this line,
        // value of x-axis is the same

        var min = Math.min(start[1], end[1]);
        var max = Math.max(start[1], end[1]);

        // Looping through y-axis values from 
        // start to end point on the line
        for(var y = min; y <= max; y+= increase){
            points.push([start[0], y]);
        }
    }
}

// Function that draws a filled triangle
function drawTriangle(vertexA, vertexB, vertexC){

    // Looping through each pixel P(i,j) on the canvas
    for(var i = -1; i <=1; i+= increase){
        for(var j = -1; j <= 1; j+= increase){
            
            // Calculating the cross product AB and AP
            var crossproduct1 = (vertexB[0] - vertexA[0]) * (j - vertexA[1]) - (vertexB[1] - vertexA[1]) * (i - vertexA[0]);

            // Calculating the cross product BC and BP
            var crossproduct2 = (vertexC[0] - vertexB[0]) * (j - vertexB[1]) - (vertexC[1] - vertexB[1]) * (i - vertexB[0]);

            // Calculating the cross product CA and CP
            var crossproduct3 = (vertexA[0] - vertexC[0]) * (j - vertexC[1]) - (vertexA[1] - vertexC[1]) * (i - vertexC[0]);

            // If all 3 cross products have negative values
            // or all 3 cross products have positive values
            if((crossproduct1 > 0 && crossproduct2 > 0 && crossproduct3 > 0) || (crossproduct1 < 0 && crossproduct2 < 0 && crossproduct3 < 0)){
                // P is inside the triangle
                points.push([i,j]);
            }
        }
    }
}



function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length);
}

main();