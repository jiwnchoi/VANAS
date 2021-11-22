
import * as d3 from 'd3';

export default async function getEdgeSignificance(){
    const data = await d3.json('./nasbench101_edgesignificance.json', {
        method : "GET",
    });

    return data;
}