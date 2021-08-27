import * as d3 from "d3";
import { drawDeleteBox, svgInit } from "./view/svgInit";
import drawObject from "./view/drawObject.js";
import { makeNode } from "./view/makeObject.js"
import { getSharpleyValue } from "./service/getSharpleyValue";
import { drawBarChartFromData } from "./view/drawBarChart";
import { initCell, setCell } from "./controller/cellController";
import { cellRecommendation, printResult } from "./view/printResult";


const architecture = d3.select("#architecture");
const sharpleyvalue = d3.select("#sharpleyvalue");

svgInit(architecture);
drawDeleteBox(architecture);
svgInit(sharpleyvalue);
drawObject();
cellRecommendation();

d3.selectAll(".append-button").on("click", makeNode);
d3.select("#init-cell").on("click", ()=>{
    initCell();
    printResult();
});


const data = getSharpleyValue();
data.then(json => drawBarChartFromData(json.children));



// setCell(
//     ['input',
//     'conv3x3-bn-relu', 'maxpool3x3',
//     'conv3x3-bn-relu', 'conv3x3-bn-relu',
//     'conv1x1-bn-relu',
//     'output'],

//     [[0, 1, 0, 0, 1, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0],
//     [0, 0, 0, 1, 0, 0, 1],
//     [0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 0, 0, 0, 0, 1],
//     [0, 0, 0, 0, 0, 0, 0]]
// )