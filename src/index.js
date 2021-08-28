import * as d3 from "d3";
import { drawDeleteBox, svgInit } from "./view/svgInit";
import drawObject from "./view/drawObject.js";
import { makeNode } from "./view/makeObject.js"
import { getSharpleyValue } from "./service/getSharpleyValue";
import { drawBarChartFromData } from "./view/drawBarChart";
import { initCell, setCell } from "./controller/cellController";
import { drawHeatmap } from "./view/drawHeatmap";


const architecture = d3.select("#architecture");
const sharpleyvalue = d3.select("#sharpleyvalue");

svgInit(architecture);
drawDeleteBox(architecture);
svgInit(sharpleyvalue);
drawObject();

d3.selectAll(".append-button").on("click", makeNode);
d3.select("#init-cell").on("click", () => {
    initCell();
    drawObject();
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

const heatmap = d3.select("#heatmap");
const tooltip = d3.select("#tooltip");

// read local json file
let heatmapData;
let httpRequest = new XMLHttpRequest(); // asynchronous request
httpRequest.open("GET", "./result.json", true);
httpRequest.send();
httpRequest.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) { // when the request has completed
        heatmapData = JSON.parse(this.response);
        generateHeatmap();

        let options = document.getElementById("options");
        let heatmapButton = document.createElement("button");
        heatmapButton.innerText = "Generate Heatmap";
        heatmapButton.classList.add("btn");
        heatmapButton.classList.add("btn-primary");
        heatmapButton.addEventListener("click", () => {
            heatmap.select("svg").remove();
            generateHeatmap();
        });
        options.appendChild(heatmapButton);
    }
});

function generateHeatmap() {
    let optionX = document.getElementById("optionX"),
        optionY = document.getElementById("optionY"),
        optionZ = document.getElementById("optionZ");

    let heatmapResult = drawHeatmap()
        .x(d => d[optionX.value])
        .y(d => d[optionY.value])
        .z(d => d[optionZ.value])
        .splitX(50)
        .splitY(30)
        (heatmapData);
    heatmap.append(() => heatmapResult[0]);
    tooltip.append(() => heatmapResult[1]);
};