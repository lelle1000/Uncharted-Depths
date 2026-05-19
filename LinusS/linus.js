function ScoreboardParticipantsAndAverageScore(disciplineId, seasonId) {
    let ParticipantAndScore = []
    let averageScore;
    let participantName;

    let allParticipants = participants.map(participant => participant.Id)

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

let creatureScoreboardStats = document.querySelector("#creatureScoreboardStats")

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
    }, 6000 )
})

creditsButton.addEventListener("click", () => {
    firstPage.classList.add("fadePageBlack")
    setTimeout(() => {
        document.body.style.backgroundColor = "#04080b"
        firstPage.classList.add("hide")
        creditsPage.classList.remove("hide")
        firstPage.classList.remove("fadePageBlack")
        creditsPage.classList.add("fadeToNormal")
    }, 6000 )
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

