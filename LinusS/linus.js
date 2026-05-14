
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