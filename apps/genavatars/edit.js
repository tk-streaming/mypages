const skelton_file = "https://tk-streaming.github.io/mypages/img/skelton.svg"
const parts_file = "https://tk-streaming.github.io/mypages/json/avatar/parts.json"

var body = location.search.match(/body=([a-zA-Z0-9_-]*)/)?.[1] ?? 'vanilla'
var eyes = location.search.match(/eyes=([a-zA-Z0-9_-]*)/)?.[1] ?? 'vanilla'
var basecolor = decodeURIComponent(location.search.match(/basecolor=([%a-zA-Z0-9]*)/)?.[1]) ?? '#ffffff'
var accentcolor = decodeURIComponent(location.search.match(/accentcolor=([%a-zA-Z0-9]*)/)?.[1]) ?? 'gray'

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
    document.getElementById("url").innerText = `https://tk-streaming.github.io/mypages/apps/genavatars/edit.html?body=${body}&eyes=${eyes}&basecolor=${encodeURIComponent(basecolor)}&accentcolor=${encodeURIComponent(accentcolor)}`
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
