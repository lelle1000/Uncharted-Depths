let disciplineAlternatives = ["Maze", "Hunt", "HidenSeek", "Fighting", "Race"];
let comparePageButton = document.getElementById("comparePageButton")
let landingPageContainer = document.getElementById("landingPageContainer")
let comparePage = document.getElementById("comparePage")
let coachesImpactButton = document.getElementById("coachesImpactButton")
let coachGraphPage = document.getElementById("coachGraphPage")

comparePageButton.addEventListener("click", e => {
    landingPageContainer.classList.add("hide")
    comparePage.classList.remove("hide")
    
})

coachesImpactButton.addEventListener("click", e => {
    landingPageContainer.classList.add("hide")
    coachGraphPage.classList.remove("hide")
    
})




let seasonSelect = document.getElementById("seasonSelect");
seasonSelect.classList.add("selectC")
let eventSelect = document.getElementById("eventSelect");
eventSelect.classList.add("selectC")

comparePageButton.addEventListener("click", e => {
    landingPageContainer.classList.add("hide")
    comparePage.classList.remove("hide")
    CreateChartSvg();

})





for (let i = 1; i <= 10; i++) {
    let opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Season ${i}`;
    seasonSelect.appendChild(opt);
}


let sortedDisciplines = [...disciplines].sort((a, b) => a.id - b.id);

sortedDisciplines.forEach(d => {
    let opt = document.createElement("option");
    opt.value = d.id;

    // MAP ID → NAME
    opt.textContent = disciplineAlternatives[d.id - 1];

    eventSelect.appendChild(opt);
});


let deafultSeason = 1;
let defaultDiscipline = sortedDisciplines[0].id;


seasonSelect.addEventListener("change", e => {
    deafultSeason = +e.target.value;
    updateCoachPerformanceChart();
});

eventSelect.addEventListener("change", e => {
    defaultDiscipline = +e.target.value;
    updateCoachPerformanceChart();
});



let coachColors = {};
coaches.forEach(c => {
    coachColors[c.id] = `hsl(${c.id * 32}, 70%, 60%)`;
});



const maxPoints = 2300;

let width = 1400;
let height = 400;
let marginC = { top: 40, right: 100, bottom: 80, left: 250 };

let svgC = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let gBars = svgC.append("g");
let gLabels = svgC.append("g");
let gXAxis = svgC.append("g");
let gYAxis = svgC.append("g");

// FIX Y SCALE (11 coaches)
let y = d3.scaleBand()
    .domain(coaches.map(c => c.id).sort((a, b) => a - b))
    .range([marginC.top, height - marginC.bottom])
    .padding(0.8);

gYAxis.attr("transform", `translate(${marginC.left}, 0)`);



function updateCoachPerformanceChart() {

    let season = seasons[deafultSeason - 1];
    let placementPoints = [15, 10, 6, 3, 1];

    let coachPoints = coaches.map(c => ({
        coachId: c.id,
        totalPoints: 0
    }));

    for (let compDay of season.competitionDays) {
        for (let event of compDay.events) {

            if (event.disciplineId !== defaultDiscipline) continue;

            let sorted = [...event.scores]
                .sort((a, b) => b.score - a.score);

            sorted.slice(0, 5).forEach((p, index) => {

                let points = placementPoints[index];

                let seasonCoach = season.coaches.find(
                    c => c.participantId == p.participantId
                );

                let coach = coaches.find(
                    c => c.id == seasonCoach.coachId
                );

                if (!coach) return;

                let target = coachPoints.find(
                    c => c.coachId === coach.id
                );

                target.totalPoints += points;
            });
        }
    }

    drawChart(coachPoints);
}


function drawChart(coachData) {

    let x = d3.scaleLinear()
        .domain([0, maxPoints])
        .range([marginC.left, width - marginC.right]);

    // AXES
    gXAxis
        .transition()
        .duration(800)
        .attr("font-size", "14px")
        .attr("stroke", "#C2AD89")
        .attr("transform", `translate(0, ${height - marginC.bottom})`)
        .call(d3.axisBottom(x).ticks(6));

    gXAxis.select(".domain")
        .attr("stroke", "#C2AD89");

    gXAxis.selectAll(".tick line")
        .attr("stroke", "#C2AD89");

    gXAxis.selectAll(".tick text")
        .attr("fill", "#C2AD89");

    gYAxis
        .transition()
        .duration(800)
        .attr("font-size", "14px")
        .attr("stroke", "#C2AD89")
        .call(d3.axisLeft(y).tickFormat(id => `Coach ${id}`));

    gYAxis
        .call(d3.axisLeft(y));

    gYAxis.select(".domain")
        .attr("stroke", "#C2AD89");

    gYAxis.selectAll(".tick line")
        .attr("stroke", "#C2AD89");

    gYAxis.selectAll(".tick text")
        .attr("fill", "#C2AD89");


    svgC.append("text")
        .attr("x", 800)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "#C2AD89")
        .text("Total Points");


    svgC.append("text")
        .attr("x", 210)
        .attr("y", 17)
        .attr("fill", "#C2AD89")
        .attr("font-size", "16pxpx")
        .text("Coaches");

    // BARS
    let barUpdate = gBars
        .selectAll("rect")
        .data(coachData, d => d.coachId);

    let barEnter = barUpdate.enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.coachId))
        .attr("height", y.bandwidth())
        .attr("fill", d => coachColors[d.coachId])
        .style("filter", d => `drop-shadow(0px 0px 4px ${coachColors[d.coachId]})`);


    barUpdate.exit().remove();

    let barMerge = barUpdate.merge(barEnter);

    barMerge
        .transition()
        .duration(800)
        .attr("x", x(0))
        .attr("y", d => y(d.coachId))
        .attr("width", d => x(d.totalPoints) - x(0))
        .attr("height", y.bandwidth())


    // LABELS
    let textUpdate = gLabels
        .selectAll("text")
        .data(coachData, d => d.coachId);

    let textEnter = textUpdate.enter()
        .append("text")
        .attr("alignment-baseline", "middle")
        .attr("fill", "#C2AD89")
        .attr("font-size", "12px")
        .attr("x", x(0) + 10)
        .attr("y", d => y(d.coachId) + y.bandwidth() / 2);

    textUpdate.exit().remove();

    let textMerge = textUpdate.merge(textEnter);

    textMerge
        .transition()
        .duration(800)
        .attr("x", d => x(d.totalPoints) + 10)
        .attr("y", d => y(d.coachId) + y.bandwidth() / 2)
        .text(d => d.totalPoints);
}


updateCoachPerformanceChart();


//Ranking dashboard

let disciplinesElements = ["Maze", "Hunt", "HidenSeek", "Fighting", "Race"]

function getAllScores() {
    let all = [];

    for (let season of seasons) {
        for (let day of season.competitionDays) {
            for (let event of day.events) {
                for (let score of event.scores) {
                    all.push(score);
                }
            }
        }
    }

    return all;
}



function getTotalPlayerScores(allScores) {

    let totals = [];

    for (let score of allScores) {

        let existing = totals.find(
            p => p.participantId === score.participantId
        );

        if (!existing) {
            existing = {
                participantId: score.participantId,
                score: 0
            };
            totals.push(existing);
        }

        existing.score += score.score;
    }

    totals.sort((a, b) => b.score - a.score);

    return totals;
}


function getTopFivePlayers(totalScores) {
    return totalScores.slice(0, 5);
}



function groupDisciplines() {

    let grouped = [];

    for (let season of seasons) {
        for (let day of season.competitionDays) {
            for (let event of day.events) {

                let existing = grouped.find(
                    d => d.eventID === event.disciplineId
                );

                if (!existing) {
                    existing = {
                        eventID: event.disciplineId,
                        events: []
                    };
                    grouped.push(existing);
                }

                existing.events.push(event);
            }
        }
    }

    return grouped;
}


function buildResult(grouped, topPlayers) {

    let result = [];

    for (let d of grouped) {

        let disciplineObj = {
            disciplineID: d.eventID,
            players: []
        };

        for (let player of topPlayers) {

            let score = 0;

            for (let event of d.events) {
                for (let s of event.scores) {

                    if (s.participantId === player.participantId) {
                        score += s.score;
                    }

                }
            }

            disciplineObj.players.push({
                participantId: player.participantId,
                score: score
            });
        }

        disciplineObj.players.sort((a, b) => b.score - a.score);

        result.push(disciplineObj);
    }

    return result;
}


function getSpecialties(result, topPlayers) {

    let playerSpecialtyWins = [];

    for (let player of topPlayers) {

        let best = {
            specialty: "",
            wins: 0,
            totalMatches: 0
        };

        for (let res of result) {

            let disciplineName =
                disciplinesElements[res.disciplineID - 1];

            let wins = 0;
            let totalMatches = 0;

            for (let season of seasons) {
                for (let day of season.competitionDays) {
                    for (let event of day.events) {

                        if (event.disciplineId !== res.disciplineID) continue;

                        totalMatches++;

                        let sorted = [...event.scores]
                            .sort((a, b) => b.score - a.score);

                        if (sorted[0].participantId === player.participantId) {
                            wins++;
                        }
                    }
                }
            }

            if (wins > best.wins) {
                best.specialty = disciplineName;
                best.wins = wins;
                best.totalMatches = totalMatches;
            }
        }

        playerSpecialtyWins.push({
            participantId: player.participantId,
            specialty: best.specialty,
            wins: best.wins,
            totalMatches: best.totalMatches,
            winRate: (best.wins / best.totalMatches) * 100
        });
    }

    return playerSpecialtyWins;
}



let allScores = getAllScores();

let totalScores = getTotalPlayerScores(allScores);

let topFivePlayers = getTopFivePlayers(totalScores);

let grouped = groupDisciplines();

let result = buildResult(grouped, topFivePlayers);

let playerSpecialtyWins = getSpecialties(result, topFivePlayers);


let topMonsters = topFivePlayers.map(player =>
    participants.find(p => p.id === player.participantId)
);



let containerAllMonstersBoxLanding = document.getElementById("containerAllMonstersBoxLanding")
let coachCards = CreateAllMonsters(topMonsters)

containerAllMonstersBoxLanding.innerHTML = "";

coachCards.forEach(card => {
    containerAllMonstersBoxLanding.appendChild(card);
});





let rankingDOM = document.getElementById("monsterRanking");
let specialtyDOM = document.getElementById("specialty");
let winRateDOM = document.getElementById("winRate");

let monsterCards = document.querySelectorAll(".monsterCard");

let rankMonsterName = document.getElementById("rankMonsterName");
let smallMonsterPic = document.getElementById("smallMonsterPic");
let smallPicBorder = document.getElementById("smallPicBorder");
let smallLine = document.getElementById("smallLine");
let cropBox = document.querySelector(".cropBox");

monsterCards.forEach(card => {

    card.addEventListener("click", () => {

        monsterCards.forEach(c => c.classList.remove("chosenMonsterCard"));
        card.classList.add("chosenMonsterCard")

        let id = card.querySelector(".idName span").textContent;
        let monsterName = card.querySelector(".monsterName").textContent;
        let monsterImage = card.querySelector(".monsterImage").src;

        cropBox.innerHTML = `<img src="${monsterImage}">`;
        smallPicBorder.style.display = "flex";
        smallLine.style.display = "flex";

        let player = playerSpecialtyWins.find(
            p => p.participantId == id
        );

        let index = topMonsters.findIndex(
            m => m.id == id
        );

        rankingDOM.innerHTML = "";
        specialtyDOM.innerHTML = "";
        winRateDOM.innerHTML = "";
        rankMonsterName.innerHTML = "";
        smallMonsterPic.innerHTML = "";

        if (player) {

            smallMonsterPic.innerHTML = `<img src="${monsterImage}">`;
            rankMonsterName.textContent = monsterName;

            winRateDOM.innerHTML = `
                <p class="rankingText">Win rate for all ${player.specialty} matches:</p>
                <p id="procentualRate">${Math.round(player.winRate)}%</p>
            `;

            specialtyDOM.innerHTML = `
                <p class="rankingText">Specialty:</p>
                <p>${player.specialty}</p>
            `;

            rankingDOM.innerHTML = `
                <p class="rankingText">Ranking:<br> ${index + 1}</p>
                <img src="./images/rankingPic.png">
                <p id="smallRanking">${index + 1}</p>
            `;
        }
    });
});

