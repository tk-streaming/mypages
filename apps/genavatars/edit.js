const skelton_file = "https://tk-streaming.github.io/mypages/img/skelton.svg"
const parts_file = "https://tk-streaming.github.io/mypages/json/avatar/parts.json"

var body = location.search.match(/body=([a-zA-Z0-9_-]*)/)?.[1] ?? 'vanilla'
var eyes = location.search.match(/eyes=([a-zA-Z0-9_-]*)/)?.[1] ?? 'vanilla'
var basecolor = decodeURIComponent(location.search.match(/basecolor=([%a-zA-Z0-9]*)/)?.[1]) ?? '#ffffff'
var accentcolor = decodeURIComponent(location.search.match(/accentcolor=([%a-zA-Z0-9]*)/)?.[1]) ?? 'gray'

function setRandomAvatar() {
    const r = Math.floor(Math.random() * 205)
    const g = Math.floor(Math.random() * 205)
    const b = Math.floor(Math.random() * 205)
    avatarInfo = {}
    body = Object.keys(parts["body"]).sort(() => Math.random() - 0.5)[0]
    eyes = Object.keys(parts["eyes"]).sort(() => Math.random() - 0.5)[0]
    basecolor = "#" + ('0' + (r+50).toString(16)).slice(-2) + ('0' + (g+50).toString(16)).slice(-2) + ('0' + (b+50).toString(16)).slice(-2)
    accentcolor = "#" + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2)
}

function refreshPreview(skelton, parts) {
    const s = skelton
        .replace(/\[\[body\]\]/g, parts["body"][body])
        .replace(/\[\[eyes\]\]/g, parts["eyes"][eyes])
        .replace(/\[\[basecolor\]\]/g, basecolor)
        .replace(/\[\[accentcolor\]\]/g, accentcolor)
    data = `data:image/svg+xml;charset=utf8,${encodeURIComponent(s)}`
    const preview_dom = document.getElementById("preview")
    preview_dom.classList.add("avatar")
    preview_dom.style.backgroundImage = `url('${data}')`

    document.getElementById("command").innerText = `/nb body:${body} eyes:${eyes} basecolor:${basecolor} accentcolor:${accentcolor}`
    
}

window.addEventListener('load', async () => {
    const skelton = await (await fetch(skelton_file)).text()
    const parts = JSON.parse(await (await fetch(parts_file)).text())

    const body_selector = document.getElementById("body")
    Object.keys(parts["body"]).forEach(key => {
        const body_option = document.createElement("option")
        body_option.innerText = key
        body_option.value = key
        if (body === key) { body_option.selected = true }
        body_selector.appendChild(body_option)
    })
    body_selector.onchange = (_) => {
        body = body_selector.value
        refreshPreview(skelton, parts)
    }

    const eyes_selector = document.getElementById("eyes")
    Object.keys(parts["eyes"]).forEach(key => {
        const eyes_option = document.createElement("option")
        eyes_option.innerText = key
        eyes_option.value = key
        if (eyes === key) { eyes_option.selected = true }
        eyes_selector.appendChild(eyes_option)
    })
    eyes_selector.onchange = (_) => {
        eyes = eyes_selector.value
        refreshPreview(skelton, parts)
    }

    const basecolor_picker = document.getElementById("basecolor")
    basecolor_picker.value = basecolor
    basecolor_picker.oninput = (_) => {
        basecolor = basecolor_picker.value
        refreshPreview(skelton, parts)
    }

    const accentcolor_picker = document.getElementById("accentcolor")
    accentcolor_picker.value = accentcolor
    accentcolor_picker.oninput = (_) => {
        accentcolor = accentcolor_picker.value
        refreshPreview(skelton, parts)
    }

    refreshPreview(skelton, parts)
});

/*
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
    avatar_dom.onclick = (_) => { avatar_dom.target.href = avatar.data }
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
        appendAvatar(avatar, "RESERVED")
    })
    const len = 100 - Object.keys(reserved).length
    for(var i=0; i<len; i++) {
        const avatar = buildAvatar(parts, skelton, undefined)
        appendAvatar(avatar, undefined)
    }
}

window.addEventListener('load', async () => {
    const skelton = await (await fetch(skelton_file)).text()
    const parts = JSON.parse(await (await fetch(parts_file)).text())
    const reserved = JSON.parse(await (await fetch(reserved_file)).text())
    generateAvatars(parts, skelton, reserved)
    document.querySelectorAll(".reloader").forEach(dom => {
        dom.onclick = (_) => {
            generateAvatars(parts, skelton, reserved)
        }
    })
});
*/