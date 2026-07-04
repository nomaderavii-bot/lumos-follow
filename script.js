const app = {
    zip: null,

    data: {
        followers: [],
        following: [],
        notFollowing: []
    }
};

const zipInput = document.getElementById("zipFile");
const revealBtn = document.getElementById("revealBtn");

zipInput.addEventListener("change", handleZip);
revealBtn.addEventListener("click", startMagic);

async function handleZip(event) {
    const file = event.target.files[0];
    if (!file) return;

    app.zip = await JSZip.loadAsync(file);
}

async function startMagic() {

    const overlay = document.getElementById("overlay");
    overlay.classList.remove("hidden");

    document.getElementById("magicText").innerText = "LUMIS";

    await loadInstagramData();

    calculateResults();

    showResults();

    overlay.classList.add("hidden");
}
