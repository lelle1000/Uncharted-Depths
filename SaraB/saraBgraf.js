

// let disciplineAlternatives = ["Maze", "Hunt", "HidenSeek", "Fighting", "Race"];



// let seasonSelect = document.getElementById("seasonSelect");
// let eventSelect = document.getElementById("eventSelect");



// for (let i = 1; i <= 10; i++) {
//     let opt = document.createElement("option");
//     opt.value = i;
//     opt.textContent = `Season ${i}`;
//     seasonSelect.appendChild(opt);
// }


// let sortedDisciplines = [...disciplines].sort((a, b) => a.id - b.id);

// sortedDisciplines.forEach(d => {
//     let opt = document.createElement("option");
//     opt.value = d.id;

//     // MAP ID → NAME
//     opt.textContent = disciplineAlternatives[d.id - 1];

//     eventSelect.appendChild(opt);
// });


// let deafultSeason = 1;
// let defaultDiscipline = sortedDisciplines[0].id;


// seasonSelect.addEventListener("change", e => {
//     deafultSeason = +e.target.value;
//     updateCoachPerformanceChart();
// });

// eventSelect.addEventListener("change", e => {
//     defaultDiscipline = +e.target.value;
//     updateCoachPerformanceChart();
// });



// let coachColors = {};
// coaches.forEach(c => {
//     coachColors[c.id] = `hsl(${c.id * 32}, 70%, 60%)`;
// });



// const maxPoints = 2300;

// let width = 1400;
// let height = 400;
// let margin = { top: 40, right: 100, bottom: 80, left: 250 };

// let svg = d3.select("#chart")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);

// let gBars = svg.append("g");
// let gLabels = svg.append("g");
// let gXAxis = svg.append("g");
// let gYAxis = svg.append("g");

// // FIX Y SCALE (11 coaches)
// let y = d3.scaleBand()
//     .domain(coaches.map(c => c.id).sort((a, b) => a - b))
//     .range([margin.top, height - margin.bottom])
//     .padding(0.8);

// gYAxis.attr("transform", `translate(${margin.left}, 0)`);



// function updateCoachPerformanceChart() {

//     let season = seasons[deafultSeason - 1];
//     let placementPoints = [15, 10, 6, 3, 1];

//     let coachPoints = coaches.map(c => ({
//         coachId: c.id,
//         totalPoints: 0
//     }));

//     for (let compDay of season.competitionDays) {
//         for (let event of compDay.events) {

//             if (event.disciplineId !== defaultDiscipline) continue;

//             let sorted = [...event.scores]
//                 .sort((a, b) => b.score - a.score);

//             sorted.slice(0, 5).forEach((p, index) => {

//                 let points = placementPoints[index];

//                 let seasonCoach = season.coaches.find(
//                     c => c.participantId == p.participantId
//                 );

//                 let coach = coaches.find(
//                     c => c.id == seasonCoach.coachId
//                 );

//                 if (!coach) return;

//                 let target = coachPoints.find(
//                     c => c.coachId === coach.id
//                 );

//                 target.totalPoints += points;
//             });
//         }
//     }

//     drawChart(coachPoints);
// }


// function drawChart(coachData) {

//     let x = d3.scaleLinear()
//         .domain([0, maxPoints])
//         .range([margin.left, width - margin.right]);

//     // AXES
//     gXAxis
//         .transition()
//         .duration(800)
//         .attr("font-size", "14px")
//         .attr("stroke", "#C2AD89")
//         .attr("transform", `translate(0, ${height - margin.bottom})`)
//         .call(d3.axisBottom(x).ticks(6));

//         gXAxis.select(".domain")
//         .attr("stroke", "#C2AD89");
    
//         gXAxis.selectAll(".tick line")
//             .attr("stroke", "#C2AD89");
    
//         gXAxis.selectAll(".tick text")
//             .attr("fill", "#C2AD89");

//     gYAxis
//         .transition()
//         .duration(800)
//         .attr("font-size", "14px")
//         .attr("stroke", "#C2AD89")
//         .call(d3.axisLeft(y).tickFormat(id => `Coach ${id}`));

//     gYAxis
//         .call(d3.axisLeft(y));

//     gYAxis.select(".domain")
//         .attr("stroke", "#C2AD89");

//     gYAxis.selectAll(".tick line")
//         .attr("stroke", "#C2AD89");

//     gYAxis.selectAll(".tick text")
//         .attr("fill", "#C2AD89");
 

//     svg.append("text")
//         .attr("x", 800)
//         .attr("y", height - 10)
//         .attr("text-anchor", "middle")
//         .attr("font-size", "16px")
//         .attr("fill", "#C2AD89")
//         .text("Total Points");


//     svg.append("text")
//         .attr("x", 210)
//         .attr("y", 17)
//         .attr("fill", "#C2AD89")
//         .attr("font-size", "16pxpx")
//         .text("Coaches");

//         // BARS
//     let barUpdate = gBars
//         .selectAll("rect")
//         .data(coachData, d => d.coachId);

//     let barEnter = barUpdate.enter()
//         .append("rect")
//         .attr("x", x(0))
//         .attr("y", d => y(d.coachId))
//         .attr("height", y.bandwidth())
//         .attr("fill", d => coachColors[d.coachId])
//         .style("filter", d => `drop-shadow(0px 0px 4px ${coachColors[d.coachId]})`);
        

//     barUpdate.exit().remove();

//     let barMerge = barUpdate.merge(barEnter);

//     barMerge
//         .transition()
//         .duration(800)
//         .attr("x", x(0))
//         .attr("y", d => y(d.coachId))
//         .attr("width", d => x(d.totalPoints) - x(0))
//         .attr("height", y.bandwidth())
        

//     // LABELS
//     let textUpdate = gLabels
//         .selectAll("text")
//         .data(coachData, d => d.coachId);

//     let textEnter = textUpdate.enter()
//         .append("text")
//         .attr("alignment-baseline", "middle")
//         .attr("fill", "#C2AD89")
//         .attr("font-size", "12px")
//         .attr("x", x(0) + 10)
//         .attr("y", d => y(d.coachId) + y.bandwidth() / 2 );

//     textUpdate.exit().remove();

//     let textMerge = textUpdate.merge(textEnter);

//     textMerge
//         .transition()
//         .duration(800)
//         .attr("x", d => x(d.totalPoints) + 10)
//         .attr("y", d => y(d.coachId) + y.bandwidth() / 2)
//         .text(d => d.totalPoints);
// }


// updateCoachPerformanceChart();