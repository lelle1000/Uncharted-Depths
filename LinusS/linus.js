function ScoreboardParticipantsAndAverageScore(disciplineId, seasonId) {
    let ParticipantAndScore = []
    let averageScore;

    let disciplineIdNumb = Number(disciplineId) // Kan använda == men lättare att fatta att dataset i html bara extraherar strängar
    let seasonIdNumb = Number(seasonId)

    let correctSeason = seasons.find(obj => obj.year === seasonIdNumb)

    let allParticipants = correctSeason.coaches.map(coachObj => coachObj.participantId)
    
    let compDays = correctSeason.competitionDays

    for(let day of compDays) {
        let events = day.events
        let correctDisciplinesArrays = events.filter(event => event.disciplineId === disciplineIdNumb)
        
        let scores = correctDisciplinesArrays[0].scores
        for(let scoreObj of scores) {
            if(allParticipants.includes(scoreObj.participantId) ) {

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
    }   

    for(let participant of ParticipantAndScore) {
        participant.averageScore = Math.round(participant.totalScore / participant.matchesPlayed)
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
        let creatureName = "Hasse"
        let creaturePoints = obj.averageScore

        creatureScoreboardStats.innerHTML += `
            <div class="creatureScoreboard">
                <p>${creaturePlacement}</p>
                <p>${creatureName}</p>
                <p>${creaturePoints} Pts</p>
            </div>
        `
    }
}

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

let creatureScoreboardStats = document.querySelector("#creatureScoreboardStats")

let disciplineButtons = [fightingButton, raceButton, hidenseekButton, mazeButton, huntButton]
let seasonButtons = [season1, season2, season3, season4, season5, season6, season7, season8, season9, season10]

let selectedDiscipline;
let selectedSeason;

disciplineButtons.forEach(btn => btn.addEventListener("click", () => {
    selectedDiscipline = btn.dataset.disciplineid;
    console.log(selectedDiscipline);
    
    if(selectedSeason) {
        updateScoreboard()
    }


}))

seasonButtons.forEach(btn => btn.addEventListener("click", () => {
    selectedSeason = btn.dataset.currentseason;
    console.log(selectedSeason);
    if(selectedDiscipline) {
        updateScoreboard()
    }

}))

