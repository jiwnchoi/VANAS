import * as d3 from "d3";
import { makeSVGDefs } from "./svgdefs";
import { makeNode } from "./controller/nodeController";


const radius = 40;

const svg = d3.select("svg")

makeSVGDefs(svg);
makeNode(svg, radius);