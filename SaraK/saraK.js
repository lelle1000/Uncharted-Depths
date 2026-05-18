const backArrow = document.getElementById("backArrow")
const main = document.querySelector("main")


const containerAllMonstersBox = document.querySelectorAll("#containerAllMonstersBox .monsterCard");
const clearSelectionButton = document.getElementById("clearSelectionButton")
const selectRandomButton = document.getElementById("selectRandomButton")
let chosenCardCounter = 0;

clearSelectionButton.addEventListener("click", () => { //clear Selection av monsters knapp
    console.log(chosenCardCounter)
    containerAllMonstersBox.forEach(card => {
        if (card.classList.contains("chosenMonsterCard")) {
            card.classList.toggle("chosenMonsterCard")
        }
        chosenCardCounter = 0;
    })
})

containerAllMonstersBox.forEach(card => { ///  Select card den du klickar på
    card.addEventListener("click", event => {
        chosenCardCounter++;
        if (chosenCardCounter <= 2)
            event.target.classList.toggle("chosenMonsterCard")
    })
})


backArrow.addEventListener("click", () => { // gå tillbaka till landing page
    console.log("Gå till Landing page ->")
    document.body.innerHTML = `
        <main id="landingPageContainer">
        <div id="topSectionLandingPage">
            <div id="topCreaturesContainer">
                    
            </div>
            <div id="topCreatureStats">

            </div>
        </div>

        <div id="bottomSectionLandingPage">
            <div id="scoreboardContainer">
                <div id="disciplineButtons">
                    <button class="disciplineButton" id="fightingDiscipline" data-disciplineid="5">Fighting</button>
                    <button class="disciplineButton" id="raceDiscipline" data-disciplineid="4">Race</button>
                    <button class="disciplineButton" id="hidenseekDiscipline" data-disciplineid="3">Hide n Seek</button>
                    <button class="disciplineButton" id="mazeDiscipline" data-disciplineid="1">Maze</button>
                    <button class="disciplineButton" id="huntDiscipline" data-disciplineid="2">Hunt</button>
                    <button class="disciplineButton" id="calcRatesButton">Calculate Rates</button>
                </div>
                <div id="scoreboardBottomSection">
                    <div id="scoreboardSeasonContainer">
                        <p>Seasons</p>
                        <button class="seasonButton" id="season1Landing" data-currentseason="1">1</button>
                        <button class="seasonButton" id="season2Landing" data-currentseason="2">2</button>
                        <button class="seasonButton" id="season3Landing" data-currentseason="3">3</button>
                        <button class="seasonButton" id="season4Landing" data-currentseason="4">4</button>
                        <button class="seasonButton" id="season5Landing" data-currentseason="5">5</button>
                        <button class="seasonButton" id="season6Landing" data-currentseason="6">6</button>
                        <button class="seasonButton" id="season7Landing" data-currentseason="7">7</button>
                        <button class="seasonButton" id="season8Landing" data-currentseason="8">8</button>
                        <button class="seasonButton" id="season9Landing" data-currentseason="9">9</button>
                        <button class="seasonButton" id="season10Landing" data-currentseason="10">10</button>
                    </div>
                    <div id="scoreboardStatsContainer">
                        <div id="scoreboardListingTitles">
                            <div>Placement</div>
                            <div>Creature</div>
                            <div>Points</div>
                        </div>
                        <div id="creatureScoreboardStats">
                        </div>
                    </div>
                </div>
            </div>

    </main>
       `
})

function getRandomColorGenerator() { //generera en färg till monster
    let colorBar1 = document.getElementById("colorBar1")
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colorBar1.style.backgroundColor = `${color}`
}

function randomPictureGenerator() {
    let monsterPicNum = Math.ceil(Math.random() * 3)
    console.log(monsterPicNum)

    return picUrl = `../images/monster${monsterPicNum}.png`
}
selectRandomButton.addEventListener("click", () => {
    console.log(randomPictureGenerator())
    randomPictureGenerator();
})

getRandomColorGenerator();



//skapa klass för varje kort 
//namn, id, bild, 


//att göra på sidan
//1. koppla monster till card, göra en klass?
//2. söka på monsters id 
//3. koppla samman färger
//4. koppla samman grafen