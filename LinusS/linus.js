function ScoreboardParticipantsAndAverageScore(disciplineId, seasonId) {
    let ParticipantAndScore = []
    let averageScore;
    let participantName;

    let allParticipants = participants.map(player => player.id)

    let disciplineIdNumb = Number(disciplineId)
    let seasonIdNumb = Number(seasonId)

    let correctSeason = seasons.find(obj => obj.year === seasonIdNumb)
    let compDays = correctSeason.competitionDays

    for(let day of compDays) {
        let events = day.events
        let correctDisciplinesArrays = events.filter(event => event.disciplineId === disciplineIdNumb)
        
        let scores = correctDisciplinesArrays[0].scores
        for(let scoreObj of scores) {

            let existing = ParticipantAndScore.find(p => p.participantId == scoreObj.participantId)

            if(existing) {
                existing.totalScore += scoreObj.score
                existing.matchesPlayed += 1
            } else {
                ParticipantAndScore.push({
                    participantId: scoreObj.participantId,
                    totalScore: scoreObj.score,
                    matchesPlayed: 1
                })
            }
        }
    }   

    for(let participant of ParticipantAndScore) {

        let correctParticipant = participants.find(p => p.id == participant.participantId)

        participant.averageScore = Math.round(participant.totalScore / participant.matchesPlayed)
        participant.name = correctParticipant.name
        delete participant.totalScore
        delete participant.matchesPlayed
        
    }
    
    return ParticipantAndScore
}

function getDisciplineScores(seasonId) {
    let allAverageScoresForAllDisciplines = {}
    let allDisciplines = [1, 2, 3, 4, 5]

    for(let discipline of allDisciplines) {
        if (discipline == 1) {
            allAverageScoresForAllDisciplines.Maze1 = (ScoreboardParticipantsAndAverageScore(discipline, seasonId))
        } else if (discipline == 2) {
            allAverageScoresForAllDisciplines.Hunt2 = (ScoreboardParticipantsAndAverageScore(discipline, seasonId))
        } else if (discipline == 3) {
            allAverageScoresForAllDisciplines.HideNSeek3 = (ScoreboardParticipantsAndAverageScore(discipline, seasonId))
        } else if (discipline == 4) {
            allAverageScoresForAllDisciplines.Race4 = (ScoreboardParticipantsAndAverageScore(discipline, seasonId))
        } else {
            allAverageScoresForAllDisciplines.Fighting5 = (ScoreboardParticipantsAndAverageScore(discipline, seasonId))
        }
    }

    return allAverageScoresForAllDisciplines
}

function calculateTotalSkillScoreOverDisciplines(allAverageScoresForAllDisciplines) {
    let allDisciplinesTotalSkillScore = {
        Maze1: [],
        Hunt2: [],
        HideNSeek3: [],
        Race4: [],
        Fighting5: [],
    };

    for (let disciplineName in allAverageScoresForAllDisciplines) {
        let disciplineId = Number(disciplineName[disciplineName.length - 1])
        let disciplineObj = disciplines.find(obj => obj.id === disciplineId)

        let participantsInCurrentDiscipline = allAverageScoresForAllDisciplines[disciplineName]

        for (let participant of participantsInCurrentDiscipline) {
            let skillScores = { participantId: participant.participantId}

            for (let skillKey in disciplineObj.skillFactors) {
                skillScores[skillKey] = participant.averageScore * disciplineObj.skillFactors[skillKey]
            }
            allDisciplinesTotalSkillScore[disciplineName].push(skillScores)
        }
    }

    return allDisciplinesTotalSkillScore
}

function getCombinedSkillScorePerParticipant(allDisciplinesTotalSkillScore) {
    let participantSkillSum = {}

    for (let discipline in allDisciplinesTotalSkillScore) {
        for (let participant of allDisciplinesTotalSkillScore[discipline]) {

            if (!participantSkillSum[participant.participantId]) {
                participantSkillSum[participant.participantId] = {}
            }

            for (let key in participant) {
                if (key === "participantId") {
                    continue
                }
                if (!participantSkillSum[participant.participantId][key]) {
                    participantSkillSum[participant.participantId][key] = 0
                }
                participantSkillSum[participant.participantId][key] += participant[key]
            }
        }
    }

    return participantSkillSum
}

