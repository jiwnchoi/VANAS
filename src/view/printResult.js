import * as d3 from "d3";
import { getEdgeData, getNodeData } from "../data/data";
import { cellSainityCheck, excludeExtraneous } from "../data/dataProcessing";
import getQuery from "../service/getQuery";
import drawObject from "./drawObject";


export default async function printResult() {
    d3.select("#analytics").attr("class", "visually-hidden");
<<<<<<< HEAD
=======
    d3.select("#initAlert").attr("class", "visually-hidden");

>>>>>>> origin/heatmap

    const nodeData = getNodeData();
    const edgeData = getEdgeData();
    const cellStatus = cellSainityCheck();
    let checker = 0;


<<<<<<< HEAD
    //number of edge check
    if(cellStatus.numEdges > 9){
=======

    if (cellStatus.numEdges > 9) {
>>>>>>> origin/heatmap
        d3.select("#analytics").attr("class", "visually-hidden");
        d3.select("#edgeNumberAlert")
            .attr("class", "notcell alert alert-danger");
        checker++;
    }
<<<<<<< HEAD
    //isconnected
    if(!cellStatus.isConnected){
=======

    if (!cellStatus.isConnected) {
>>>>>>> origin/heatmap
        d3.select("#analytics").attr("class", "visually-hidden");
        d3.select("#connectAlert")
            .attr("class", "notcell alert alert-warning");
        checker++;
    }
<<<<<<< HEAD
    //isAcyclic
    if(!cellStatus.isAcyclic){
=======

    if (!cellStatus.isAcyclic) {
>>>>>>> origin/heatmap
        d3.select("#analytics").attr("class", "visually-hidden");
        d3.select("#cycleAlert")
            .attr("class", "notcell alert alert-danger");
        checker++;
    }

<<<<<<< HEAD

    //init ext info
    for (let node of nodeData) {
        node.status = null;
    }
    for (let edge of edgeData) {
        edge.isExt = false;
    }


    // extraneous check
    if(cellStatus.extraneous.length > 0){
=======
    if (cellStatus.extraneous.length > 0) {
>>>>>>> origin/heatmap
        d3.select("#analytics").attr("class", "visually-hidden");

        for (let ext of cellStatus.extraneous) {
            for (let node of nodeData) {
                if (node.index == ext && node.index != 0 && node.index != 1) {
                    node.status = 'ext';
                }

            }
            for (let edge of edgeData) {
                if (edge.source.index == ext || edge.target.index == ext) {
                    edge.isExt = true;
                }
            }
        }
        d3.select("#extraneousAlert")
            .attr("class", "alert alert-warning");
    }
    else {
        d3.select("#extraneousAlert")
            .attr("class", "visually-hidden");
    }
    if (!checker) {
        d3.selectAll(".notcell")
            .attr("class", "visually-hidden");

        const [tmpNodeData, tmpEdgeData] = excludeExtraneous(nodeData, edgeData);
        const json = getQuery(tmpNodeData, tmpEdgeData);
        if (json) {
            d3.select("#analytics")
                .attr("class", "alert bg-light alert-secondary");
            d3.select("#trainable_parameters")
                .text(d3.format(",")(json.trainable_parameters));
            d3.select("#training_time")
                .text(json.training_time);
            d3.select("#train_accuracy")
                .text(d3.format(".2%")(json.train_accuracy));
            d3.select("#validation_accuracy")
                .text(d3.format(".2%")(json.validation_accuracy));
            d3.select("#test_accuracy")
                .text(d3.format(".2%")(json.test_accuracy));

            const sharpleyValues = json.sharpley_value;
            const graphMatcher = json.graph_matcher;
<<<<<<< HEAD
            for (const edge of tmpEdgeData){
=======
            console.log(sharpleyValues, graphMatcher, json)
            for (const edge of tmpEdgeData) {
>>>>>>> origin/heatmap
                const source = graphMatcher.indexOf(edge.source.index);
                const target = graphMatcher.indexOf(edge.target.index);
                const key = String(source) + String(target);
                if (sharpleyValues[key] == "") edge.sharpleyValue = null;
                else edge.sharpleyValue = sharpleyValues[key];
            }
        }
        else {
            d3.select("#analytics").attr("class", "visually-hidden");
        }

    }
<<<<<<< HEAD
    console.log(nodeData, edgeData);
=======
    for (let node of nodeData) {
        if (cellStatus.extraneous.indexOf(node.index) == -1) {
            node.status = null;
        }
    }
    for (let edge of edgeData) {
        if (cellStatus.extraneous.indexOf(edge.source.index) == -1 &&
            cellStatus.extraneous.indexOf(edge.target) == -1) {
            edge.isExt = false;
        }
    }

>>>>>>> origin/heatmap
    drawObject();
    
    
   

}



