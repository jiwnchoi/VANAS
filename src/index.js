import * as d3 from "d3";
import { svgInit } from "./view/svginit";
import drawObject from "./view/drawObject.js";
import { makeNode } from "./view/makeObject.js"


const svg = d3.select("svg");

svgInit(svg);
drawObject();

d3.selectAll(".append-button")
    .on("click", makeNode);