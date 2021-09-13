import * as d3 from "d3";

export async function getRecommendation(edgeData, nodeData){

    const data = await d3.json('http://192.168.0.111:5000/recommendation', {
        method : "POST",
        body : JSON.stringify({
            node_data : nodeData,
            edge_data : edgeData,
        }),
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    return data;
}
