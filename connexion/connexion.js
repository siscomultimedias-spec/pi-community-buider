const piLoginButton = document.getElementById("piLoginButton");
const visitorLoginButton = document.getElementById("visitorLoginButton");
/* INITIALISATION PI NETWORK */

Pi.init({
    version: "2.0",
    sandbox: true
});
/* CONNEXION PI */

piLoginButton.addEventListener("click", async function () {

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

console.log("Utilisateur Pi :", auth.user);
console.log("Access Token :", auth.accessToken);

// Mémoriser le Pioneer connecté
localStorage.setItem("pi_username", auth.user.username);

// =========================
// ENREGISTREMENT DU PIONEER
// DANS SUPABASE
// =========================

const { data: existingUser, error: searchError } = await supabaseClient
    .from("users")
    .select("id")
    .eq("username", auth.user.username)
    .maybeSingle();

if (searchError) {
    console.error("Erreur recherche utilisateur :", searchError);
} else if (existingUser) {

    // L'utilisateur existe déjà
    const { error: updateError } = await supabaseClient
        .from("users")
        .update({
            user_type: "pioneer"
        })
        .eq("id", existingUser.id);

    if (updateError) {
        console.error("Erreur mise à jour Pioneer :", updateError);
    }

} else {

    // Première connexion du Pioneer
    const { error: insertError } = await supabaseClient
        .from("users")
        .insert([
            {
                username: auth.user.username,
                user_type: "pioneer"
            }
        ]);

    if (insertError) {
        console.error("Erreur création Pioneer :", insertError);
    }
}

alert(
    "Bienvenue " + auth.user.username
);


} catch (error) {

    console.error("Erreur :", error);

    alert(
        "Erreur : " + (error.message || error)
    );

}
});





/* CONNEXION NON-PIONNIER */

visitorLoginButton.addEventListener("click", function () {

    alert("La connexion des membres invités sera activée prochainement.");

});