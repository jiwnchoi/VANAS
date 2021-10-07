import { fullDataset } from '..';
import { decodeOperations } from '../data/dataProcessing';
import isIsomorphic from 'graph-isomorphisms';


class Graph {
    constructor(edges, N){

        this.n = N;
        this.adjList = {};
        this.indegree = {};
        this.nodeList = [];
        for (let edge of edges){
            if(this.adjList[edge[0]] == undefined){
                this.adjList[edge[0]] = [];
                this.indegree[edge[0]] = 0;
                this.nodeList.push(edge[0]);
            }
            if (this.adjList[edge[1]] == undefined) {
                this.adjList[edge[1]] = [];
                this.indegree[edge[1]] = 0;
                this.nodeList.push(edge[1]);
            }
            this.adjList[edge[0]].push(edge[1]);
            this.indegree[edge[1]] ++;
        }
    }
}

const codedOperation = {
    'input': 0,
    'output': 1,
    'conv1x1-bn-relu': 2,
    'conv3x3-bn-relu': 3,
    'maxpool3x3': 4
}

function arrayDiff(a1, a2){
    for (let idx in a1){
        if (a1[idx] != a2[idx]) return false;
    }
    return true;
}

function getAllTopologicalOrder(graph, path, discoverd, result){

    for (let v of graph.nodeList){
        if (graph.indegree[v] == 0 && !discoverd[v]){
            for (let u of graph.adjList[v]){
                graph.indegree[u] --;
            }
            path.push(v);
            discoverd[v] = true;

            getAllTopologicalOrder(graph, path, discoverd, result);

            for (let u of graph.adjList[v]){
                graph.indegree[u] ++;
            }
            path.pop();
            discoverd[v] = false;
        }
    }
    if(path.length == graph.n) result.push(path.slice());

}

function isIsomorphicGraph(edges, dataEdges, nodeData, edgeData, ops){
    
    const isomorphismCheck = isIsomorphic(edges, dataEdges);
    const decodedOperations = decodeOperations(ops);
    if (isomorphismCheck.length == 0) return false;
    




    const graph = new Graph(edges, nodeData.length);
    const discoverd = {};
    for (let node of nodeData){
        discoverd[node.index] = false;
    }
    const path = [];
    const topoList = [];
    getAllTopologicalOrder(graph, path, discoverd, topoList);
    for (let topoSeq of topoList){
        const topoOperations = [];
        topoOperations.length = decodedOperations.length;
        for(let node of nodeData){
            topoOperations[topoSeq.indexOf(node.index)] = node.type;
        }
        if (arrayDiff(topoOperations, decodedOperations)) {
            return true;
        }
    }
    return false;



}



export default function getQuery(nodeData, edgeData){

    const key = nodeData.map(node => String(node.indegree) + String(node.outdegree) + String(codedOperation[node.type])).sort()
    const keySting = key.join("");
    const edges = edgeData.map(edge => [edge.source.index, edge.target.index]);
    let query = [];
    const dataset = fullDataset[keySting];


    for (let data of dataset){
        const dataEdges = [];
        for (let i=0; i<data[0].length; i+=2){
            dataEdges.push([Number(data[0][i]), Number(data[0][i+1])]);
        }

        if (isIsomorphicGraph(edges, dataEdges, nodeData, edgeData, data[1])) {
            
            query.push({
                dataEdges,
                ops: data[1],
                trainable_parameters : data[3],
                training_time : data[2],
                train_accuracy : data[4],
                validation_accuracy : data[5],
                test_accuracy : data[6],
            })
        }
    }
    if(query.length > 1) console.log(query);
    return query[0];
}



