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

function getParticipantSkills(participantId, seasonId) {

    let currentPlayerSkills = {
        skills: {
            S01Strength: 0,
            S02Speed: 0,
            S03Knowledge: 0,
            S04Camoflauge: 0,
            S05Endurance: 0,
        },
        playerId: participantId
    }

    let currentPlayerPointsInDisciplines = {
        Maze: 0,
        Hunt: 0,
        HideNSeek: 0,
        Race: 0,
        Fighting: 0
    }

    let allParticipantsDisciplineAndSkillTotalScore = {};

    let allDisciplines = [1, 2, 3, 4, 5]

    let allAverageScoresForAllDisciplines = {}

    let correctSeason = seasons.find(season => season.year == seasonId)

    for(let discipline of allDisciplines) {
        if(discipline == 1) {
            allAverageScoresForAllDisciplines.Maze = (ScoreboardParticipantsAndAverageScore(discipline, seasonId))
        } else if (discipline == 2) {
            allAverageScoresForAllDisciplines.Hunt = (ScoreboardParticipantsAndAverageScore(discipline, seasonId))
        } else if (discipline == 3) {
            allAverageScoresForAllDisciplines.HideNSeek = (ScoreboardParticipantsAndAverageScore(discipline, seasonId))
        } else if (discipline == 4) {
            allAverageScoresForAllDisciplines.Race = (ScoreboardParticipantsAndAverageScore(discipline, seasonId))
        } else {
            allAverageScoresForAllDisciplines.Fighting = (ScoreboardParticipantsAndAverageScore(discipline, seasonId))
        }
    }

    let highestScore = -Infinity;
    let lowestScore = Infinity;

    for (let discipline in allAverageScoresForAllDisciplines) {
        for (let playerObj of allAverageScoresForAllDisciplines[discipline]) {

            if(playerObj.participantId == participantId) {
                currentPlayerPointsInDisciplines[discipline] = playerObj.averageScore
            }

            
            
        }
    }

    console.log(allAverageScoresForAllDisciplines);
    console.log(currentPlayerPointsInDisciplines);


    
    return currentPlayerSkills

}

getParticipantSkills(170, 5)

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

