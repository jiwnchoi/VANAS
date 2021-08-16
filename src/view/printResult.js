import * as d3 from "d3";
import { getEdgeData, getNodeData } from "../data/data";
import { cellSainityCheck, createMatrix } from "../data/dataProcessing";
import { getAccuracy } from "../service/getAccuracy";
import drawObject from "./drawObject";


export function printResult(){
    const nodeData = getNodeData();

    d3.select("#initAlert").attr("class","visually-hidden");
    const cellStatus = cellSainityCheck();
    console.log(cellStatus);
    let checker = 0;
    
    if(cellStatus.numEdges > 9){
        d3.select("#analytics").attr("class", "visually-hidden");
        d3.select("#edgeNumberAlert")
            .attr("class", "notcell alert alert-danger");
        checker++;
    }
    if(!cellStatus.isConnected){
        d3.select("#analytics").attr("class", "visually-hidden");
        d3.select("#connectAlert")
            .attr("class", "notcell alert alert-warning");
        checker++;
    }
    if(!cellStatus.isAcyclic){
        d3.select("#analytics").attr("class", "visually-hidden");
        d3.select("#cycleAlert")
            .attr("class", "notcell alert alert-danger");
        checker++;
    }
    
    // d3.selectAll(".node").select("circle").style("filter", "url(#drop-shadow)");

    if(cellStatus.extraneous.length > 0){
        d3.select("#analytics").attr("class", "visually-hidden");

        for (let ext of cellStatus.extraneous){
            
            if(ext ==0 || ext ==1){
                continue;
            }

            for (let node of nodeData){
                if(node.id == ext) node.status = 'ext';
                if(node.status == 'ext' && cellStatus.extraneous.indexOf(node.id) == -1){
                    node.status = null;
                }
            }
        }
        d3.select("#extraneousAlert")
            .attr("class", "alert alert-warning");
    }
    else{
        d3.select("#extraneousAlert")
            .attr("class", "visually-hidden");
    }
    if(!checker){
        d3.selectAll(".notcell")
            .attr("class", "visually-hidden");

        const data = getAccuracy(createMatrix(cellStatus.extraneous, nodeData, getEdgeData()));
        data.then(json => {
                d3.select("#analytics")
                    .attr("class", "alert bg-light alert-secondary");
                d3.select("#trainable_parameters")
                    .text(json.trainable_parameters);
                d3.select("#training_time")
                    .text(json.training_time);
                d3.select("#train_accuracy")
                    .text(json.train_accuracy);
                d3.select("#validation_accuracy")
                    .text(json.validation_accuracy);
                d3.select("#test_accuracy")
                    .text(json.test_accuracy);
            }  
        )
    }
    drawObject();
}

