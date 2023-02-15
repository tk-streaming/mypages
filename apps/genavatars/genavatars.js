function buildAvatar(parts, skelton) {
    const body = [ "vanilla", "tk", "sg", "suwa", "ino", "sukirobo" ].sort(() => Math.random() - 0.5)[0]
    const eye = [ "vanilla", "tk", "sg", "suwa", "ino", "sukirobo" ].sort(() => Math.random() - 0.5)[0]
    const r = Math.floor(Math.random() * 205)
    const g = Math.floor(Math.random() * 205)
    const b = Math.floor(Math.random() * 205)
    const basecolor = "#" + ('0' + (r+50).toString(16)).slice(-2) + ('0' + (g+50).toString(16)).slice(-2) + ('0' + (b+50).toString(16)).slice(-2)
    const accentcolor = "#" + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2)
    const s = skelton
        .replace(/\[\[body\]\]/g, parts["body"][body])
        .replace(/\[\[eyes\]\]/g, parts["eyes"][eye])
        .replace(/\[\[basecolor\]\]/g, basecolor)
        .replace(/\[\[accentcolor\]\]/g, accentcolor)
    return `data:image/svg+xml;charset=utf8,${encodeURIComponent(s)}`
}

window.addEventListener('load', async () => {
    const parts = JSON.parse(await fetch("./parts.json"));
    const skelton = await fetch("./skelton.svg");
    for(var i=0; i<120; i++) {
        const svg = buildAvatar(parts, skelton)
        var avatar = document.createElement("div")
        avatar.classList.add("avatar")
        avatar.classList.add("speaking")
        avatar.style.backgroundImage = `url('${svg}')`
        document.getElementById("avatars").appendChild(avatar)
    }
});


