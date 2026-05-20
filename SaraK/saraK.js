import { monsterCardClass } from "./monsterClass.js";

const mainContainer = document.getElementById("comparePage")
const selectRandomButton = document.getElementById("selectRandomButton")
let allMonstersObjectArray = participants;
let containerAllMonstersBox = document.querySelectorAll("#containerAllMonstersBox .monsterCard");
let chosenCardCounter = 0;

function ClearSectionClickEvent() {
    const clearSelectionButton = document.getElementById("clearSelectionButton")
    clearSelectionButton.addEventListener("click", () => { //clear Selection av monsters knapp
        chosenCardCounter = 0;

        containerAllMonstersBox.forEach(card => {
            if (card.classList.contains("chosenMonsterCard")) {
                card.classList.toggle("chosenMonsterCard")
                GetArrayFromChosenCards()
            }
        })
    })
}


function BackButtonClickEvent() {
    const backArrow = document.querySelectorAll(".backArrow");
    backArrow.forEach(arrow => {
        arrow.addEventListener("click", () => {
            mainContainer.classList.add("hide")

        })
    })
}

function SelectRandomMonsterButton() {
    selectRandomButton.addEventListener("click", event => {
        chosenCardCounter = 0;
        let allMonsterCards = document.querySelectorAll("#containerAllMonstersBox .monsterCard")
        allMonsterCards.forEach(card => {
            card.classList.remove("chosenMonsterCard")
            // GetArrayFromChosenCards()
        })
        for (let i = 0; i < 2; i++) {
            let randomNumber = RandomNumber()
            allMonsterCards[randomNumber]
            allMonsterCards[randomNumber].classList.add("chosenMonsterCard")

            chosenCardCounter++;
        }
        GetArrayFromChosenCards()
    })
}

function RandomNumber() {
    return Math.floor(Math.random() * allMonstersObjectArray.length)
}

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


function InputFieldClickEvent() {
    const inputIdField = document.getElementById("inputIdField");
    inputIdField.addEventListener("keypress", event => {
        if (event.key == "Enter") {

            let allMonsterCards = document.querySelectorAll("#containerAllMonstersBox .monsterCard")
            allMonsterCards.forEach(monster => {

                let spanId = monster.querySelector("#monsterId")
                if (inputIdField.value == "") {
                    allMonsterCards.forEach(monster => {
                        if (monster.classList.contains("hideCard")) {
                            monster.classList.remove("hideCard")
                        }
                    })
                }
                if (spanId.textContent != inputIdField.value) {
                    monster.classList.add("hideCard")
                }
                else {
                    monster.classList.remove("hideCard")
                }
            })
        }
    })

}

function ChosenCardClickEvent() {
    containerAllMonstersBox = document.querySelectorAll("#containerAllMonstersBox .monsterCard");
    containerAllMonstersBox.forEach(card => { ///  Select card den du klickar på
        card.addEventListener("click", event => {

            if (chosenCardCounter < 2 && (!card.classList.contains("chosenMonsterCard"))) {
                card.classList.add("chosenMonsterCard")
                GetArrayFromChosenCards()
                chosenCardCounter++;
            }

            else if (chosenCardCounter <= 2 && card.classList.contains("chosenMonsterCard")) {
                card.classList.remove("chosenMonsterCard")
                GetArrayFromChosenCards()
                chosenCardCounter--;
            }

        })
    })
}

createAllMonsters(allMonstersObjectArray);
ChosenCardClickEvent();
InputFieldClickEvent();
ClearSectionClickEvent();
BackButtonClickEvent();
SelectRandomMonsterButton();
GetArrayFromChosenCards();

//filtrera säsong 1
//filtrera alla participants 206
//ta ett monsters poäng under en säsong / medelvärdet


let compareScoreArray = []
function getMonsterAverageScore(requestedSeason, requestedParticipantId) {

    let totalScore = 0;
    let pointsArrayForId = seasons.filter(year => year.year == requestedSeason)
        .flatMap(season => season.competitionDays)
        .flatMap(day => day.events)
        .flatMap(events => events.scores)
        .filter(score => score.participantId == requestedParticipantId)
    // .map(score => ({
    //     participantId: score.participantId,
    //     score: score.score
    // }))

    totalScore = pointsArrayForId.reduce((sum, s) => sum + s.score, 0)
    totalScore = Math.round(totalScore / pointsArrayForId.length);

    compareScoreArray.push({ id: requestedParticipantId, score: totalScore })
    return { id: requestedParticipantId, score: totalScore }

}

