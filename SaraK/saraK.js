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

})

function getRandomColorGenerator() { //generera en färg till monster
    let colorBar1 = document.getElementById("colorBar1")
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colorBar1.style.backgroundColor = `${color}`
}

function randomPictureGenerator() { //generera en random monster URL
    let monsterPicNum = Math.ceil(Math.random() * 3)
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
//4. koppla samman grafen, medelvärde av poängen baserat på hur många gånger de tävlat alla tävlor olika måpnga gånger
