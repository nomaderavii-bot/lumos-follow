const zipInput = document.getElementById("zipFile");

const followers = document.getElementById("followers");
const following = document.getElementById("following");
const notFollowing = document.getElementById("notFollowing");
const list = document.getElementById("list");

zipInput.addEventListener("change", () => {
    const file = zipInput.files[0];

    if (!file) return;

    followers.textContent = "--";
    following.textContent = "--";
    notFollowing.textContent = "--";

    list.innerHTML = `
        <div style="text-align:center;padding:40px;">
            <h3>📂 ${file.name}</h3>
            <p>Arquivo carregado com sucesso.</p>
            <p>Em breve o Lumos Follow analisará automaticamente os dados do Instagram.</p>
        </div>
    `;
});
