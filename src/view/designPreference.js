import * as d3 from 'd3';


export const colorScheme = {
    conv11: d3.schemeTableau10[0],
    conv33: d3.schemeTableau10[3],
    pool33: d3.schemeTableau10[5],
    gray: d3.schemeSet1[8],
    positive: d3.interpolateRdYlGn(0.9),
    negative: d3.interpolateRdYlGn(0.1)
}



export function drawButton(svg){
    const rectMargin = 20;
    const rectHeight = 50;
    const appendWidth = (800 - rectMargin * 5) / 4;
    const buttonFontSize = 20;


    const appendconv11 = svg.append("g")
        .attr("transform", "translate(" + [rectMargin, 700 - rectMargin - rectHeight] + ")")
        .attr("id", "conv1x1-bn-relu")
        .attr("class", "append-button conv1x1-bn-relu");

    appendconv11.append("rect")
        .attr("width", appendWidth).attr("height", rectHeight)
        .attr("rx", "5px").attr("ry", "5px")
        .attr("fill", colorScheme.conv11);

    appendconv11.append("text")
        .text("(+) 1×1 CONV")
        .attr("fill", "white")
        .attr("x", appendWidth / 2 ).attr("y", rectHeight / 2)
        .attr("dominant-baseline", "middle").attr("text-anchor", "middle")
        .attr("font-size", buttonFontSize);

    const appendconv33 = svg.append("g")
        .attr("transform", "translate(" + [rectMargin * 2 + appendWidth, 700 - rectMargin - rectHeight] + ")")
        .attr("id", "conv3x3-bn-relu")
        .attr("class", "append-button conv3x3-bn-relu");;

    appendconv33.append("rect")
        .attr("width", appendWidth).attr("height", rectHeight)
        .attr("rx", "5px").attr("ry", "5px")
        .attr("fill", colorScheme.conv33);

    appendconv33.append("text")
        .text("(+) 3×3 CONV")
        .attr("fill", "white")
        .attr("x", appendWidth / 2).attr("y", rectHeight / 2)
        .attr("dominant-baseline", "middle").attr("text-anchor", "middle")
        .attr("font-size", buttonFontSize);

    const appendpool33 = svg.append("g")
        .attr("transform", "translate(" + [rectMargin * 3 + appendWidth*2, 700 - rectMargin - rectHeight] + ")")
        .attr("id", "maxpool3x3")
        .attr("class", "append-button maxpool3x3");;

    appendpool33.append("rect")
        .attr("width", appendWidth).attr("height", rectHeight)
        .attr("rx", "5px").attr("ry", "5px")
        .attr("fill", colorScheme.pool33);

    appendpool33.append("text")
        .text("(+) 3×3 POOL")
        .attr("fill", "white")
        .attr("x", appendWidth / 2).attr("y", rectHeight / 2)
        .attr("dominant-baseline", "middle").attr("text-anchor", "middle")
        .attr("font-size", buttonFontSize);

    const reset = svg.append("g")
        .attr("transform", "translate(" + [rectMargin * 4 + appendWidth * 3, 700 - rectMargin - rectHeight] + ")")
        .attr("id", "init");

    reset.append("rect")
        .attr("width", appendWidth).attr("height", rectHeight)
        .attr("rx", "5px").attr("ry", "5px")
        .attr("fill", colorScheme.gray);

    reset.append("text")
        .text("Reset")
        .attr("fill", "white")
        .attr("x", appendWidth / 2).attr("y", rectHeight / 2)
        .attr("dominant-baseline", "middle").attr("text-anchor", "middle")
        .attr("font-size", buttonFontSize);



    const deleteBox = svg.append("g")
        .attr("transform", "translate("+[rectMargin, 700-rectMargin-rectHeight]+")" )
        .attr("id", "deleteBox").attr("visibility","hidden")
        .attr("width",800-rectMargin*2).attr("height",rectHeight)
        .attr("rx","5").attr("ry","5");

    deleteBox.append("rect")
        .attr("width",800-rectMargin*2).attr("height",rectHeight)
        .attr("rx","5").attr("ry","5")
        .attr("fill", "#dc3545");

    deleteBox.append("text")
        .text("Drag here to delete node")
        .attr("fill", "white")
        .attr("x", 400-rectMargin).attr("y",rectHeight/2)
        .attr("dominant-baseline", "middle").attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("font-size", 24);
}

export function svgInit(svg){
    

    
    const defs = svg.append("defs");



    const filterStart = defs.append("filter")
        .attr("id", "drop-shadow-start")
    filterStart.append("feDropShadow")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("stdDeviation",6)
        .attr("flood-color", "#0d6efd")
        .attr("flood-opacity", 1);

    const marker = defs.append("marker")
        .attr("id", "end")
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("refX", 15)
        .attr("refY", 2)

    marker.append("polygon")
        .attr("points","0 0, 6 2, 0 4")
        .attr("fill","black");
    
    const markerNegative = defs.append("marker")
        .attr("id", "endNegative")
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("refX", 15)
        .attr("refY", 2)

    markerNegative.append("polygon")
        .attr("points","0 0, 6 2, 0 4")
        .attr("fill", d3.interpolateRdYlGn(0.1));

    const markerPositive = defs.append("marker")
        .attr("id", "endPositive")
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("refX", 15)
        .attr("refY", 2)

    markerPositive.append("polygon")
        .attr("points", "0 0, 6 2, 0 4")
        .attr("fill", d3.interpolateRdYlGn(0.9));


    const markerRecommend = defs.append("marker")
        .attr("id", "endRecommend")
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("refX", 15)
        .attr("refY", 2)

    markerRecommend.append("polygon")
        .attr("points","0 0, 6 2, 0 4")
        .attr("fill","gray");
}
