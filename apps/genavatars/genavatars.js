const reserved = [
    { name: "tk", avatarInfo: { "body": "tk", "eye": "tk", "basecolor": "#f7931e", "accentcolor": "#f15a24" } },
    { name: "sg", avatarInfo: { "body": "sg", "eye": "sg", "basecolor": "#3fa9f5", "accentcolor": "#0071bc" } },
    { name: "suwa", avatarInfo: { "body": "suwa", "eye": "suwa", "basecolor": "#e6e6e6", "accentcolor": "gray" } },
    { name: "ino", avatarInfo: { "body": "ino", "eye": "ino", "basecolor": "#ff7bac", "accentcolor": "#ed1e79" } },
    { name: "sukirobo", avatarInfo: { "body": "sukirobo", "eye": "sukirobo", "basecolor": "#8cc63f", "accentcolor": "#009245" } },
]

function buildAvatar(parts, skelton, avatarInfo) {
    if (!avatarInfo) {
        const r = Math.floor(Math.random() * 205)
        const g = Math.floor(Math.random() * 205)
        const b = Math.floor(Math.random() * 205)
        avatarInfo = {}
        avatarInfo.body = [ "vanilla", "tk", "sg", "suwa", "ino", "sukirobo" ].sort(() => Math.random() - 0.5)[0]
        avatarInfo.eye = [ "vanilla", "tk", "sg", "suwa", "ino", "sukirobo" ].sort(() => Math.random() - 0.5)[0]
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

function appendAvatar(avatarInfo, label) {
    var avatar = document.createElement("div")
    avatar.classList.add("avatar")
    avatar.classList.add("speaking")
    avatar.style.backgroundImage = `url('${avatarInfo.data}')`
    avatar.style.setProperty("cursor", "hand")
    avatar.onclick = async (e) => {
        await navigator.clipboard.writeText(`/nb avatar body:${avatarInfo.body} eye:${avatarInfo.eye} basecolor:${avatarInfo.basecolor} accentcolor:${avatarInfo.accentcolor}`)
    }
    avatar.innerHTML = label
    document.getElementById("avatars").appendChild(avatar)
}

window.addEventListener('load', async () => {
    const skelton = await (await fetch("https://tk-streaming.github.io/mypages/apps/genavatars/skelton.svg")).text()
    const parts = JSON.parse(await (await fetch("https://tk-streaming.github.io/mypages/apps/genavatars/parts.json")).text());
    reserved.forEach(x => {
        const avatarInfo = buildAvatar(parts, skelton, x.avatarInfo)
        appendAvatar(avatarInfo, `<span style="font-weight: bold;">reserved by ${x.name}</a>`)
    })
    for(var i=0; i<120; i++) {
        const avatarInfo = buildAvatar(parts, skelton, undefined)
        appendAvatar(avatarInfo, "")
    }
});


