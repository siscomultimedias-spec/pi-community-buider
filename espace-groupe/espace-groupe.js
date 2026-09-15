// ========================================
// ESPACE DU GROUPE
// RÉCUPÉRATION DE L'ID
// ========================================

const urlParams = new URLSearchParams(window.location.search);

const groupId = urlParams.get("id");

console.log("ID du groupe :", groupId);
// ========================================
// CHARGER LE GROUPE
// ========================================

async function loadGroup() {

    if (!groupId) {
        console.error("Aucun ID de groupe dans l'URL.");
        return;
    }

    try {

        const { data: group, error } = await supabaseClient
            .from("groups")
            .select("*")
            .eq("id", groupId)
            .single();

        if (error) {
            console.error("Erreur lors du chargement du groupe :", error);
            return;
        }

        if (!group) {
            console.error("Groupe introuvable.");
            return;
        }

        console.log("Groupe chargé :", group);
// Afficher les informations du groupe
document.getElementById("groupType").textContent =
    group.type || "Groupe";

document.getElementById("groupName").textContent =
    group.name || "Nom du groupe";

document.getElementById("groupLocation").textContent =
    "🌍 " + (group.location || "Localisation non renseignée");

document.getElementById("memberCount").textContent =
    group.members || 0;
    } catch (error) {

        console.error("Erreur :", error);

    }
}
loadGroup();