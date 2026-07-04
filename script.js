/*==================================================
            LUMOS FOLLOW V3
==================================================*/

// ===============================
// DADOS DA APLICAÇÃO
// ===============================

const app = {

    zip: null,

    followers: [],

    following: [],

    notFollowing: []

};

// ===============================
// ELEMENTOS DA TELA
// ===============================

const zipInput = document.getElementById("zipFile");
const revealBtn = document.getElementById("revealBtn");

const overlay = document.getElementById("overlay");
const magicText = document.getElementById("magicText");

const result = document.getElementById("result");

const followersBox = document.getElementById("followers");
const followingBox = document.getElementById("following");
const notFollowingBox = document.getElementById("notFollowing");

const userList = document.getElementById("userList");

const searchInput = document.getElementById("search");

const copyBtn = document.getElementById("copy");

const downloadBtn = document.getElementById("download");


// ===============================
// INICIAR
// ===============================

zipInput.addEventListener("change", loadZip);

revealBtn.addEventListener("click", startMagic);

searchInput.addEventListener("input", filterUsers);

copyBtn.addEventListener("click", copyUsers);

downloadBtn.addEventListener("click", downloadUsers);


// ===============================
// ABRIR ZIP
// ===============================

async function loadZip(event){

    const file = event.target.files[0];

    if(!file) return;

    app.zip = await JSZip.loadAsync(file);

}


// ===============================
// MAGIA
// ===============================

async function startMagic(){

    if(!app.zip){

        alert("Selecione primeiro o arquivo ZIP do Instagram.");

        return;

    }

    overlay.classList.remove("hidden");

    magicText.innerText="LUMOS";

    await readInstagram();

    calculate();

    render();

    setTimeout(()=>{

        overlay.classList.add("hidden");

        result.classList.remove("hidden");

    },1800);

}

// ===============================
// LER ARQUIVOS DO INSTAGRAM
// ===============================

async function readInstagram(){

    const files = Object.keys(app.zip.files);

    const followersFile = files.find(file =>
        file.toLowerCase().includes("followers") &&
        file.endsWith(".json")
    );

    const followingFile = files.find(file =>
        file.toLowerCase().includes("following") &&
        file.endsWith(".json")
    );

    if(!followersFile || !followingFile){

        alert("Não encontrei os arquivos do Instagram dentro do ZIP.");

        throw new Error("Arquivos não encontrados");

    }

    const followersContent =
        await app.zip.files[followersFile].async("string");

    const followingContent =
        await app.zip.files[followingFile].async("string");

    const followersJson = JSON.parse(followersContent);

    const followingJson = JSON.parse(followingContent);

    app.followers = getUsers(followersJson);

    app.following = getUsers(followingJson);

}


// ===============================
// EXTRAIR USUÁRIOS
// ===============================

function getUsers(data){

    const users = [];

    if(!Array.isArray(data)) return users;

    data.forEach(item=>{

        if(item.string_list_data){

            item.string_list_data.forEach(user=>{

                if(user.value){

                    users.push(user.value);

                }

            });

        }

    });

    return users;

}


// ===============================
// CALCULAR
// ===============================

function calculate(){

    app.notFollowing = app.following.filter(user=>

        !app.followers.includes(user)

    );

}

// ===============================
// MOSTRAR RESULTADOS
// ===============================

function render() {

    followersBox.textContent = app.followers.length;
    followingBox.textContent = app.following.length;
    notFollowingBox.textContent = app.notFollowing.length;

    renderUserList(app.notFollowing);

}

// ===============================
// RENDERIZAR LISTA
// ===============================

function renderUserList(list) {

    userList.innerHTML = "";

    if (list.length === 0) {

        userList.innerHTML = `
            <div class="user">
                <span>✨ Nenhum usuário encontrado.</span>
            </div>
        `;

        return;

    }

    list.forEach(username => {

        const div = document.createElement("div");

        div.className = "user";

        div.innerHTML = `
            <span>@${username}</span>

            <button class="remove-btn" onclick="removeUser('${username}', this)">
                🪄 Remover
            </button>
        `;

        userList.appendChild(div);

    });

}

// ===============================
// PESQUISA
// ===============================

function filterUsers() {

    const text = searchInput.value.toLowerCase();

    const filtered = app.notFollowing.filter(user =>
        user.toLowerCase().includes(text)
    );

    renderUserList(filtered);

}

// ===============================
// REMOVER COM MAGIA
// ===============================

function removeUser(username, button) {

    const card = button.parentElement;

    card.classList.add("disappear");

    setTimeout(() => {

        app.notFollowing = app.notFollowing.filter(
            user => user !== username
        );

        render();

    }, 800);

}

// ===============================
// COPIAR LISTA
// ===============================

function copyUsers() {

    navigator.clipboard.writeText(
        app.notFollowing.join("\n")
    );

    alert("Lista copiada com sucesso!");

}

// ===============================
// BAIXAR TXT
// ===============================

function downloadUsers() {

    const blob = new Blob(
        [app.notFollowing.join("\n")],
        { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "nao-seguidores.txt";

    link.click();

    URL.revokeObjectURL(url);

}

// ======================================
// UTILITÁRIOS
// ======================================

function showOverlay(message = "LUMOS") {

    overlay.classList.remove("hidden");

    magicText.textContent = message;

}

function hideOverlay() {

    overlay.classList.add("hidden");

}

function showError(message) {

    hideOverlay();

    alert(message);

}


// ======================================
// VALIDAÇÕES
// ======================================

function validateZip() {

    if (!app.zip) {

        showError("Selecione um arquivo ZIP do Instagram.");

        return false;

    }

    return true;

}


// ======================================
// MELHORAR A LEITURA DOS ARQUIVOS
// ======================================

async function getJsonFile(possibleNames) {

    const files = Object.keys(app.zip.files);

    const file = files.find(name =>

        possibleNames.some(search =>

            name.toLowerCase().includes(search)

        ) && name.endsWith(".json")

    );

    if (!file) return null;

    const content = await app.zip.files[file].async("string");

    return JSON.parse(content);

}


// ======================================
// EFEITO DE MAGIA
// ======================================

function magicEffect(element) {

    element.animate(

        [

            {

                transform:"scale(1)",

                opacity:1

            },

            {

                transform:"scale(1.2)",

                opacity:.6

            },

            {

                transform:"scale(0)",

                opacity:0

            }

        ],

        {

            duration:800,

            easing:"ease"

        }

    );

}


// ======================================
// REMOVER COM ANIMAÇÃO
// ======================================

function removeUser(username, button){

    const card = button.parentElement;

    magicEffect(card);

    setTimeout(()=>{

        app.notFollowing = app.notFollowing.filter(

            user => user !== username

        );

        render();

    },800);

}


// ======================================
// INICIALIZAÇÃO
// ======================================

window.addEventListener("load",()=>{

    result.classList.add("hidden");

    hideOverlay();

});


// ======================================
// FUTURAS FUNÇÕES (V4)
// ======================================

// Quem deixou de seguir

// Ranking de curtidas

// Ranking de comentários

// Histórico

// Dashboard

// APK Android

console.log("✨ Lumos Follow V3 carregado com sucesso!");