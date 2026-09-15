// ==========================================
// PI COMMUNITY BUILDER
// RECHERCHE AUTOMATIQUE DES GROUPES
// ==========================================


// ------------------------------------------
// RECHERCHER UN GROUPE
// ------------------------------------------

async function searchGroups(search) {

    const groupFound = document.getElementById("groupFound");

    // Nettoyer si la recherche est vide
if (!search || search.trim().length < 2) {
    groupFound.style.display = "none";
    return;
}
    const term = search.trim();

    try {

        // Recherche dans Supabase
        const { data, error } = await window.supabaseClient
            .from("groups")
            .select("*")
.or(
    `name.ilike.${term}%,country.ilike.${term}%,city.ilike.${term}%,location.ilike.${term}%`
)
            .limit(20);


        // ------------------------------------------
        // ERREUR SUPABASE
        // ------------------------------------------

        if (error) {

            console.error("Erreur Supabase :", error);

            groupFound.style.display = "block";

            document.getElementById("foundName").innerHTML =
                "⚠️ Erreur Supabase";

            document.getElementById("foundType").innerHTML =
                error.message;

            document.getElementById("foundCountry").innerHTML =
                "";

            document.getElementById("foundMembers").innerHTML =
                "";

            return;
        }


        // ------------------------------------------
        // AUCUN GROUPE
        // ------------------------------------------

        if (!data || data.length === 0) {

            groupFound.style.display = "block";

            document.getElementById("foundName").innerHTML =
                "❌ Aucun groupe trouvé";

            document.getElementById("foundType").innerHTML =
                "";

            document.getElementById("foundCountry").innerHTML =
                "";

            document.getElementById("foundMembers").innerHTML =
                "";

            return;
        }


        // ------------------------------------------
        // PREMIER GROUPE TROUVÉ
        // ------------------------------------------

        const group = data[0];

        groupFound.style.display = "block";


        // Nom
        document.getElementById("foundName").innerHTML =
            "👥 " + (group.name || "");


        // Type
        document.getElementById("foundType").innerHTML =
            "📌 Type : " + (group.type || "");


        // Pays
        document.getElementById("foundCountry").innerHTML =
            "🌍 Pays : " + (group.country || "");


        // Ville / localisation
        if (group.city || group.location) {

            document.getElementById("foundType").innerHTML +=
                "<br>📍 " +
                (group.city || group.location || "");

        }


        // Nombre de membres
        document.getElementById("foundMembers").innerHTML =
            "👥 Membres : " + (group.members || 0);

    }

    catch (error) {

        console.error("Erreur :", error);

        groupFound.style.display = "block";

        document.getElementById("foundName").innerHTML =
            "⚠️ Erreur lors de la recherche";

        document.getElementById("foundType").innerHTML =
            error.message || "Erreur inconnue";

        document.getElementById("foundCountry").innerHTML =
            "";

        document.getElementById("foundMembers").innerHTML =
            "";
    }
}


// ------------------------------------------
// RECHERCHE AUTOMATIQUE
// ------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.getElementById("searchButton");


    // Recherche automatique pendant la saisie
    if (searchInput) {

        searchInput.addEventListener("input", function () {

            searchGroups(this.value);

        });
    }


    // Le bouton 🔍 reste également fonctionnel
    if (searchButton) {

        searchButton.addEventListener("click", function () {

            searchGroups(searchInput.value);

        });
    }

});