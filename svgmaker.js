/************************************************************
 * svgmaker.js - Create SVGs image to incorporate in the page
 *
 * Author: 	Krab
 * Version:	0.1
 * 
 ************************************************************/
var dirToNum = [];
dirToNum["up"] = 0;
dirToNum["right"] = 1;
dirToNum["down"] = 2;
dirToNum["left"] = 3;
 
function makeTriangle(reference, width, height, direction, sty) {
	var triangle = SVG(reference).size(width, height).viewbox(0, 0, 100, 100);
	
	var polygon = triangle.polygon("25,75 50,25 75,75")
		.transform({ rotation : dirToNum[direction] * 90, cx : 50, cy : 50 })
		.style(sty);
}



