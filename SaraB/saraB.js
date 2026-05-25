let disciplineAlternatives = ["Maze", "Hunt", "HidenSeek", "Fighting", "Race"];
let comparePageButton = document.getElementById("comparePageButton");
let landingPageContainer = document.getElementById("landingPageContainer");
let comparePage = document.getElementById("comparePage");
let coachesImpactButton = document.getElementById("coachesImpactButton");
let coachGraphPage = document.getElementById("coachGraphPage");
let coachBackArrow = document.getElementById("coachBackArrow");
let skillInfo = document.getElementById("skillInfo");
let skillColorsContainer = document.getElementById("skillColorsContainer");


function activateButtons(){
    
    coachesImpactButton.addEventListener("click", e => {
        landingPageContainer.classList.add("hide");
        coachGraphPage.classList.remove("hide");
        
    });
    
    
    coachBackArrow.addEventListener("click", e => {
        coachGraphPage.classList.add("hide");
        landingPageContainer.classList.remove("hide");
        
    });

    comparePageButton.addEventListener("click", e => {
        landingPageContainer.classList.add("hide");
        comparePage.classList.remove("hide");
        CreateChartSvg();

    });
};

activateButtons();

let skillsElement = ["Strength", "endurance", "Speed", "Camoflauge", "Knowledge"];

function showBestSkillInfo(disciplineId) {

    let result = findBestSkillForDiscipline(disciplineId);

    let skillInfoDiv = document.getElementById("skillInfo");
    skillInfoDiv.innerHTML = "";

    let index = parseInt(result.bestSkill.replace("S", "")) - 1;

    let skillName = skillsElement[index];

    let p = document.createElement("p");
    p.textContent = `Best skill to have:  ${skillName}`;

    skillInfoDiv.appendChild(p);
}


let seasonSelect = document.getElementById("seasonSelect");
seasonSelect.classList.add("selectC");
let eventSelect = document.getElementById("eventSelect");
eventSelect.classList.add("selectC");



