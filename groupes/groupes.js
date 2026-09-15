// ========================================
// PI COMMUNITY BUILDER
// AFFICHAGE DES GROUPES
// ========================================

const groupsList = document.getElementById("groupsList");
const groupsCounter = document.getElementById("groupsCounter");
const filterButtons = document.querySelectorAll(".filter-button");

let allGroups = [];
let currentType = "Groupe Pays";


// ========================================
// CHARGER LES GROUPES
// ========================================

async function loadGroups() {

    try {

        const { data, error } = await supabaseClient
            .from("groups")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {

            console.error("Erreur Supabase :", error);

            groupsList.innerHTML =
                "<p class='loading'>❌ Impossible de charger les groupes.</p>";

            return;
        }

        allGroups = data || [];

        displayGroups();

    } catch (error) {

        console.error("Erreur :", error);

        groupsList.innerHTML =
            "<p class='loading'>❌ Une erreur est survenue.</p>";
    }
}


// ========================================
// AFFICHER LES GROUPES
// ========================================

function displayGroups() {

    const filteredGroups = allGroups.filter(function (group) {
        return group.type === currentType;
    });

    // Mise à jour du compteur
    groupsCounter.textContent =
        "👥 " + filteredGroups.length;

    // Aucun groupe
    if (filteredGroups.length === 0) {

        groupsList.innerHTML =
            "<p class='loading'>Aucun groupe de ce type n'a encore été créé.</p>";

        return;
    }

    groupsList.innerHTML = "";

    filteredGroups.forEach(function (group) {

        let locationText = "";

        if (group.type === "Groupe Ville") {
            locationText =
                "🏙️ Ville : " + (group.city || "");
        }

        if (group.type === "Groupe Village") {
            locationText =
                "🏘️ Village : " + (group.village || "");
        }

        if (group.type === "Groupe Famille") {
            locationText =
                "👨‍👩‍👧‍👦 Famille : " + (group.family || "");
        }

        if (group.type === "Groupe Communauté") {
            locationText =
                "🤝 Communauté : " + (group.community || "");
        }


        const card = document.createElement("div");

        card.className = "group-card";

        card.innerHTML = `
            <span class="group-type">
                ${group.type || ""}
            </span>

            <h2>
                ${group.name || ""}
            </h2>

            <p class="group-info">
                🌍 Pays : ${group.country || ""}
            </p>

            ${
                locationText
                    ? `<p class="group-info">${locationText}</p>`
                    : ""
            }

            <p class="group-info">
                👥 Membres : ${group.members || 0}
            </p>

<button class="join-button" data-group-id="${group.id}">
    Rejoindre le groupe
</button>
        `;

        groupsList.appendChild(card);
    });
    updateJoinButtons();
}
// ========================================
// REJOINDRE UN GROUPE
// ========================================

groupsList.addEventListener("click", async function (event) {

    if (!event.target.classList.contains("join-button")) {
        return;
    }

    const groupId = event.target.dataset.groupId;

    // Si l'utilisateur est déjà membre,
    // ouvrir directement l'espace du groupe
    if (event.target.classList.contains("member-button")) {

        window.location.href =
            "espace-groupe/espace-groupe.html?id=" + groupId;

        return;
    }

    const piUsername = localStorage.getItem("pi_username");

    // Vérifier la connexion Pi
    if (!piUsername) {
        alert(
            "⚠️ Vous devez d'abord vous connecter avec votre compte Pi."
        );
        return;
    }

    try {

        // Rechercher l'utilisateur dans la table users
        const { data: user, error: userError } = await supabaseClient
            .from("users")
            .select("id, username")
            .eq("username", piUsername)
            .single();

        if (userError || !user) {

            console.error(
                "Utilisateur introuvable :",
                userError
            );

            alert(
                "❌ Votre compte Pi n'est pas encore enregistré dans PI COMMUNITY BUILDER."
            );

            return;
        }

        // Ajouter le membre au groupe
        const { error: memberError } = await supabaseClient
            .from("group_members")
            .insert({
                group_id: groupId,
                username: piUsername,
                role: "member",
                user_id: user.id
            });

        if (memberError) {

            // Déjà membre
            if (memberError.code === "23505") {

                alert(
                    "ℹ️ Vous êtes déjà membre de ce groupe."
                );

                return;
            }

            console.error(
                "Erreur ajout membre :",
                memberError
            );

            alert(
                "❌ Impossible de rejoindre ce groupe."
            );

            return;
        }

// Mettre à jour le bouton
event.target.textContent = "🚪 Entrer dans le groupe";
event.target.disabled = false;
event.target.classList.add("member-button");

alert(
    "✅ Vous avez rejoint le groupe avec succès !"
);

    } catch (error) {

        console.error(
            "Erreur :",
            error
        );

        alert(
            "❌ Une erreur est survenue."
        );
    }
});
// ========================================
// VÉRIFIER LES GROUPES DONT LE MEMBRE FAIT PARTIE
// ========================================

async function updateJoinButtons() {

    const piUsername = localStorage.getItem("pi_username");

    if (!piUsername) {
        return;
    }

    try {

        // Trouver l'utilisateur connecté
        const { data: user, error: userError } = await supabaseClient
            .from("users")
            .select("id")
            .eq("username", piUsername)
            .single();

        if (userError || !user) {
            return;
        }

        // Récupérer ses groupes
        const { data: memberships, error: membershipError } =
            await supabaseClient
                .from("group_members")
                .select("group_id")
                .eq("user_id", user.id);

        if (membershipError) {

            console.error(
                "Erreur lors de la vérification des adhésions :",
                membershipError
            );

            return;
        }

        const memberGroupIds = (memberships || []).map(function (membership) {
            return String(membership.group_id);
        });

        // Mettre à jour les boutons
        document.querySelectorAll(".join-button").forEach(function (button) {

            const groupId = String(button.dataset.groupId);

            if (memberGroupIds.includes(groupId)) {

                button.textContent = "✅ Vous êtes membre";
                button.disabled = true;
                button.classList.add("member-button");

            }

        });

    } catch (error) {

        console.error(
            "Erreur de vérification :",
            error
        );
    }
}
// ========================================
// FILTRES
// ========================================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentType = button.dataset.type;

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayGroups();
    });

});


// ========================================
// DÉMARRAGE
// ========================================

loadGroups();