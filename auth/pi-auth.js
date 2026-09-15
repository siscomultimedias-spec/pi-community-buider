// ========================================
// AUTHENTIFICATION PI NETWORK
// PI COMMUNITY BUILDER
// ========================================

Pi.init({
    version: "2.0",
    sandbox: true
});

// Identification du Pioneer
async function authenticatePioneer() {

    try {

        const auth = await Pi.authenticate(
            ["username"],
            function (payment) {
                console.log("Paiement en attente :", payment);
            },
            function (payment) {
                console.log("Paiement annulé :", payment);
            }
        );

        console.log("Pioneer identifié :", auth.user);

        // Enregistrer le nom Pi
        localStorage.setItem(
            "pi_username",
            auth.user.username
        );

        return auth.user;

    } catch (error) {

        console.log(
            "Aucun Pioneer authentifié :",
            error
        );

        return null;
    }
}