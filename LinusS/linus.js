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
let pirateStory = document.querySelector("#pirateStory")

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

let continueButtonStory = document.querySelector("#continueButtonStory")

let creatureScoreboardStats = document.querySelector("#creatureScoreboardStats")

let storyPart1 = "The story begins in the 1600s, when the pirate fleet Royal Fortune flees from the British East India Company. In a desperate attempt to escape, they sail into a violent storm, but are instead pulled into a massive whirlpool and vanish without a trace in the depths of the ocean. From the world’s perspective, the pirates are presumed dead, and over time the event becomes nothing more than a forgotten footnote in history. More than 450 years later, in 2104, a research submersible discovers a mysterious underwater cave containing an enormous energy source. When the expedition enters the cave, they end up in the same supernatural place as the pirates.";
let storyPart2 = "The pirates had survived inside a gigantic underwater cavern with five colored portals leading to different dangerous and strange worlds filled with monsters and unknown environments. After heavy losses, they learn to survive, tame creatures, and eventually build a functioning society, where an arena with monster battles becomes the center of culture and economy. When the modern expedition arrives, the group is split up and enters different portals. In one of the worlds, the protagonist ends up in a timeless system where people from different eras are trapped in an arena. To return, they must win three matches in a row, but each loss resets their progress. The story ends with the realization that escape may take an extremely long time—but also with hope of understanding the system and one day finding a way back.";
const skullJaw = document.querySelector(".pirateJaw")
let storyTextElement = document.querySelector(".storyText")

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
        pirateStory.play()

        const TypeWriter = setInterval(() => {
            storyTextElement.textContent += storypart1Array[currentLetter]
            currentLetter++

            if (currentLetter === storypart1Array.length) {
                storyPage.classList.remove("fadeToNormal")
                clearInterval(TypeWriter)
                skullJaw.classList.remove("animation")
                continueButtonStory.classList.remove("hide")
            }
        }, 70)
    }, 5000 )
})

continueButtonStory.addEventListener("click", () => {
    storyPage.classList.add("fadePageBlack")
    setTimeout(() => {
        storyPage.classList.add("hide")
        storyPage.classList.remove("fadePageBlack")
        portalPage.classList.remove("hide")
        portalPage.classList.add("fadeToNormal")
    }, 5000 )
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

