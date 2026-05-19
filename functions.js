function revealCurrentPage(page) {
    pages.forEach(p => {
        if(document.querySelector(`#${page}`) == p) {
            classList.remove("hide")
        } else {
            classList.add("hide")
        }
    })
}


storyModeButton.addEventListener(e =>{
    
    firstPage.classList.add("hide")
    storyPage.classList.remove("hide")

})

// function fadePage(currentPage, nextPage) {
//     if(currentPage == "storyPage"){
//         storyModeButton.addEventListener()

//     }

    

// }