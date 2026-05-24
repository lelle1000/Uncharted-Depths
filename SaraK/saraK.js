// import { monsterCardClass } from "monsterClass.js";

const mainContainer = document.getElementById("comparePage")
let allMonstersObjectArray = participants;
console.log(participants)
let containerAllMonstersBox = document.querySelectorAll("#containerAllMonstersBox .monsterCard");
let chosenCardCounter = 0;
let svg, xScale, yScale, xAxisGroup, yAxisGroup, chartHeight, chartWidth, marginCompareChart;


class MonsterCardClass {

    static allMonsters = [];

    constructor(data) {
        this.name = data.name;
        this.id = data.id;
        this.color = colorGenerator();
        this.imgUrl = randomPictureGenerator();

        MonsterCardClass.allMonsters.push(this);
    }
    static getAllMonsters() {
        return MonsterCardClass.allMonsters;
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
    clearSelectionButton.addEventListener("click", () => {
        containerAllMonstersBox = document.querySelectorAll("#containerAllMonstersBox .monsterCard");

        svgContainer.selectAll("polygon").remove()

        let svg = d3.select("#pointsDistrubution")
        svg.selectAll("rect").remove()

        chosenCardCounter = 0;

        containerAllMonstersBox.forEach(card => {
            console.log(card)
            if (card.classList.contains("chosenMonsterCard")) {

                card.classList.remove("chosenMonsterCard")
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
    const selectRandomButton = document.getElementById("selectRandomButton")
    selectRandomButton.addEventListener("click", event => {
        let participantForTheSeasonIds = GetAllParticipantsForTheSeasonChangeEvent();
        console.log(participantForTheSeasonIds)

        chosenCardCounter = 0;
        let allMonsterCards = document.querySelectorAll("#containerAllMonstersBox .monsterCard")
        allMonsterCards.forEach(card => {
            card.classList.remove("chosenMonsterCard")

        })
        for (let i = 0; i < 2; i++) {
            let randomNumber = RandomNumber()
            if (!allMonsterCards[randomNumber] || allMonsterCards[randomNumber].classList.contains("chosenMonsterCard")) {
                i--;
                continue;
            }
            else {
                allMonsterCards[randomNumber]
                allMonsterCards[randomNumber].classList.add("chosenMonsterCard")
                chosenCardCounter++;
            }
        }
    })
}

function RandomNumber() {
    let allMonstersCurrentSeason = GetArrayOfParticipantsSeason().length
    return Math.floor(Math.random() * allMonstersCurrentSeason)
}

function CreateAllMonsters(monstersArray) {

    let monsterCards = [];

    for (let i = 0; i < monstersArray.length; i++) {

        let monster1 = new MonsterCardClass(monstersArray[i]);

        let monsterCard = document.createElement("div");
        monsterCard.classList.add("monsterCard");

        monsterCard.innerHTML = `
            <p class="monsterName">${monster1.name}</p>
            <img src="${monster1.imgUrl}" class="monsterImage">
            <div class="colorLine"></div>
            <p class="idName">
                Id : <span class="monsterId">${monster1.id}</span>
            </p>
        `;

        let colorLine = monsterCard.querySelector(".colorLine");
        colorLine.style.backgroundColor = monster1.color;

        monsterCards.push(monsterCard);
    }

    return monsterCards;
}



function ShowAllMonsters(participantsForTheSeason) {

    let containerAllMonstersBoxId = document.getElementById("containerAllMonstersBox")
    containerAllMonstersBoxId.innerHTML = ``

    let monstersArray = MonsterCardClass.getAllMonsters()

    let arrayParticipantsSeason;
    console.log(participantsForTheSeason)
    console.log(monstersArray)

    if (!participantsForTheSeason) {
        arrayParticipantsSeason = monstersArray.map(monster => monster.id);
    }
    else {
        arrayParticipantsSeason = participantsForTheSeason;
    }
    console.log(arrayParticipantsSeason)

    monstersArray.forEach(monster => {
        if (arrayParticipantsSeason.includes(monster.id)) {

            let monsterCard = document.createElement("div");
            monsterCard.classList.add("monsterCard")
            monsterCard.innerHTML = `
           <p class="monsterName">${monster.name}</p>
           <img src="${monster.imgUrl}" class="monsterImage">
           <div class="colorLine"> </div>
           <p class="idName"> Id : <span id="monsterId">${monster.id}</span></p>
           `
            monsterCard.querySelector(".colorLine").style.backgroundColor = monster.color;
            containerAllMonstersBoxId.appendChild(monsterCard);
        }
    })
    ChosenCardClickEvent();
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
    containerAllMonstersBox.forEach(card => {
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


function getMonsterAverageScore(requestedSeason, requestedParticipantIdAndColor) {
    let compareScoreArray = requestedParticipantIdAndColor;

    requestedParticipantIdAndColor.forEach(participant => {
        let totalScore = 0;
        let pointsArrayForId = seasons.filter(year => year.year == requestedSeason)
            .flatMap(season => season.competitionDays)
            .flatMap(day => day.events)
            .flatMap(events => events.scores)
            .filter(score => score.participantId == participant.id)


        totalScore = pointsArrayForId.reduce((sum, s) => sum + s.score, 0)
        totalScore = pointsArrayForId.length > 0 ? Math.round(totalScore / pointsArrayForId.length) : 0;
        participant.score = totalScore;
    })

    return compareScoreArray
}


function CompareCreatures() {
    let compareButton = document.getElementById("compareButton");
    compareButton.addEventListener("click", () => {

        svgContainer.selectAll("polygon").remove()

        console.log("klickk")
        console.log(GetSeasonFromDropown())

        let arrayFromChosenCardsIdAndColor = GetArrayFromChosenCards()
        console.log(arrayFromChosenCardsIdAndColor)
        let seasonFromDropDown = GetSeasonFromDropown()
        let seasonFromDropDownNum = Number(seasonFromDropDown.split("season")[1])
        console.log(seasonFromDropDownNum)
        let arrayToCompare = getMonsterAverageScore(seasonFromDropDownNum, arrayFromChosenCardsIdAndColor)
        console.log(arrayToCompare)
        if (arrayToCompare.length != 2) {
            return;
        }
        changeChartStats(arrayToCompare)

        let participantId1 = arrayFromChosenCardsIdAndColor[0].id
        let color1 = arrayFromChosenCardsIdAndColor[0].rgb

        let participantId2 = arrayFromChosenCardsIdAndColor[1].id
        let color2 = arrayFromChosenCardsIdAndColor[1].rgb


        drawRadarChart(getParticipantSkills(participantId1, seasonFromDropDownNum), color1)
        drawRadarChart(getParticipantSkills(participantId2, seasonFromDropDownNum), color2)
    })
}

function GetArrayFromChosenCards() {
    let arrayWithIdToCompare = []
    let activecards = document.querySelectorAll("#containerAllMonstersBox .monsterCard.chosenMonsterCard")
    activecards.forEach(card => {
        const monsterId = Number(card.querySelector(".idName #monsterId").textContent);
        const colorRgb = card.querySelector(".colorLine").style.backgroundColor
        arrayWithIdToCompare.push({ id: monsterId, rgb: colorRgb })
        console.log(arrayWithIdToCompare);
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

    marginCompareChart = { top: 10, right: 20, bottom: 30, left: 60 },
        chartWidth = scoreBox.offsetWidth - marginCompareChart.left - marginCompareChart.right,
        chartHeight = scoreBox.offsetHeight - marginCompareChart.top - marginCompareChart.bottom;

    svg = d3.select("#pointsDistrubution")
        .append("svg")
        .attr("width", chartWidth + marginCompareChart.left + marginCompareChart.right)
        .attr("height", chartHeight + marginCompareChart.top + marginCompareChart.bottom)
        .append("g")
        .attr("transform", `translate(${marginCompareChart.left},${marginCompareChart.top})`);

    xScale = d3.scaleBand()
        .range([0, chartWidth])
        .padding(0.4);

    yScale = d3.scaleLinear()
        .domain([800, 1600])
        .range([chartHeight, 0]);

    xAxisGroup = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(6));

}

function changeChartStats(compareScoreArray) {
    let data = compareScoreArray;
    console.log(data)

    xScale.domain(data.map(data => `ID: ${data.id}`));
    xAxisGroup.call(d3.axisBottom(xScale));

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", data => xScale(`ID: ${data.id}`))
        .attr("y", data => yScale(Math.max(800, data.score)))
        .attr("width", xScale.bandwidth())
        .attr("height", data => chartHeight - yScale(Math.max(800, data.score)))
        .attr("fill", data => data.rgb)
        .attr("rx", 4)
        .attr("opacity", 0.8)
        .attr("stroke", "#5E9F99")
        .attr("stdDeviation", 0.5)
        .attr("flood-color", "#5E9F99")

    console.log("score:", data.map(d => d.score));
    console.log("y:", data.map(d => yScale(d.score)));

}

function GetAllParticipantsForTheSeasonChangeEvent() {
    let seasonsDropDown = document.getElementById("seasonsDropDown");
    seasonsDropDown.addEventListener("change", () => {
        let chosenSeasonToCompare = Number(seasonsDropDown.value.split("season")[1]);
        console.log(chosenSeasonToCompare)
        if (!chosenSeasonToCompare) {
            ShowAllMonsters(null)
            console.log("du har inte valt säsong")
        }
        else {

            let currentSeasonMonstersIdArray = seasons.filter(season => season.year == chosenSeasonToCompare)
                .flatMap(element => element.coaches)
                .map(coachesElement => coachesElement.participantId)

            console.log(currentSeasonMonstersIdArray);
            ShowAllMonsters(currentSeasonMonstersIdArray)
            return currentSeasonMonstersIdArray

        }
    })

}

function GetArrayOfParticipantsSeason() {
    let seasonsDropDown = document.getElementById("seasonsDropDown");
    let chosenSeasonToCompare = Number(seasonsDropDown.value.split("season")[1]);
    if (!chosenSeasonToCompare) {
        return null;
    }
    else {
        let currentSeasonMonstersIdArray = seasons.filter(season => season.year == chosenSeasonToCompare)
            .flatMap(element => element.coaches)
            .map(coachesElement => coachesElement.participantId)

        console.log(currentSeasonMonstersIdArray);
        return currentSeasonMonstersIdArray
    }

}

CreateAllMonsters(allMonstersObjectArray);
ShowAllMonsters();
ChosenCardClickEvent();
InputFieldClickEvent();
ClearSectionClickEvent();
BackButtonClickEvent();
GetArrayFromChosenCards();
CompareCreatures();
SelectRandomMonsterButton();
GetAllParticipantsForTheSeasonChangeEvent();
CreateChartSvg();

