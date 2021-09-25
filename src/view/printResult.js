import * as d3 from "d3";
import { setCell } from "../controller/cellController";
import { getEdgeData, getNodeData, initEdgeData, initNodeData } from "../data/data";
import { cellSainityCheck } from "../data/dataProcessing";
import { getRecommendEdgeData, getRecommendNodeData } from "../data/recommendCellData";
import getQuery from "../service/getQuery";
import drawObject, { drawObjectwithForce } from "./drawObject";


export async function printResult(){

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
        const json = getQuery(tmpNodeData, tmpEdgeData).query;
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
    cellRecommendation();

}

function querying(){
    return new Promise((resolve, reject) => {
        
    })
}


function copyCelltoMain(i){
    const recommendNodeData = getRecommendNodeData(i+1);
    const recommendEdgeData = getRecommendEdgeData(i+1);
    const emptyEdgeData = initEdgeData();
    const emptyNodeData = initNodeData();
    emptyNodeData.splice(0);

    for (let node of recommendNodeData){
        emptyNodeData.push(node);
    }
    for (let edge of recommendEdgeData){
        emptyEdgeData.push(edge);
    }
    printResult();
}

export function cellRecommendation(){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();

    const data2 = getQuery(nodeData, edgeData);
    const data = data2.recommend;
    console.log(data);
    const recommendCell = d3.select("#recommend-col").selectAll(".recommend-cell").data(data)

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
        .attr("id", (_, i) => "recommend" + (i+1))
        .attr("viewBox", "0 0 800 600")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("class", "svg-content-responsive recommend-cell-svg")
        ;
    
    recommendCellEnter
        .append('div')
        .attr('id', 'recommend-accuracy')
        .attr("class", "row g-0 d-flex justify-content-center align-middle mb-1")
        .text((d) => "Accuracy : " + Math.round(d[0] * 10000) / 10000);


        

    recommendCell
        .exit()
        .remove()

    for (let i=0; i<data.length; i++){
        setCell(data[i][1], data[i][2], i+1);
        drawObjectwithForce(null, i+1)
    }



}
