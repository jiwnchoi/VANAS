//http://192.168.0.54:5000/querying
//https://8d11125fda1a.ngrok.io/querying
import * as d3 from "d3";
import { getNodeData } from "../data/data";

export function getAccuracy(matrix){
    const nodeData = getNodeData();
    const ops = nodeData.map(x => x.type);

    d3.json('http://192.168.0.54:5000/querying', {
        method : "POST",
        body : JSON.stringify({
            ops : ops,
            matrix : matrix,
        }),
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(json => {
        d3.select("#analytics")
            .attr("class", "alert bg-light alert-secondary")
        d3.select("#trainable_parameters")
            .text(json.trainable_parameters)
        d3.select("#training_time")
            .text(json.training_time)
        d3.select("#train_accuracy")
            .text(json.train_accuracy)
        d3.select("#validation_accuracy")
            .text(json.validation_accuracy)
        d3.select("#test_accuracy")
            .text(json.test_accuracy)
    })
}
