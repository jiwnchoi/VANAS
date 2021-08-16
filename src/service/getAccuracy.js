import * as d3 from "d3";

export async function getAccuracy(matrixandops){
    const data = await d3.json('http://192.168.0.54:5000/querying', {
        method : "POST",
        body : JSON.stringify({
            ops : matrixandops[1],
            matrix : matrixandops[0],
        }),
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    return data;
}
