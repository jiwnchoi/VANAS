const recommendNodeData ={
    1 : [{
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
            }
        ],
    2 : [{
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
            }
        ],
    3: [{
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
            }
        ],
    4: [{
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
            }
        ],
    5 : [{
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
            }
        ],
}

const recommendEdgeData ={
    1 :[],
    2 : [],
    3 : [],
    4 : [],
    5 : []
}



function getRecommendNodeData(id){
    return recommendNodeData[id];
}

function getRecommendEdgeData(id){
    return recommendEdgeData[id];
}

export {getRecommendNodeData, getRecommendEdgeData};