for (let i = 1; i <= 10; i++) {
    let opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Season ${i}`;
    seasonSelect.appendChild(opt);
};


let sortedDisciplines = [...disciplines].sort((a, b) => a.id - b.id);

sortedDisciplines.forEach(d => {
    let opt = document.createElement("option");
    opt.value = d.id;

    opt.textContent = disciplineAlternatives[d.id - 1];

    eventSelect.appendChild(opt);
});


let deafultSeason = 1;
let defaultDiscipline = sortedDisciplines[0].id;
showBestSkillInfo(defaultDiscipline)


seasonSelect.addEventListener("change", e => {
    deafultSeason = parseInt(e.target.value);
    updateCoachPerformanceChart();
});

eventSelect.addEventListener("change", e => {
    defaultDiscipline = parseInt(e.target.value);

    showBestSkillInfo(defaultDiscipline);

    updateCoachPerformanceChart();
});



let skillColors = {
    S01: "#ff4d4d", 
    S02: "#4da6ff",
    S03: "#ffd24d",
    S04: "#4dff88", 
    S05: "#b84dff"  
};

function rendersSkillInfo() {
    let i = 0;

    for (let skill of skillsElement) {

        let skillId = "S0" + (i + 1);
        let color = skillColors[skillId];

        let skillDiv = document.createElement("div");
        skillDiv.classList.add("skillskillDiv");

        let circle = document.createElement("div");
        circle.classList.add("skillColorCircle");
        circle.style.background = color;
        circle.style.filter = `drop-shadow(0px 0px 4px ${color})`;

        let text = document.createElement("p");
        text.textContent = skill;

        skillDiv.appendChild(circle);
        skillDiv.appendChild(text);

        skillColorsContainer.appendChild(skillDiv);

        i++;
    }
}

rendersSkillInfo()


function getCoachSkillId(coachId) {
    let coach = coaches.find(c => c.id == coachId);
    return coach.skillId;
}


const maxPoints = 450;

let width = 1000;
let height = 430;
let marginC = { top: 40, right: 100, bottom: 80, left: 250 };

let svgC = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let gBars = svgC.append("g");
let gLabels = svgC.append("g");
let gXAxis = svgC.append("g");
let gYAxis = svgC.append("g");


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


    let coachParticipantCounts = {};

    coaches.forEach(coach => {

        let amount = season.coaches.filter(
            c => c.coachId == coach.id
        ).length;

        coachParticipantCounts[coach.id] = amount ;
    });

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



                let target = coachPoints.find(
                    c => c.coachId == coach.id
                );

                let dividedPoints =
                    points / coachParticipantCounts[coach.id];

                target.totalPoints += dividedPoints;
            });
        }
    }

    drawChart(coachPoints);
}

function drawChart(coachData) {

    let x = d3.scaleLinear()
        .domain([0, maxPoints])
        .range([marginC.left, width - marginC.right]);

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

    gYAxis.select(".domain")
        .attr("stroke", "#C2AD89");

    gYAxis.selectAll(".tick line")
        .attr("stroke", "#C2AD89");

    gYAxis.selectAll(".tick text")
        .attr("fill", "#C2AD89");


    svgC.append("text")
        .attr("x", width / 2 + 60)
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

    let barUpdate = gBars
        .selectAll("rect")
        .data(coachData, d => d.coachId);

    let barEnter = barUpdate.enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.coachId))
        .attr("height", y.bandwidth())
        .attr("fill", d => {
            let skillId = getCoachSkillId(d.coachId);
            return skillColors["S0" + skillId];
        })
        .style("filter", d => {
            let skillId = getCoachSkillId(d.coachId);
            let color = skillColors["S0" + skillId];
            return "drop-shadow(0px 0px 4px " + color + ")";
        });


    barUpdate.exit().remove();

    let barMerge = barUpdate.merge(barEnter);

    barMerge
        .transition()
        .duration(800)
        .attr("x", x(0))
        .attr("y", d => y(d.coachId))
        .attr("width", d => x(d.totalPoints) - x(0))
        .attr("height", y.bandwidth())


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
        .text(d =>  Math.round(d.totalPoints))
}


updateCoachPerformanceChart();


function findBestSkillForDiscipline(disciplineId) {

    let d = disciplines.find(d => d.id == disciplineId);


    let skillFactors = d.skillFactors;

    let bestSkill = {
        skill: null,
        value: -Infinity
    };

    for (let skill in skillFactors) {

        if (skillFactors[skill] > bestSkill.value) {
            bestSkill.skill = skill;
            bestSkill.value = skillFactors[skill];
        }
    }

    return {
        disciplineId: d.id,
        disciplineName: d.name,
        bestSkill: bestSkill.skill,
        bestValue: bestSkill.value
    };
}





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


function getAveragePlayerScoresPerSeason() {

    let totals = [];

    for (let season of seasons) {
        for (let day of season.competitionDays) {
            for (let event of day.events) {
                for (let score of event.scores) {

                    let existing = totals.find(
                        p => p.participantId === score.participantId
                    );

                    if (!existing) {
                        existing = {
                            participantId: score.participantId,
                            totalScore: 0,
                            seasons: []
                        };
                        totals.push(existing);
                    }

                    existing.totalScore += score.score;

                    if (!existing.seasons.includes(season.id)) {
                        existing.seasons.push(season.id);
                    }
                }
            }
        }
    }

    let result = totals.map(p => ({
        participantId: p.participantId,
        score: p.totalScore / p.seasons.length
    }));

    result.sort((a, b) => b.score - a.score);
    

    return result;
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
                    d => d.eventID == event.disciplineId
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

                    if (s.participantId == player.participantId) {
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

                        if (sorted[0].participantId == player.participantId) {
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

let totalScores = getAveragePlayerScoresPerSeason();

let topFivePlayers = getTopFivePlayers(totalScores);

let grouped = groupDisciplines();

let result = buildResult(grouped, topFivePlayers);

let playerSpecialtyWins = getSpecialties(result, topFivePlayers);


let topMonsters = topFivePlayers.map(player =>
    participants.find(p => p.id == player.participantId)
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

