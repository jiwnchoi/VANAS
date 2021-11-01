export function drawDeleteBox(svg){
    const rectMargin = 30;
    const rectHeight = 80;
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

    const filterExt = defs.append("filter")
        .attr("id", "drop-shadow-ext")
    filterExt.append("feDropShadow")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("stdDeviation", 6)
        .attr("flood-color", "orange")
        .attr("flood-opacity", 1);

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
        .attr("refX", 18.1)
        .attr("refY", 2)

    marker.append("polygon")
        .attr("points","0 0, 6 2, 0 4")
        .attr("fill","black");
    
    const markerDelete = defs.append("marker")
        .attr("id", "endDelete")
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("refX", 18.1)
        .attr("refY", 2)

    markerDelete.append("polygon")
        .attr("points","0 0, 6 2, 0 4")
        .attr("fill","tomato");

    const markerExt = defs.append("marker")
        .attr("id", "endExt")
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("refX", 18.1)
        .attr("refY", 2)

    markerExt.append("polygon")
        .attr("points","0 0, 6 2, 0 4")
        .attr("fill","orange");

    const markerRecommend = defs.append("marker")
        .attr("id", "endRecommend")
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("refX", 18.1)
        .attr("refY", 2)

    markerRecommend.append("polygon")
        .attr("points","0 0, 6 2, 0 4")
        .attr("fill","gray");
}
