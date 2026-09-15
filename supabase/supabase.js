// ========================================
// CONNEXION SUPABASE
// PI COMMUNITY BUILDER
// ========================================

const SUPABASE_URL = "https://nvxihwhpjxzrhtemtbkp.supabase.co";

const SUPABASE_KEY = "sb_publishable_MdHopWOnFrdalrOzRmYy_w_3BSygoxq";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);