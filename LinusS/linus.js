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
    
    creatureScoreboardStats.innerHTML = ""
    selectedDiscipline = btn.dataset.disciplineid;
    let creaturePlacement;
    let creatureName;
    let craturePoints;



    creatureScoreboardStats.innerHTML += `
    <div class="creatureScoreboard">
        <p>${creaturePlacement}</p>
        <p>${creatureName}</p>
        <p>${craturePoints}</p>
    </div>
    `
}))

seasonButtons.forEach(btn => btn.addEventListener("click", () => {
    
    creatureScoreboardStats.innerHTML = ""
    selectedSeason = btn.dataset.currentseason;
    console.log(selectedSeason);
    
    let creaturePlacement;
    let creatureName;
    let craturePoints;



    creatureScoreboardStats.innerHTML += `
    <div class="creatureScoreboard">
        <p>${creaturePlacement}</p>
        <p>${creatureName}</p>
        <p>${craturePoints}</p>
    </div>
    `
}))












let unique = []
let sameParticipantFightingScores = seasons.filter(obj => {
    let averagePlayerScore = 0;
    let playerId = 178;
    let playerArr = [];
    let totalScore;
    let allPlayersInTheGame = obj.coaches.filter(player => player.participantId)

    for(let playerid of allPlayersInTheGame){

        if(!unique.includes(playerid.participantId)){
            unique.push(playerid.participantId)
        }
        
    }
    

    if (obj.year == 0) {
        let correctCompDay = obj.competitionDays
        for(let day of correctCompDay) {

            let events = day.events
            let correctEvents = events.filter(event => event.disciplineId == 5)
            
            let samePlayerScores = 0;
            
            for (let event of correctEvents) {
                let allEventScores = event.scores
                for(let player of allEventScores) {
                    
                    if(player.participantId == playerId) {
                        playerArr.push(player)
                        totalScore = averagePlayerScore += player.score 

                    
                    }
                }
                 
            }
        }
        console.log(totalScore / playerArr.length);
        
    }
})
console.log(unique);