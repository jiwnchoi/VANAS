const nodeData = [{
                    id : 0,
                    type : "input",
                    name : "INPUT",
                    x : 100,
                    y : 300,
                    status : null,
                },
                {
                    id : 1,
                    type : "output",
                    name : "OUTPUT",
                    x : 700,
                    y : 300,
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

export {getNodeData, getEdgeData};