//hämta id,färg  från chosen cards
function GetArrayFromChosenCards() {
    let arrayToCompare = []
    let activecards = document.querySelectorAll("#containerAllMonstersBox .monsterCard.chosenMonsterCard")
    activecards.forEach(card => {
        const text = Number(card.querySelector(".idName #monsterId").textContent);
        arrayToCompare.push(text)
        console.log(arrayToCompare);
    });
}


//skapa svg charten
function CreateScoresChart(compareScoreArray) {


}

CreateScoresChart(compareScoreArray)
console.log(compareScoreArray)

console.log(getMonsterAverageScore(1, 206))
console.log(getMonsterAverageScore(1, 141))
// console.log(getMonsterAverageScore(2, 141))
// console.log(getMonsterAverageScore(1, 6))


//skapa klass för varje kort 
//namn, id, bild, 


//att göra på sidan
//1. koppla monster till card, göra en klass?
//2. söka på monsters id 
//3. koppla samman färger
//4. koppla samman grafen, medelvärde av poängen baserat på hur många gånger de tävlat alla tävlor olika måpnga gånger



// function startStoryP1() {
//     let storyPage = document.getElementById("storyPage")
//     storyPage.classList.remove("hide")
//     let portalPage = document.getElementById("portalPage");
//     portalPage.classList.add("hide")
//     let storyTextP1 = document.getElementById("storyTextP1");
//     const skullJaw = document.querySelector(".pirateJaw")
//     let currentLetter = 0;
//     let storyPart1 = "The story begins in the 1600s, when the pirate fleet Royal Fortune flees from the British East India Company. In a desperate attempt to escape, they sail into a violent storm, but are instead pulled into a massive whirlpool and vanish without a trace in the depths of the ocean. From the world’s perspective, the pirates are presumed dead, and over time the event becomes nothing more than a forgotten footnote in history. More than 450 years later, in 2104, a research submersible discovers a mysterious underwater cave containing an enormous energy source. When the expedition enters the cave, they end up in the same supernatural place as the pirates.";
//     let storypart1Array = storyPart1.split("")


//     const typeWriterP1 = setInterval(() => {
//         storyTextP1.textContent += storypart1Array[currentLetter]
//         currentLetter++

//         if (currentLetter === storypart1Array.length) {
//             clearInterval(typeWriterP1)
//             skullJaw.classList.remove("animation")

//             storyTextP1.classList.add("hide");
//             storyTextP2.classList.remove("hide");

//             startStoryP2();
//         }
//     }, 10)


// }
// function startStoryP2() {
//     let portalPage = document.getElementById("portalPage");
//     let storyPage = document.getElementById("storyPage")
//     storyPage.classList.add("hide")
//     portalPage.classList.remove("hide")
//     let storyTextElement = document.querySelector(".storyText");
//     let storyTextP2 = document.getElementById("storyTextP2");

//     let storyPart2 = "The pirates had survived inside a gigantic underwater cavern with five colored portals leading to different dangerous and strange worlds filled with monsters and unknown environments. After heavy losses, they learn to survive, tame creatures, and eventually build a functioning society, where an arena with monster battles becomes the center of culture and economy. When the modern expedition arrives, the group is split up and enters different portals. In one of the worlds, the protagonist ends up in a timeless system where people from different eras are trapped in an arena. To return, they must win three matches in a row, but each loss resets their progress. The story ends with the realization that escape may take an extremely long time—but also with hope of understanding the system and one day finding a way back.";
//     const skullJaw = document.querySelector(".pirateJaw")
//     let storypart2Array = storyPart2.split("")
//     let currentLetter = 0;
//     storyTextP2.textContent = "";

//     const TypeWriterP2 = setInterval(() => {
//         storyTextP2.textContent += storypart2Array[currentLetter]
//         currentLetter++

//         if (currentLetter === storypart2Array.length) {
//             clearInterval(TypeWriterP2)
//             skullJaw.classList.remove("animation")
//         }
//     }, 10)

// }