import * as d3 from "d3";
import { getEdgeData, getNodeData } from "../data/data";
import { cellSainityCheck } from "../data/dataProcessing";
import getQuery from "../service/getQuery";
import drawObject from "./drawObject";


export default async function printResult(){
    d3.select("#analytics").attr("class", "visually-hidden");
    d3.select("#initAlert").attr("class","visually-hidden");


    const nodeData = getNodeData();
    const edgeData = getEdgeData();
    const cellStatus = cellSainityCheck();
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

    if(cellStatus.extraneous.length > 0){
        d3.select("#analytics").attr("class", "visually-hidden");

        for (let ext of cellStatus.extraneous){
            for (let node of nodeData){
                if(node.index == ext && node.index != 0 && node.index != 1){
                    node.status = 'ext';
                } 
                
            }
            for (let edge of edgeData){
                if(edge.source.index == ext || edge.target.index == ext){
                    edge.isExt = true;
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

        const tmpNodeData = nodeData.slice();
        const tmpEdgeData = edgeData.slice();
        for (let i=0; i<tmpNodeData.length; i++){
            if (cellStatus.extraneous.indexOf(tmpNodeData[i].index) != -1){
                tmpNodeData.splice(i,1);
                i--;
            }
        }
        for (let i=0; i<tmpEdgeData.length; i++){
            if (cellStatus.extraneous.indexOf(tmpEdgeData[i].source.index) != -1){
                tmpEdgeData.splice(i,1);
                i--;
            }
            if (cellStatus.extraneous.indexOf(tmpEdgeData[i].target.index) != -1){
                tmpEdgeData.splice(i,1);
                i--;
            }
        }
        const json = getQuery(tmpNodeData, tmpEdgeData);
        if (json){
            
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
        else{
            d3.select("#analytics").attr("class", "visually-hidden");
        }
        
    }
    for (let node of nodeData){
        if(cellStatus.extraneous.indexOf(node.index) == -1){
            node.status = null;
        }
    }
    for (let edge of edgeData){
        if (cellStatus.extraneous.indexOf(edge.source.index) == -1 &&
        cellStatus.extraneous.indexOf(edge.target) == -1){
            edge.isExt = false;
        }
    }
    
    drawObject();

}



