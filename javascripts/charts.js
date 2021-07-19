import { getTooltipText, prepareDataLinear } from "./utils.js";
import { prepareDataBarplot } from "./utils.js";

class Chart {
    constructor(margin, width, height) {
        this.margin = margin;
        this.width = width;
        this.height = height;
    }

    getSvg() {
        return d3.select(".output")
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    makeTooltip() {
        return d3.select(".output")
        .append("div")
        .style("display", "none")
        .attr("class", "tooltip");
    }
}

export class LinearChart extends Chart{

    draw() {
        let svg = this.getSvg();
        let width = this.width;
        let height = this.height;
        let margin = this.margin;
        let Tooltip = this.makeTooltip();

        d3.json("performance.json", function(data) {

            let { students, dataReady } = prepareDataLinear(data);
            // Палитра
            let myColor = (name) => {
                let colors = ["#8dd3c7", "#80b1d3", "#bebada", "#fb8072"];
                return colors[students.indexOf(name)]
            }

            // Ось X
            let x = d3.scaleLinear()
                .domain( [0, 21] )
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            svg.append("text")
                .text("Номер занятия")
                .attr("x", width - 40)
                .attr("y", height + 40)

            // Ось Y
            let y = d3.scaleLinear()
                .domain( [40, 100])
                .range([ height, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(y));

            svg.append("text")
                .text("Оценка")
                .attr("x", -margin.left)
                .attr("y", 10)

            // Линии
            let line = d3.line()
                .x((d) => x(d.lessonNum) )
                .y((d) => y(d.grade) )
            svg.selectAll("myLines")
                .data(dataReady)
                .enter()
                .append("path")
                .attr("d", (d) => line(d.values) )
                .attr("stroke", (d) => myColor(d.name) )
                .style("stroke-width", 4)
                .style("fill", "none")

            let mouseleave = function () {
                Tooltip
                    .style("display", "none")
            }
            let mouseover = function () {
                Tooltip
                    .style("display", "block")
            }
            let mousemove = function (d) {
                Tooltip
                    .html(getTooltipText(d))
                    .style("left", (d3.mouse(this)[0] + 70) + "px")
                    .style("top", (d3.mouse(this)[1] + 30) + "px")
            }

            // Точки
            svg
                .selectAll("myDots")
                .data(dataReady)
                .enter()
                .append('g')
                .style("fill", (d) => myColor(d.name) )
                .selectAll("myPoints")
                .data((d) =>  d.values )
                .enter()
                .append("circle")
                .attr("cx", (d) => x(d.lessonNum) )
                .attr("cy", (d) => y(d.grade) )
                .attr("r", 5)
                .attr("stroke", "white")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)

            // console.log(dataReady)

            if (dataReady[0].values.length === 0) return 0;

            // Легенда
            svg
                .selectAll("myLabels")
                .data(dataReady)
                .enter()
                .append('g')
                .append("text")
                .datum((d) => { return {name: d.name, value: d.values[d.values.length - 1]}; })
                .attr("transform", (d) => {return "translate(" + x(d.value.lessonNum) + "," + y(d.value.grade) + ")"; })
                .attr("x", 12) // Смещение надписи
                .text((d) => d.name )
                .style("fill", (d) => myColor(d.name) )
                .style("font-size", 15)
        });
    }

}


export class BarplotChart extends Chart {
    prepareData(data) {
        return prepareDataBarplot(data);
    }

    draw() {
        let svg = this.getSvg();
        let width = this.width;
        let height = this.height;
        let prepareData = this.prepareData;
        let Tooltip = this.makeTooltip();


        d3.json("performance.json", function(data) {

            // subgroups - Студенты
            // groups - номера занятий

            let {groups, subgroups, preparedData} = prepareData(data);
            // Ось X до 21
            groups.push(21);

            // Палитра
            let myColor = (name) => {
                let colors = ["#8dd3c7", "#80b1d3", "#bebada", "#fb8072"];
                return colors[subgroups.indexOf(name)]
            }

            // Ось X
            let x = d3.scaleBand()
                .domain(groups)
                .range([0, width])
                .padding([0.2])
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSizeOuter(0));

            // Ось Y
            let y = d3.scaleLinear()
                .domain([0, 400])
                .range([ height, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(y));

            let stackedData = d3.stack()
                .keys(subgroups)
                (preparedData)

            // DEBUG

            // console.log("subgroups:")
            // console.log(subgroups)
            // console.log("groups:")
            // console.log(groups)
            // console.log("data:")
            // console.log(preparedData)
            // console.log("stackedData:")
            // console.log(stackedData)

            let mouseleave = function () {
                Tooltip
                    .style("display", "none")
            }
            let mousemove = function (d) {

                let student = d3.select(this.parentNode).datum().key;
                let grade = d.data[student];
                let lessonNum = d.data.group;

                let tooltipData = data.filter(item =>
                    lessonNum === item.lessonNum && student === item.lastName
                    && grade === item.grade);

                let left = (d3.mouse(this)[0] + 70) + "px";
                let top = (d3.mouse(this)[1] + 30) + "px";

                Tooltip
                    .html(getTooltipText(tooltipData[0]))
                    .style("left", left)
                    .style("top", top)
            }
            let mouseover = function () {
                Tooltip
                    .style("display", "block")
            }

            // Диаграмма
            svg.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter().append("g")
                .attr("fill", (d) => myColor(d.key) )
                .selectAll("rect")
                .data((d) => d )
                .enter().append("rect")
                .attr("x", (d) => x(d.data.group) )
                .attr("y", (d) => y(d[1]) )
                .attr("height", (d) => y(d[0]) - y(d[1]) )
                .attr("width",x.bandwidth())
                .attr("stroke", "grey")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
        });
    }
}