function buildAvatar(parts, skelton, avatarInfo) {
    if (!avatarInfo) {
        const r = Math.floor(Math.random() * 205)
        const g = Math.floor(Math.random() * 205)
        const b = Math.floor(Math.random() * 205)
        avatarInfo = {}
        avatarInfo.body = Object.keys(parts["body"]).sort(() => Math.random() - 0.5)[0]
        avatarInfo.eye = Object.keys(parts["eyes"]).sort(() => Math.random() - 0.5)[0]
        avatarInfo.basecolor = "#" + ('0' + (r+50).toString(16)).slice(-2) + ('0' + (g+50).toString(16)).slice(-2) + ('0' + (b+50).toString(16)).slice(-2)
        avatarInfo.accentcolor = "#" + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2)
    }
    const s = skelton
        .replace(/\[\[body\]\]/g, parts["body"][avatarInfo.body])
        .replace(/\[\[eyes\]\]/g, parts["eyes"][avatarInfo.eye])
        .replace(/\[\[basecolor\]\]/g, avatarInfo.basecolor)
        .replace(/\[\[accentcolor\]\]/g, avatarInfo.accentcolor)
    avatarInfo.data = `data:image/svg+xml;charset=utf8,${encodeURIComponent(s)}`
    return avatarInfo
}

function appendAvatar(avatar, label) {
    var avatar_dom = document.createElement("div")
    avatar_dom.classList.add("avatar")
    avatar_dom.style.backgroundImage = `url('${avatar.data}')`
    avatar_dom.style.setProperty("cursor", "hand")
    avatar_dom.onclick = async (_) => {
        await navigator.clipboard.writeText(`/nb avatar body:${avatar.body} eyes:${avatar.eye} basecolor:${avatar.basecolor} accentcolor:${avatar.accentcolor}`)
    }
    avatar_dom.onmouseenter = (_) => { avatar_dom.classList.add("speaking") }
    avatar_dom.onmouseleave = (_) => { avatar_dom.classList.remove("speaking") }
    
    if (label) {
        var label_dom = document.createElement("div")
        label_dom.innerHTML = label
        label_dom.classList.add("label")
        avatar_dom.appendChild(label_dom)
    }
    document.getElementById("avatars").appendChild(avatar_dom)
}

function generateAvatars(parts, skelton, reserved) {
    document.getElementById("avatars").innerHTML = ""
    Object.values(reserved).forEach(x => {
        const avatar = buildAvatar(parts, skelton, x.avatar)
        appendAvatar(avatar, `RESERVED`)
    })
    for(var i=0; i<120; i++) {
        const avatar = buildAvatar(parts, skelton, undefined)
        appendAvatar(avatar, undefined)
    }
}

window.addEventListener('load', async () => {
    const skelton = await (await fetch("https://tk-streaming.github.io/mypages/img/skelton.svg")).text()
    const parts = JSON.parse(await (await fetch("https://tk-streaming.github.io/mypages/json/avatar/parts.json")).text())
    const reserved = JSON.parse(await (await fetch("https://tk-streaming.github.io/mypages/json/avatar/reserved.json")).text())
    generateAvatars(parts, skelton, reserved)
    document.querySelectorAll(".reloader").forEach(dom => {
        dom.onclick = (_) => {
            generateAvatars(parts, skelton, reserved)
        }
    })
});

