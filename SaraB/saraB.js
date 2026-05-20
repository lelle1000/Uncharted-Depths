
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


for (let player of allPlayersAndScores) {

    let existing = totalPlayerScore.find(
        p => p.participantId === player.participantId
    )

    if (!existing) {
        existing = {
            participantId: player.participantId,
            score: 0
        };
        totalPlayerScore.push(existing)
    }

    existing.score += player.score
}

totalPlayerScore.sort((a, b) => b.score - a.score)


let topFivePlayers = totalPlayerScore.splice(0,5)
// console.log(topFivePlayers);

//
let disciplineId = disciplines.map(d => d.id)



let disciplinesANDtheirEvents = []

for (let events of allEvents) {
    for (let event of events) {
        let disciplineExists = disciplinesANDtheirEvents.find(
            i => i.eventID == event.disciplineId
        );

        if (!disciplineExists) {
            disciplineExists = {
                eventID: event.disciplineId,
                events: []
            };

            disciplinesANDtheirEvents.push(disciplineExists);
        }

        disciplineExists.events.push(event)
    }
}

// console.log(topFivePlayers)

//








// console.log(disciplinesANDtheirEvents);







////

let result = [];

for (let d of disciplinesANDtheirEvents) {

    let disciplineObj = {
        disciplineID: d.eventID,
        players: []
    };

    for (let player of topFivePlayers) {

        let score = 0;

        for (let event of d.events) {
            for (let eventScore of event.scores) {

                if (eventScore.participantId == player.participantId) {
                    score += eventScore.score;
                }

            }
        }

        disciplineObj.players.push({
            participantId: player.participantId,
            score: score
        });
    }

    result.push(disciplineObj);
}



for (let d of result) {
    d.players.sort((a, b) => b.score - a.score);
}
// console.log(result);


//specialty

let disciplinesElements = ["Maze", "Hunt", "HidenSeek", "Fighting", "Race" ]

let topRankInDiscipline = ""
let specialty = ""

for(let res of result){
    topRankInDiscipline = res.players[0]
    specialty = disciplinesElements[res.disciplineID - 1]

    // console.log(topRankInDiscipline, specialty);
}





/////

// let wins = 0
// // let participantWins = [];

// for (let player of topFivePlayers) {

//     let wins = 0;

//     for (let season of seasons) {
//         for (let compDays of season.competitionDays) {
//             for (let event of compDays.events) {

//                 let winner = event.scores[0];

//                 if (winner.participantId === player.participantId) {
//                     wins++;

//                 }
//             }
//         }
//     }


//     participantWins.push({
//         participantId: player.participantId,
//         wins: wins
//     });
// }

// console.log(participantWins)

    // let procentualWins = Math.round(wins/10)


// winsssss

let playerSpecialtyWins = [];
let totalMatches = 0
let winRate = 0

for (let player of topFivePlayers) {

    let best = {
        specialty: "",
        wins: 0
    };

    for (let res of result) {

        let disciplineName =
            disciplinesElements[res.disciplineID - 1];

        let wins = 0;

        for (let season of seasons) {
            for (let compDays of season.competitionDays) {
                for (let event of compDays.events) {
                    

                    if (event.disciplineId === res.disciplineID) {
                        totalMatches++

                        let winner = [...event.scores]
                            .sort((a, b) => b.score - a.score)[0];

                        if (winner.participantId === player.participantId) {
                            wins++;
                        }
                    }
                }
            }
        }

        if (wins > best.wins) {
            best.wins = wins;
            best.specialty = disciplineName;
        }
    }

    playerSpecialtyWins.push({
        participantId: player.participantId,
        specialty: best.specialty,
        wins: best.wins,
        totalMatches:totalMatches, 
        winRate: ((best.wins / totalMatches)* 1000)
    });
}

console.log(playerSpecialtyWins);

