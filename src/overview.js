import * as d3 from "d3";
import { getSharpleyValue } from "./service/getSharpleyValue";
import { drawBarChartFromData } from "./view/interaction/barChart";
import { drawBubbleChartFromData } from "./view/interaction/bubbleChart";
import { svgInit } from "./view/svgInit";


const svg = d3.select("svg");

svgInit(svg);

const data = getSharpleyValue();

// data.then(json => drawBubbleChartFromData(json));
data.then(json => drawBarChartFromData(json.children))
