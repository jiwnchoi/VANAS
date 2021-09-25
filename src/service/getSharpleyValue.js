
import * as d3 from 'd3';

export default async function getSharpleyValue(){
    const data = await d3.json('/sharpley_value.json', {
        method : "GET",
    });

    return data;
}