function getSkillFactorForParticipant(participantId, participantSkillSum) {
    let highestSkillScore = -Infinity;
    let lowestSkillScore = Infinity;

    for (let participant in participantSkillSum) {
        for (let skillKey in participantSkillSum[participant]) {
            highestSkillScore = Math.max(highestSkillScore, participantSkillSum[participant][skillKey])
            lowestSkillScore = Math.min(lowestSkillScore, participantSkillSum[participant][skillKey])
        }
    }

    let minSkillFactor = 10;
    let maxSkillFactor = 20;

    let skillScale = d3.scaleLinear()
        .domain([lowestSkillScore, highestSkillScore])
        .range([minSkillFactor, maxSkillFactor])
    
    let results = { participantId: participantId}

    for (let skillKey in participantSkillSum[participantId]) {
        results[skillKey] = Math.round(skillScale(participantSkillSum[participantId][skillKey]))
    }

    results["Strength"] = results["S01"]
    results["Speed"] = results["S02"]
    results["Knowledge"] = results["S03"]
    results["Camoflauge"] = results["S04"]
    results["Endurance"] = results["S05"]

    for (let i = 0; i <= 5; i++) {
        delete results[`S0${i}`]
    }
    
    return results
}

function getParticipantSkills(participantId, seasonId) {
    const disciplineScores = getDisciplineScores(seasonId)
    const disciplineCombinedScores = calculateTotalSkillScoreOverDisciplines(disciplineScores)
    const totalSkillSum = getCombinedSkillScorePerParticipant(disciplineCombinedScores)
    return skillFactorForParticipant = getSkillFactorForParticipant(participantId, totalSkillSum)
}

function updateScoreboard() {
    creatureScoreboardStats.innerHTML = ""

    let arrayWithScoreAndParticipantId = ScoreboardParticipantsAndAverageScore(selectedDiscipline, selectedSeason)

    arrayWithScoreAndParticipantId.sort((a, b) => b.averageScore - a.averageScore)

    for(let obj of arrayWithScoreAndParticipantId) {
        
        let creaturePlacement = arrayWithScoreAndParticipantId.indexOf(obj) + 1     
        let creatureName = obj.name
        let creaturePoints = obj.averageScore

        creatureScoreboardStats.innerHTML += `
            <div class="creatureScoreboard">
                <p class="text">${creaturePlacement}</p>
                <p class="text">${creatureName}</p>
                <p class="text">${creaturePoints} Pts</p>
            </div>
        `
    }
}

let subSound = document.querySelector("#subSound")
let waveSound = document.querySelector("#waveSound")
let pirateStory1 = document.querySelector("#pirateStoryPart1")
let pirateStory2 = document.querySelector("#pirateStoryPart2")

let firstPage = document.querySelector("#firstPage")
let creditsPage = document.querySelector("#creditsPage")
let portalPage = document.querySelector("#portalPage")
let storyPage = document.querySelector("#storyPage")
let landingPage = document.querySelector("#landingPageContainer")

let storyModeButton = document.querySelector("#storyModeButton")
let quickModeButton = document.querySelector("#quickModeButton")
let creditsButton = document.querySelector("#creditsButton")

let fightingButton = document.querySelector("#fightingDiscipline")
let raceButton = document.querySelector("#raceDiscipline")
let hidenseekButton = document.querySelector("#hidenseekDiscipline")
let mazeButton = document.querySelector("#mazeDiscipline")
let huntButton = document.querySelector("#huntDiscipline")

let season1 = document.querySelector("#season1Landing")
let season2 = document.querySelector("#season2Landing")
let season3 = document.querySelector("#season3Landing")
let season4 = document.querySelector("#season4Landing")
let season5 = document.querySelector("#season5Landing")
let season6 = document.querySelector("#season6Landing")
let season7 = document.querySelector("#season7Landing")
let season8 = document.querySelector("#season8Landing")
let season9 = document.querySelector("#season9Landing")
let season10 = document.querySelector("#season10Landing")

let backArrowCredits = document.querySelector("#backArrowCredits")

let continueButtonStory = document.querySelector("#continueButtonStory")

let creatureScoreboardStats = document.querySelector("#creatureScoreboardStats")

