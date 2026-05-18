
let allPlayersAndScores = []
let totalPlayerScore = []
let allEvents = []
let allIDs = []


for(let season of seasons){
   let compDays = season.competitionDays
   for(let day of compDays){
    allEvents.push(day.events)
   }
}

for(let events of allEvents){
     for(let event of events){
         for(let score of event.scores){
            allPlayersAndScores.push(score)
         }
    }
     
}

allPlayersAndScores.filter(score => {
    if(!allIDs.includes(score.participantId)){
        allIDs.push(score.participantId)
    }
})



for(let id of allIDs){
    let participantscore = 0
    for(let player of allPlayersAndScores){
        if(player.participantId == id){
            participantscore += player.score
        }
    }   
    totalPlayerScore.push({participantId: id, score: participantscore})
}
totalPlayerScore.sort((a,b) => b.score - a.score)


let topFivePlayers = totalPlayerScore.splice(0,5)
console.log(topFivePlayers);

//
