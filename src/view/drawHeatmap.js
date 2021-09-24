import * as d3 from "d3";
import { legendColor } from "d3-svg-legend"
import { setCell } from "../controller/cellController";

const accuracyLegendMargin = 70;
const margin = { top: 30, right: 30, bottom: 30 + accuracyLegendMargin, left: 60 },
    width = 600,
    height = 400;

const dataset = ["module_operations", "module_adjacency", "training_time", "trainable_parameters", "train_accuracy", "validation_accuracy", "test_accuracy"];

let drawHeatmap = function () {
    let splitX = 100,
        splitY = 100,
        x = "x",
        y = "y",
        z = "z";

    function heatmap(data) {
        let funcX = d => d[dataset.indexOf(x)],
            funcY = d => d[dataset.indexOf(y)],
            funcZ = d => d[dataset.indexOf(z)];

        const graph = d3.create("svg")
            .attr("viewBox", [0, 0, width, height]);

        let xExtent = [0, d3.max(data, funcX)],
            yExtent = [0, d3.max(data, funcY)];

        let xScale = d3.scaleLinear()
            .domain(xExtent)
            .range([margin.left, width - margin.right])
            .nice();

        xExtent = xScale.domain();

        let yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([height - margin.bottom, margin.top])
            .nice();

        yExtent = yScale.domain();

        let dx = xExtent[1] / splitX,
            dy = yExtent[1] / splitY;

        let xAxis = g => g
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .call(g => g
                .append("text")
                .attr("text-anchor", "end")
                .attr("x", width - margin.right)
                .attr("y", margin.bottom - 5 - accuracyLegendMargin)
                .attr("fill", "currentColor")
                .text(x));

        let yAxis = g => g
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale))
            .call(g => g
                .append("text")
                .attr("text-anchor", "start")
                .attr("x", -margin.left)
                .attr("y", margin.top - 10)
                .attr("fill", "currentColor")
                .text(y));

        // generate rectbin
        let binsById = {};
        let xRange = d3.range(xExtent[0], xExtent[1] + dx, dx),
            yRange = d3.range(yExtent[0], yExtent[1] + dy, dy);

        yRange.forEach(Y => {
            xRange.forEach(X => {
                let pi = Math.floor(X / dx);
                let pj = Math.floor(Y / dy);

                let bin = [];
                bin.i = pi;
                bin.j = pj;
                bin.x = pi * dx;
                bin.y = pj * dy;
                bin.zMax = 0;

                let id = pi + '-' + pj;
                binsById[id] = bin;
            });
        });

        //push each points to the bins
        data.forEach(point => {
            let pi = Math.floor(funcX(point) / dx);
            let pj = Math.floor(funcY(point) / dy);
            let zCur = funcZ(point);

            let id = pi + '-' + pj;
            binsById[id].push(point);
            if (zCur > binsById[id].zMax) {
                binsById[id].zMax = zCur;
                binsById[id].module_operations = point[0];//module_operations
                binsById[id].module_adjacency = point[1];//module_adjacency
            }
        });

        let rectbinData = Object.values(binsById);

        let zExtent = d3.extent(rectbinData.map(d => d.zMax).filter(d => d !== 0));
        let colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain(zExtent);

        // size of squares
        let widthInPx = xScale(xExtent[0] + dx) - margin.left,
            heightInPx = yScale(yExtent[1] - dy) - margin.top;

        // create a tooltip
        const tooltip = d3.create("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "fixed")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("font-size", "10px");

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function (event, d) {
            tooltip.style("opacity", 1);
        };
        const mousemove = function (event, d) {
            tooltip
                .html("accuracy: " + d.zMax)
                .style("top", (event.y) + "px")
                .style("left", (event.x + 10) + "px");
        };
        const mouseleave = function (event, d) {
            tooltip.style("opacity", 0);
        };
        const click = function (event, d) {
            console.log(d.module_adjacency);
            setCell(d.module_operations, d.module_adjacency);
        }

        graph.append("g")
            .call(xAxis);

        graph.append("g")
            .call(yAxis);

        graph.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        graph.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width - margin.right)
            .attr("height", height - margin.bottom);

        graph.append("g")
            .attr("clip-path", "url(#clip)")
            .selectAll()
            .data(rectbinData)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y))
            .attr("width", widthInPx)
            .attr("height", heightInPx)
            .attr("fill", d => { return d.length === 0 ? "transparent" : colorScale(d.zMax) }) //make visible only when there is an element
            .attr("stroke", "grey")
            .attr("stroke-width", "0.2")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", click);


        // accuracy color legend
        let legendWidth = 300, legendCells = 10;
        graph.append("g")
            .attr("class", "accuracyLegend")
            .attr("transform", `translate(${width / 2 - legendWidth / 2},${height - margin.bottom + accuracyLegendMargin})`);

        let accuracyLegend = legendColor()
            .title("Accuracy")
            .shapeWidth(legendWidth / legendCells)
            .shapePadding(legendWidth / legendCells)
            .labelFormat(d3.format(".3f"))
            .labels(function ({
                i,
                genLength,
                generatedLabels,
                labelDelimiter
            }) {
                return (Math.round(generatedLabels[i] * 1000) / 10 + '%');
            })
            .cells(legendCells)
            .orient("horizontal")
            .scale(colorScale);

        graph.select(".accuracyLegend")
            .call(accuracyLegend)
        graph.select(".accuracyLegend")
            .select(".legendTitle")
            .style("font-size", "15px")
            .style("text-anchor", "middle")
            .attr("transform", `translate(${legendWidth / 2},-10)`);
        graph.select(".accuracyLegend")
            .select(".legendCells")
            .style("font-size", "10px")
            .selectAll(".cell")
            .select(".label")
            .style("text-anchor", "middle")
            .attr("transform", `translate(${legendWidth / legendCells / 2},25)`);;

        return { graph: graph.node(), tooltip: tooltip.node() };
    };

    heatmap.splitX = function (_) {
        if (!arguments.length) return splitX;
        splitX = _;
        return heatmap;
    };

    heatmap.splitY = function (_) {
        if (!arguments.length) return splitY;
        splitY = _;
        return heatmap;
    };

    heatmap.x = function (_) {
        if (!arguments.length) return x;
        x = _;
        return heatmap;
    };

    heatmap.y = function (_) {
        if (!arguments.length) return y;
        y = _;
        return heatmap;
    };

    heatmap.z = function (_) {
        if (!arguments.length) return z;
        z = _;
        return heatmap;
    };

    return heatmap;
};

export { drawHeatmap };