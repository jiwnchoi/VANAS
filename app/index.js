import * as d3 from "d3";
import bootstrap from 'bootstrap';
import { makeSVGDefs } from "./svgdefs";
import { makeNode } from "./controller/nodeController";
import { printResult } from "./data/result.js";

const width = 1000;
const height = 600;
const radius = 40;

const svg = d3.select("body").append("svg")
    .attr("width",width)
    .attr("height",height);

makeSVGDefs(svg);
makeNode(svg, radius);

d3.select("body").append('input')
    .attr("type", "button")
    .attr("value", "PRINT MATRIX")
    .on("click", printResult);