let storyPart1 = "The story begins in the 1600s, when the pirate fleet Royal Fortune flees from the British East India Company. In a desperate attempt to escape, they sail into a violent storm, but are instead pulled into a massive whirlpool and vanish without a trace in the depths of the ocean. From the world’s perspective, the pirates are presumed dead, and over time the event becomes nothing more than a forgotten footnote in history. More than 450 years later, in 2104, a research submersible discovers a mysterious underwater cave containing an enormous energy source. When the expedition enters the cave, they end up in the same supernatural place as the pirates.";
let storyPart2 = "The pirates had survived inside a gigantic underwater cavern with five colored portals leading to different dangerous and strange worlds filled with monsters and unknown environments. After heavy losses, they learn to survive, tame creatures, and eventually build a functioning society, where an arena with monster battles becomes the center of culture and economy. When the modern expedition arrives, the group is split up and enters different portals. In one of the worlds, the protagonist ends up in a timeless system where people from different eras are trapped in an arena. To return, they must win three matches in a row, but each loss resets their progress. The story ends with the realization that escape may take an extremely long time, but also with hope of understanding the system and one day finding a way back.";
const skullJaw1 = document.querySelector("#skullJaw1")
const skullJaw2 = document.querySelector("#skullJaw2")
let storyPart1LiveText = document.querySelector("#storyTextPart1")
let storyPart2LiveText = document.querySelector("#storyTextPart2")

let storypart1Array = storyPart1.split("")
let storypart2Array = storyPart2.split("")
let currentLetter = 0;

let pages = [firstPage, creditsPage, storyPage, portalPage, landingPage]

storyModeButton.addEventListener("click", () => {
    firstPage.classList.add("fadePageBlack")
    subSound.play()
    setTimeout(() => {
        firstPage.classList.add("hide")
        storyPage.classList.remove("hide")
        firstPage.classList.remove("fadePageBlack")
        storyPage.classList.add("fadeToNormal")
        waveSound.play()
        waveSound.volume = 0.5
        pirateStory1.play()

        const TypeWriter = setInterval(() => {
            storyPart1LiveText.textContent += storypart1Array[currentLetter]
            currentLetter++

            if (currentLetter === storypart1Array.length) {
                storyPage.classList.remove("fadeToNormal")
                clearInterval(TypeWriter)
                skullJaw1.classList.remove("animation")
                continueButtonStory.classList.remove("hide")
            }
        }, 70)
    }, 5000 )
})

continueButtonStory.addEventListener("click", () => {
    currentLetter = 0
    storyPage.classList.add("fadePageBlack")
    setTimeout(() => {
        storyPage.classList.add("hide")
        storyPage.classList.remove("fadePageBlack")
        portalPage.classList.remove("hide")
        portalPage.classList.add("fadeToNormal")
        pirateStory2.play()

        const TypeWriter = setInterval(() => {
            storyPart2LiveText.textContent += storypart2Array[currentLetter]
            currentLetter++

            if (currentLetter === storypart2Array.length) {
                portalPage.classList.remove("fadeToNormal")
                clearInterval(TypeWriter)
                skullJaw2.classList.remove("animation")
                continueButtonStory.classList.remove("hide")
            }
        }, 70)
    }, 5000 )
})

quickModeButton.addEventListener("click", () => {
    firstPage.classList.add("hide")
    landingPage.classList.remove("hide")
})

creditsButton.addEventListener("click", () => {
    firstPage.classList.add("fadePageBlack")
    setTimeout(() => {
        document.body.style.backgroundColor = "#04080b"
        firstPage.classList.add("hide")
        creditsPage.classList.remove("hide")
        firstPage.classList.remove("fadePageBlack")
        creditsPage.classList.add("fadeToNormal")
    }, 5000 )
})

backArrowCredits.addEventListener("click", () => {
    creditsPage.classList.remove("fadeToNormal")
    creditsPage.classList.add("hide")
    firstPage.classList.remove("hide")
})

let disciplineButtons = [fightingButton, raceButton, hidenseekButton, mazeButton, huntButton]
let seasonButtons = [season1, season2, season3, season4, season5, season6, season7, season8, season9, season10]

let selectedDiscipline;
let selectedSeason;

