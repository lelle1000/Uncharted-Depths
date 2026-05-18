function revealCurrentPage(page) {
    allPages.forEach(p => {
        if(page == p) {
            classList.remove("hide")
        } else {
            classList.add("hide")
        }
    })
}