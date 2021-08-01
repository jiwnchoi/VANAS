const nodeData = [{
                    id : 0,
                    type : "input",
                    name : "INPUT",
                    x : 100,
                    y : 250,
                },
                {
                    id : 1,
                    type : "output",
                    name : "OUTPUT",
                    x : 700,
                    y : 250,
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