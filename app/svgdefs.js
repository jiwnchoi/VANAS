export function makeSVGDefs(svg){
    const defs = svg.append("defs");
    const filter = defs.append("filter")
        .attr("id", "drop-shadow")
    filter.append("feDropShadow")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("stdDeviation",4)
        .attr("flood-color", "black")
        .attr("flood-opacity", "0.5");

    const filterStart = defs.append("filter")
        .attr("id", "drop-shadow-start")
    filterStart.append("feDropShadow")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("stdDeviation",4)
        .attr("flood-color", "#0D6EFD")
        .attr("flood-opacity", "0.5");

    const marker = defs.append("marker")
        .attr("id", "end")
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("refX", 18.1)
        .attr("refY", 2)

    marker.append("polygon")
        .attr("points","0 0, 6 2, 0 4")
        .attr("fill","gray");
    
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
}
