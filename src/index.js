import * as d3 from "d3";
import { drawDeleteBox, svgInit } from "./view/svgInit";
import drawObject from "./view/drawObject.js";
import { makeNode } from "./view/makeObject.js"
import { getSharpleyValue } from "./service/getSharpleyValue";
import { drawBarChartFromData } from "./view/drawBarChart";


const architecture = d3.select("#architecture");
const sharpleyvalue = d3.select("#sharpleyvalue");

svgInit(architecture);
drawDeleteBox(architecture);
svgInit(sharpleyvalue);
drawObject();

d3.selectAll(".append-button").on("click", makeNode);


const data = getSharpleyValue();
data.then(json => drawBarChartFromData(json.children));
