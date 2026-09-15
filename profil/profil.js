// ========================================
// PROFIL UTILISATEUR
// PI COMMUNITY BUILDER
// ========================================

const profileUsername = document.getElementById("profileUsername");
const profileStatus = document.getElementById("profileStatus");
const profileCountry = document.getElementById("profileCountry");
const profileCity = document.getElementById("profileCity");

const groupsCount = document.getElementById("groupsCount");
const ideasCount = document.getElementById("ideasCount");
const invitationsCount = document.getElementById("invitationsCount");


// =========================
// CHARGEMENT DU PROFIL
// =========================

async function loadProfile() {

    try {

        // Récupérer le Pioneer connecté
        const piUsername = localStorage.getItem("pi_username");

        if (!piUsername) {

            profileUsername.textContent = "Non connecté";
            profileStatus.textContent = "Non déterminé";
            profileCountry.textContent = "Non renseigné";
            profileCity.textContent = "Non renseignée";

            return;
        }


        // Rechercher l'utilisateur dans Supabase
        const { data: user, error } = await supabaseClient
            .from("users")
            .select("username, user_type, country, city")
            .eq("username", piUsername)
            .maybeSingle();


        if (error) {

            console.error(
                "Erreur chargement profil :",
                error
            );

            profileUsername.textContent = piUsername;
            profileStatus.textContent = "Pioneer";

            return;
        }


        if (!user) {

            profileUsername.textContent = piUsername;
            profileStatus.textContent = "Pioneer";

            return;
        }


        // =========================
        // AFFICHAGE DES INFORMATIONS
        // =========================

        profileUsername.textContent =
            user.username || piUsername;


        if (user.user_type === "pioneer") {
            profileStatus.textContent = "Pioneer";
        } else {
            profileStatus.textContent =
                user.user_type || "Non déterminé";
        }


        profileCountry.textContent =
            user.country || "Non renseigné";


        profileCity.textContent =
            user.city || "Non renseignée";


        // Pour le moment ces statistiques
        // restent à 0.
        groupsCount.textContent = "0";
        ideasCount.textContent = "0";
        invitationsCount.textContent = "0";


    } catch (error) {

        console.error(
            "Erreur lors du chargement du profil :",
            error
        );

    }

}


// =========================
// DÉMARRAGE
// =========================

loadProfile();