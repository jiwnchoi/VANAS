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
                    fx : 300,
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