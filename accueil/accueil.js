const menuButton = document.getElementById("menuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");

menuButton.addEventListener("click", function () {
    sideMenu.classList.add("open");
    menuOverlay.classList.add("open");
});

closeMenuButton.addEventListener("click", function () {
    sideMenu.classList.remove("open");
    menuOverlay.classList.remove("open");
});

menuOverlay.addEventListener("click", function () {
    sideMenu.classList.remove("open");
    menuOverlay.classList.remove("open");
});
// =========================
// NAVIGATION DU MENU
// =========================

const menuProfile = document.getElementById("menuProfile");

menuProfile.addEventListener("click", function () {

    const piUsername = localStorage.getItem("pi_username");

    if (piUsername) {
        window.location.href = "../profil/profil.html";
    } else {
        window.location.href = "../connexion/connexion.html";
    }

});