disciplineButtons.forEach(btn => btn.addEventListener("click", () => { 
    selectedDiscipline = btn.dataset.disciplineid;
    console.log(selectedDiscipline);

    disciplineButtons.forEach(button => {
        button.classList.remove("clickedDisciplineAndButton")
        btn.classList.add("clickedDisciplineAndButton")
    })
    
    if(selectedSeason) {
        updateScoreboard()
    }

}))

seasonButtons.forEach(btn => btn.addEventListener("click", () => {
    selectedSeason = btn.dataset.currentseason;
    console.log(selectedSeason);

    seasonButtons.forEach(button => {
        button.classList.remove("clickedDisciplineAndButton")
        btn.classList.add("clickedDisciplineAndButton")
    })

    if(selectedDiscipline) {
        updateScoreboard()
    }

}))

const radarChartLabels = ["Strength", "Speed", "Endurance", "Knowledge", "Camo"];

let svgHeightandWidth = 325;
let cxandcy = svgHeightandWidth / 2;
let radius = svgHeightandWidth / 2 - 40;

let maxValue = 20;
let numOfAxes = 5;
let circleSlice = (2 * Math.PI) / numOfAxes;

function toXY(angle, r) {
    return {
        x: cxandcy + r * Math.cos(angle - Math.PI / 2),
        y: cxandcy + r * Math.sin(angle - Math.PI / 2)
    };
}

let svgContainer = d3.select("#radarChartContainer")
    .append("svg")
    .attr("width", svgHeightandWidth)
    .attr("height", svgHeightandWidth);

const ringLevels = 5;
for (let i = 1; i <= ringLevels; i++) {
    svgContainer.append("circle")
        .attr("cx", cxandcy)
        .attr("cy", cxandcy)
        .attr("r", radius * (i / ringLevels))
        .attr("fill", "none")
        .attr("stroke", "#848276")
        .attr("stroke-width", "1")

}

radarChartLabels.forEach((label, i) => {
    const angle = circleSlice * i;
    const axisTip = toXY(angle, radius);

    svgContainer.append("line")
        .attr("x1", cxandcy)
        .attr("y1", cxandcy)
        .attr("x2", axisTip.x)
        .attr("y2", axisTip.y)
        .attr("stroke", "#ccc");

    const labelposition = toXY(angle, radius + 25);
    svgContainer.append("text")
        .attr("x", labelposition.x)
        .attr("y", labelposition.y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", 18)
        .attr("fill", "#848276")
        .text(label);
        
});

function drawRadarChart(data, strokeColor) {
    const values = Object.values(data).slice(1);

    const points = values.map((val, i) => {
        const r = (val / maxValue) * radius;
        const pos = toXY(circleSlice * i, r);
        return `${pos.x},${pos.y}`;
    }).join(" ");

    svgContainer.append("polygon")
        .attr("points", points)
        .attr("stroke", strokeColor)
        .attr("fill", `${strokeColor}`)
        .attr("fill-opacity", 0.3)
        .attr("stroke-width", 2)
}



////Coach graph


let disciplineAlternatives = ["Maze", "Hunt", "HidenSeek", "Fighting", "Race"];



let seasonSelect = document.getElementById("seasonSelect");
let eventSelect = document.getElementById("eventSelect");



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
let margin = { top: 40, right: 100, bottom: 80, left: 250 };

let svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let gBars = svg.append("g");
let gLabels = svg.append("g");
let gXAxis = svg.append("g");
let gYAxis = svg.append("g");

// FIX Y SCALE (11 coaches)
let y = d3.scaleBand()
    .domain(coaches.map(c => c.id).sort((a, b) => a - b))
    .range([margin.top, height - margin.bottom])
    .padding(0.8);

gYAxis.attr("transform", `translate(${margin.left}, 0)`);



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
        .range([margin.left, width - margin.right]);

    // AXES
    gXAxis
        .transition()
        .duration(800)
        .attr("font-size", "14px")
        .attr("stroke", "#C2AD89")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
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
 

    svg.append("text")
        .attr("x", 800)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "#C2AD89")
        .text("Total Points");


    svg.append("text")
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
        .attr("y", d => y(d.coachId) + y.bandwidth() / 2 );

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

let disciplinesElements = ["Maze", "Hunt", "HidenSeek", "Fighting", "Race" ]

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

CreateAllMonsters(topMonsters);




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

