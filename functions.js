function revealCurrentPage(page) {
    pages.forEach(p => {
        if(document.querySelector(`#${page}`) == p) {
            classList.remove("hide")
        } else {
            classList.add("hide")
        }
    })
}
