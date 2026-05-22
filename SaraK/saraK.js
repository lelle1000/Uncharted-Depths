// import { monsterCardClass } from "monsterClass.js";

const mainContainer = document.getElementById("comparePage")
const selectRandomButton = document.getElementById("selectRandomButton")
let allMonstersObjectArray = participants;
let containerAllMonstersBox = document.querySelectorAll("#containerAllMonstersBox .monsterCard");
let chosenCardCounter = 0;


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
    let monsterPicNum = Math.ceil(Math.random() * 16)
    return `./images/monster${monsterPicNum}.png`
}



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

function CreateAllMonsters(monstersArray) {
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



//filtrera säsong 1
//filtrera alla participants 206
//ta ett monsters poäng under en säsong / medelvärdet

function getMonstersTotalScoreFromId(reqId) { ///stödfunktion
    let totalScore = 0;
    let pointsArrayForId = seasons.filter(year => year.year == 1)
        .flatMap(season => season.competitionDays)
        .flatMap(day => day.events)
        .flatMap(events => events.scores)
        .filter(score => score.participantId == reqId)

    totalScore = pointsArrayForId.reduce((sum, s) => sum + s.score, 0)
    totalScore = Math.round(totalScore / pointsArrayForId.length);
    console.log(totalScore)
    return totalScore;

}


function getMonsterAverageScore(requestedSeason, requestedParticipantIdAndColor) {
    let compareScoreArray = requestedParticipantIdAndColor; // loopa ingenom array med id färg, lägg till score och season i arrayen 

    console.log(requestedParticipantIdAndColor)
    console.log(requestedSeason)
    console.log(compareScoreArray)
    requestedParticipantIdAndColor.forEach(participant => {
        let totalScore = 0;
        let pointsArrayForId = seasons.filter(year => year.year == requestedSeason)
            .flatMap(season => season.competitionDays)
            .flatMap(day => day.events)
            .flatMap(events => events.scores)
            .filter(score => score.participantId == participant.id)

        console.log(pointsArrayForId)
        totalScore = pointsArrayForId.reduce((sum, s) => sum + s.score, 0)
        totalScore = pointsArrayForId.length > 0 ? Math.round(totalScore / pointsArrayForId.length) : 0;
        console.log(totalScore)
        participant.score = totalScore;
    })

    return compareScoreArray
}


function CompareCreatures() {
    let compareButton = document.getElementById("compareButton");
    compareButton.addEventListener("click", () => {
        console.log("klickk")
        console.log(GetArrayFromChosenCards());
        console.log(GetSeasonFromDropown())

        let arrayFromChosenCardsIdAndColor = GetArrayFromChosenCards()
        let seasonFromDropDown = GetSeasonFromDropown()
        let seasonFromDropDownNum = Number(seasonFromDropDown[seasonFromDropDown.length - 1])
        console.log(seasonFromDropDownNum)
        // getMonsterAverageScore(seasonFromDropDownNum, arrayFromChosenCardsIdAndColor)
        let arrayToCompare = getMonsterAverageScore(seasonFromDropDownNum, arrayFromChosenCardsIdAndColor)
        console.log(arrayToCompare)
        CreateChartSvg(arrayToCompare)
    })
}

//hämta id,färg  från chosen cards
function GetArrayFromChosenCards() {
    let arrayWithIdToCompare = []
    let activecards = document.querySelectorAll("#containerAllMonstersBox .monsterCard.chosenMonsterCard")
    activecards.forEach(card => {
        const monsterId = Number(card.querySelector(".idName #monsterId").textContent);
        const colorRgb = card.querySelector(".colorLine").style.backgroundColor
        console.log(colorRgb)
        arrayWithIdToCompare.push({ id: monsterId, rgb: colorRgb })
        console.log(arrayWithIdToCompare);
        // CreateScoresChart(arrayWithIdToCompare)
    });
    return arrayWithIdToCompare;
}


function GetSeasonFromDropown() {
    let seasonsDropDown = document.getElementById("seasonsDropDown");
    let chosenSeasonToCompare = seasonsDropDown.value;
    return chosenSeasonToCompare;
}

function CreateChartSvg(compareScoreArray) {
    let data = compareScoreArray;

    d3.select("#pointsDistrubution").select("svg").remove();
    let scoreBox = document.getElementById("pointsDistrubution")

    const margin = { top: 40, right: 20, bottom: 30, left: 60 },
        width = scoreBox.offsetWidth - margin.left - margin.right,
        height = scoreBox.offsetHeight - margin.top - margin.bottom;

    // Skapa SVG
    let svg = d3.select("#pointsDistrubution")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 3. X-axel: Baserad direkt på ID (Sträng-konverterat för scaleBand)
    const x = d3.scaleBand()
        .domain(data.map(d => `ID: ${d.id}`))
        .range([0, width])
        .padding(0.4); // Justera bredden på staplarna här (högre tal = smalare staplar)

    // 4. Y-axel: Låst till 800 - 2000
    const y = d3.scaleLinear()
        .domain([800, 1600])
        .range([height, 0]);

    // 5. Rita axlarna
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(6));

    // 6. Rita de två staplarna
    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(`ID: ${d.id}`))
        // Hindrar stapeln från att ritas utanför om score råkar vara under 800
        .attr("y", d => y(Math.max(800, d.score)))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(Math.max(800, d.score)))
        .attr("fill", d => d.rgb)
        .attr("rx", 4) // Snygga, lätt rundade hörn i toppen
        .attr("opacity", 0.8)
        .attr("stroke", "#5E9F99")
        // .attr("stroke-width", 3)
        .attr("stdDeviation", 0.5)
        .attr("flood-color", "#5E9F99")




}
//du behöver en array med id och average score för säsongen

CreateAllMonsters(allMonstersObjectArray);
ChosenCardClickEvent();
InputFieldClickEvent();
ClearSectionClickEvent();
BackButtonClickEvent();
GetArrayFromChosenCards();
CompareCreatures();
SelectRandomMonsterButton();

