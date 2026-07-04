const app = {
    zip: null,

    data: {
        followers: [],
        following: [],
        notFollowing: []
    }
};

// ELEMENTOS
const zipInput = document.getElementById("zipFile");
const revealBtn = document.getElementById("revealBtn");
const overlay = document.getElementById("overlay");
const result = document.getElementById("result");

zipInput.addEventListener("change", handleZip);
revealBtn.addEventListener("click", startMagic);

// CARREGAR ZIP
async function handleZip(event) {
    const file = event.target.files[0];
    if (!file) return;

    app.zip = await JSZip.loadAsync(file);
}

// INICIAR MAGIA
async function startMagic() {

    overlay.classList.remove("hidden");
    document.getElementById("magicText").innerText = "LUMIS";

    await loadInstagramData();
    calculateResults();
    showResults();

    overlay.classList.add("hidden");
    result.classList.remove("hidden");
}

// LER DADOS DO INSTAGRAM
async function loadInstagramData() {

    const files = Object.keys(app.zip.files);

    const followersFile = files.find(f => f.includes("followers") && f.endsWith(".json"));
    const followingFile = files.find(f => f.includes("following") && f.endsWith(".json"));

    if (!followersFile || !followingFile) {
        alert("ZIP inválido do Instagram.");
        return;
    }

    const followersRaw = await app.zip.files[followersFile].async("string");
    const followingRaw = await app.zip.files[followingFile].async("string");

    const followersJson = JSON.parse(followersRaw);
    const followingJson = JSON.parse(followingRaw);

    app.data.followers = extractUsers(followersJson);
    app.data.following = extractUsers(followingJson);
}

// EXTRAIR USERNAMES
function extractUsers(data) {
    let users = [];

    if (!data) return users;

    data.forEach(item => {
        if (item.string_list_data) {
            item.string_list_data.forEach(u => {
                users.push(u.value);
            });
        }
    });

    return users;
}

// CALCULAR RESULTADOS
function calculateResults() {

    const followers = app.data.followers;
    const following = app.data.following;

    // quem você segue e não te segue de volta
    app.data.notFollowing = following.filter(user => !followers.includes(user));

    document.getElementById("followers").innerText = followers.length;
    document.getElementById("following").innerText = following.length;
    document.getElementById("notFollowing").innerText = app.data.notFollowing.length;
}

// MOSTRAR LISTA
function showResults() {

    const list = document.getElementById("userList");
    list.innerHTML = "";

    app.data.notFollowing.forEach(user => {

        const div = document.createElement("div");
        div.className = "user";

        div.innerHTML = `
            <span>${user}</span>
            <button onclick="removeUser('${user}')">🪄 Remover</button>
        `;

        list.appendChild(div);
    });
}

// REMOVER USUÁRIO (MAGIA)
function removeUser(username) {

    const list = document.getElementById("userList");

    const items = [...list.children];

    items.forEach(item => {
        if (item.innerText.includes(username)) {

            item.classList.add("disappear");

            setTimeout(() => {
                item.remove();
            }, 800);
        }
    });

    app.data.notFollowing = app.data.notFollowing.filter(u => u !== username);

    document.getElementById("notFollowing").innerText = app.data.notFollowing.length;
}
