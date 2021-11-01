const recommendNodeData = {
    1: [{
        index: 0,
        type: "input",
        name: "INPUT",
        x: 100,
        y: 300,
        fx: 100,
        fy: 300,
        status: null,
    },
    {
        index: 1,
        type: "output",
        name: "OUTPUT",
        x: 700,
        y: 300,
        fx: 700,
        fy: 300,
        status: null,
    }
    ],
    2: [{
        index: 0,
        type: "input",
        name: "INPUT",
        x: 100,
        y: 300,
        fx: 100,
        fy: 300,
        status: null,
    },
    {
        index: 1,
        type: "output",
        name: "OUTPUT",
        x: 700,
        y: 300,
        fx: 700,
        fy: 300,
        status: null,
    }
    ],
    3: [{
        index: 0,
        type: "input",
        name: "INPUT",
        x: 100,
        y: 300,
        fx: 100,
        fy: 300,
        status: null,
    },
    {
        index: 1,
        type: "output",
        name: "OUTPUT",
        x: 700,
        y: 300,
        fx: 700,
        fy: 300,
        status: null,
    }
    ],
    4: [{
        index: 0,
        type: "input",
        name: "INPUT",
        x: 100,
        y: 300,
        fx: 100,
        fy: 300,
        status: null,
    },
    {
        index: 1,
        type: "output",
        name: "OUTPUT",
        x: 700,
        y: 300,
        fx: 700,
        fy: 300,
        status: null,
    }
    ],
    5: [{
        index: 0,
        type: "input",
        name: "INPUT",
        x: 100,
        y: 300,
        fx: 100,
        fy: 300,
        status: null,
    },
    {
        index: 1,
        type: "output",
        name: "OUTPUT",
        x: 700,
        y: 300,
        fx: 700,
        fy: 300,
        status: null,
    }
    ],
    6: [{
        index: 0,
        type: "input",
        name: "INPUT",
        x: 100,
        y: 300,
        fx: 100,
        fy: 300,
        status: null,
    },
    {
        index: 1,
        type: "output",
        name: "OUTPUT",
        x: 700,
        y: 300,
        fx: 700,
        fy: 300,
        status: null,
    }
    ],
    7: [{
        index: 0,
        type: "input",
        name: "INPUT",
        x: 100,
        y: 300,
        fx: 100,
        fy: 300,
        status: null,
    },
    {
        index: 1,
        type: "output",
        name: "OUTPUT",
        x: 700,
        y: 300,
        fx: 700,
        fy: 300,
        status: null,
    }
    ],
    8: [{
        index: 0,
        type: "input",
        name: "INPUT",
        x: 100,
        y: 300,
        fx: 100,
        fy: 300,
        status: null,
    },
    {
        index: 1,
        type: "output",
        name: "OUTPUT",
        x: 700,
        y: 300,
        fx: 700,
        fy: 300,
        status: null,
    }
    ],
    9: [{
        index: 0,
        type: "input",
        name: "INPUT",
        x: 100,
        y: 300,
        fx: 100,
        fy: 300,
        status: null,
    },
    {
        index: 1,
        type: "output",
        name: "OUTPUT",
        x: 700,
        y: 300,
        fx: 700,
        fy: 300,
        status: null,
    }
    ],
    10: [{
        index: 0,
        type: "input",
        name: "INPUT",
        x: 100,
        y: 300,
        fx: 100,
        fy: 300,
        status: null,
    },
    {
        index: 1,
        type: "output",
        name: "OUTPUT",
        x: 700,
        y: 300,
        fx: 700,
        fy: 300,
        status: null,
    }
    ]
}

const recommendEdgeData = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],

    6: [],
    7: [],
    8: [],
    9: [],
    10: []
}



function getRecommendNodeData(index) {
    return recommendNodeData[index];
}

function getRecommendEdgeData(index) {
    return recommendEdgeData[index];
}

export { getRecommendNodeData, getRecommendEdgeData };