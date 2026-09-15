// ========================================
// CRÉATION DE GROUPE
// PI COMMUNITY BUILDER
// ========================================

const groupType = document.getElementById("groupType");
const groupForm = document.getElementById("groupForm");
const createButton = document.getElementById("createButton");
const successModal = document.getElementById("successModal");
const successButton = document.getElementById("successButton");

successButton.addEventListener("click", function () {
    successModal.style.display = "none";
});

// ========================================
// AFFICHAGE DES CHAMPS SELON LE TYPE
// ========================================

groupType.addEventListener("change", function () {

    const type = groupType.value;

    if (type === "") {
        groupForm.style.display = "none";
        return;
    }

    groupForm.style.display = "block";

    document.getElementById("cityField").style.display = "none";
    document.getElementById("villageField").style.display = "none";
    document.getElementById("familyField").style.display = "none";
    document.getElementById("communityField").style.display = "none";

    if (type === "Groupe Ville") {
        document.getElementById("cityField").style.display = "block";
    }

    if (type === "Groupe Village") {
        document.getElementById("villageField").style.display = "block";
    }

    if (type === "Groupe Famille") {
        document.getElementById("familyField").style.display = "block";
    }

    if (type === "Groupe Communauté") {
        document.getElementById("communityField").style.display = "block";
    }
});


// ========================================
// CRÉATION DU GROUPE
// ========================================

createButton.addEventListener("click", async function () {

    const type = groupType.value;
    const name = document.getElementById("groupName").value.trim();
    const country = document.getElementById("countryName").value.trim();

    let city = "";
    let village = "";
    let family = "";
    let community = "";

    if (type === "Groupe Ville") {
        city = document.getElementById("cityName").value.trim();
    }

    if (type === "Groupe Village") {
        village = document.getElementById("villageName").value.trim();
    }

    if (type === "Groupe Famille") {
        family = document.getElementById("familyName").value.trim();
    }

    if (type === "Groupe Communauté") {
        community = document.getElementById("communityName").value.trim();
    }


    // ========================================
    // VÉRIFICATIONS
    // ========================================

    if (!type || !name || !country) {
        alert("⚠️ Veuillez remplir les informations demandées.");
        return;
    }

    if (type === "Groupe Ville" && !city) {
        alert("⚠️ Veuillez renseigner la ville.");
        return;
    }

    if (type === "Groupe Village" && !village) {
        alert("⚠️ Veuillez renseigner le village.");
        return;
    }

    if (type === "Groupe Famille" && !family) {
        alert("⚠️ Veuillez renseigner la famille.");
        return;
    }

    if (type === "Groupe Communauté" && !community) {
        alert("⚠️ Veuillez renseigner la communauté.");
        return;
    }


    createButton.disabled = true;
    createButton.textContent = "Création...";


    // ========================================
    // ENREGISTREMENT SUPABASE
    // ========================================

    try {

        const { data, error } = await supabaseClient
            .from("groups")
            .insert([
                {
                    name: name,
                    type: type,
                    country: country,
                    city: city || null,
                    village: village || null,
                    family: family || null,
                    community: community || null,
                    creator: "test-user",
                    members: 1
                }
            ])
            .select();

if (error) {

    console.error("Erreur Supabase :", error);

    if (error.code === "23505") {
        alert(
            '⚠️ Ce groupe existe déjà.\n\n' +
            'Veuillez choisir un autre nom pour votre groupe.'
        );
    } else {
        alert(
            '❌ Une erreur est survenue lors de la création du groupe.\n\n' +
            'Veuillez réessayer.'
        );
    }

    createButton.disabled = false;
    createButton.textContent = "🚀 Créer le groupe";

    return;
}


        console.log("Groupe créé :", data);

        const successModal = document.getElementById("successModal");
const successMessage = document.getElementById("successMessage");

successMessage.textContent =
    'Votre groupe "' + name + '" a été créé avec succès.';

successModal.style.display = "flex";


        // ========================================
        // RÉINITIALISATION
        // ========================================

        document.getElementById("groupName").value = "";
        document.getElementById("countryName").value = "";
        document.getElementById("cityName").value = "";
        document.getElementById("villageName").value = "";
        document.getElementById("familyName").value = "";
        document.getElementById("communityName").value = "";

        groupType.value = "";
        groupForm.style.display = "none";


    } catch (error) {

        console.error("Erreur :", error);

        alert("❌ Une erreur est survenue.");

    }


    createButton.disabled = false;
    createButton.textContent = "🚀 Créer le groupe";
});