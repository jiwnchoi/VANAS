import * as d3 from "d3";
import { copyCelltoMain, setCell } from "../controller/cellController";
import { getEdgeData, getNodeData } from "../data/data";
import getRecommendation from "../service/getRecommendation";
import { drawObjectwithForce } from "./drawObject";




export default function printRecommendation() {
    const nodeData = getNodeData();
    const edgeData = getEdgeData();

    const data = getRecommendation(nodeData, edgeData);
    const recommendCell = d3.select("#recommend-col").selectAll(".recommend-cell").data(data);

    //update
    recommendCell
        .on("click", (_, d) => {
            const i = data.indexOf(d);
            copyCelltoMain(i);
        })

    recommendCell
        .select("#recommend-accuracy")
        .text((d) => "Accuracy: " + Math.round(d[0] * 10000) / 10000);



    //enter
    const recommendCellEnter = recommendCell
        .enter()
        .append("div")
        .attr("class", "row g-0 recommend-cell ")
        .on("click", (_, d) => {
            const i = data.indexOf(d);
            copyCelltoMain(i);
        });


    recommendCellEnter
        .append("div")
        .attr("class", "border bg-light svg-container mb-1 ")
        .append("svg")
        .attr("id", (_, i) => "recommend" + (i + 1))
        .attr("viewBox", "0 0 800 600")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("class", "svg-content-responsive recommend-cell-svg");

    recommendCellEnter
        .append('div')
        .attr('id', 'recommend-accuracy')
        .attr("class", "row g-0 d-flex justify-content-center align-middle mb-1")
        .text((d) => "Accuracy : " + Math.round(d[0] * 10000) / 10000);




    recommendCell
        .exit()
        .remove()

    for (let i = 0; i < data.length; i++) {
        setCell(data[i][1], data[i][2], i + 1);
        drawObjectwithForce(null, i + 1)
    }


}
