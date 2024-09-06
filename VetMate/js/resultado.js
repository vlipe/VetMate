const cardImg = document.querySelector(".card-container")

window.onload = () => {
    setTimeout(() => {
        document.querySelector(".card-container").classList.remove("loading");
    }, 2000);
}