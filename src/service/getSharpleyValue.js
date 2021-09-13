import * as d3 from "d3";

export async function getSharpleyValue(){

    const data = await d3.json('http://192.168.0.111:5000/overview/edge-sharpley-value', {
        method : "GET",
    });

    return data;
}
