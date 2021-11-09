const nodeData = [{
                    index : 0,
                    type : "input",
                    name : "INPUT",
                    x : 100,
                    y : 300,
                    fx : 100,
                    fy : 300,
                    status : null,
                },
                {
                    index : 1,
                    type : "output",
                    name : "OUTPUT",
                    x : 700,
                    y : 300,
                    fx : 700,
                    fy : 300,
                    status : null,
                }];

const edgeData = [

]


function getNodeData(){
    return nodeData;
}

function getEdgeData(){
    return edgeData;
}

function initNodeData(){
    nodeData.splice(2);
    return nodeData;
}

function initEdgeData(){
    edgeData.splice(0);
    return edgeData;
}
export {getNodeData, getEdgeData, initNodeData, initEdgeData};