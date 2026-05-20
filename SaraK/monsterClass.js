export class monsterCardClass {

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

