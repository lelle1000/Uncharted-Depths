



class monsterCardClass {

    constructor(data) {
        this.name = data.name;
        this.id = data.id;
        this.color = colorGenerator();
        this.imgUrl = randomPictureGenerator();
    }

}

function colorGenerator() { //generera en färg till monster

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
}

function randomPictureGenerator() { //generera en random monster URL
    let monsterPicNum = Math.ceil(Math.random() * 3)
    return `../images/monster${monsterPicNum}.png`
}

/////////////////////////////////////////////////

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





function createAllMonsters(monstersArray) {
    for (let i = 0; i < monstersArray.length; i++) {

        let containerAllMonstersBoxId = document.getElementById("containerAllMonstersBox")
        let monster1 = new monsterCardClass(monstersArray[i]);

        let monsterCard = document.createElement("div");
        monsterCard.classList.add("monsterCard")
        monsterCard.innerHTML = `
                       
        <p class="monsterName">${monster1.name}</p>
        <img src="${monster1.imgUrl}" class="monsterImage">
        <div class="colorLine"> </div>
        <p class="idName"> Id : <span id="monsterId">${monster1.id}</span></p>
        `
        let colorLine = monsterCard.querySelector(".colorLine");
        colorLine.style.backgroundColor = `${monster1.color}`
        containerAllMonstersBoxId.appendChild(monsterCard);

    }
}







let topMonsters = topFivePlayers.map(player =>
    participants.find(p => p.id === player.participantId)
)

createAllMonsters(topMonsters)
let rankingDOM = document.getElementById("monsterRanking");
let specialtyDOM = document.getElementById("specialty");
let winRateDOM = document.getElementById("winRate");

let monsterCards = document.querySelectorAll(".monsterCard")



console.log(topMonsters);

let rankMonsterName = document.getElementById("rankMonsterName")
let smallMonsterPic = document.getElementById("smallMonsterPic")

monsterCards.forEach(card => {

    card.addEventListener("click", e => {

        let id = card.querySelector(".idName span").textContent
        let monsterName =card.querySelector(".monsterName").textContent
        let monsterImage =card.querySelector(".monsterImage").src

        let player = playerSpecialtyWins.find(
            p => p.participantId == id
        )

        let index = topMonsters.findIndex(
            m => m.id == id
        )

        rankingDOM.innerHTML = ""
        specialtyDOM.innerHTML = ""
        winRateDOM.innerHTML = ""
        rankMonsterName.innerHTML = ""
        smallMonsterPic.innerHTML = ""

        if (player) {
            smallMonsterPic.innerHTML += `<img src="${monsterImage}">`
            rankMonsterName.textContent = monsterName
            winRateDOM.innerHTML += `
            <p>Win rate for all ${player.specialty} matches:</p>
            <p id="procentualRate">${Math.round(player.winRate)}%</p>
            `
            specialtyDOM.innerHTML += `
            <p>Specialty:</p>
            <p>${player.specialty}</p>`
            rankingDOM.innerHTML += `
            <p>Ranking:<br> ${index + 1}</p>
            <img src="../images/rankingPic.png">
            <p id="smallRanking">${index + 1}</p>
            `
        }
    })
})