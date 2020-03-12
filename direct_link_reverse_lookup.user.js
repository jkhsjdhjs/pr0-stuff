// ==UserScript==
// @name        Direct Link Reverse Lookup
// @author      jkhsjdhjs
// @namespace   jkhsjdhjs
// @description Optional redirect from IMG/VID links (img/vid.pr0gramm.com) to their respective post
// @include     /^https?:\/\/(full|img|vid)\.pr0gramm\.com\/((?:\d+){4}\/(?:\d+){2}(?:\/(?:\d+){2})?\/.+\.([A-z0-9]{3,4}))$/
// @version     2.3
// @updateURL   https://raw.githubusercontent.com/jkhsjdhjs/pr0-stuff/master/direct_link_reverse_lookup.user.js
// @downloadURL https://raw.githubusercontent.com/jkhsjdhjs/pr0-stuff/master/direct_link_reverse_lookup.user.js
// @icon        https://pr0gramm.com/media/pr0gramm-favicon.png
// @grant       GM_xmlhttpRequest
// @connect     pr0gramm.com
// ==/UserScript==

/*Changelog:
 * 1.8: added Changelog, added vid.pr0gramm.com support
 * 1.9: added mp4 support
 * 1.11: change update/download url
 * 1.12: change update/download url to v2.0 script
 * 2.0: complete rewrite without jquery
 * 2.1: include full.pr0gramm.com
 * 2.2: change arrow url from github.com to githubusercontent.com
 * 2.3: switch to pr0gramm reverse lookup api
*/

//CSS Spinner from http://tobiasahlin.com/spinkit/

//insert styles
document.querySelector("head").insertAdjacentHTML("beforeend", `
    <style>
        a#arrow {
            position: fixed;
            top: 10px;
            right: 10px;
            height: 5vmax;
            width: 5vmax;
        }

        a#arrow > img {
            height: inherit;
            width: inherit;
        }

        div#overlay-veil {
            height: 100%;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            position: fixed;
            top: 0;
            left: 0;
        }

        div#overlay-content {
            background-color: #222;
            z-index: 1;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 10px;
            padding: 20px;
            font-family: sans-serif;
            font-size: 1.5vmax;
        }

        div#status {
            text-align: center;
            color: #eee;
        }

        div#status-icon {
            display: table-cell;
            text-align: center;
            vertical-align: middle;
            font-size: 4vmax;
            display: none;
        }

        /* S P I N N E R */
        div#spinner, div#status-icon {
            width: 5vmax;
            height: 5vmax;
            position: relative;
            margin: 0 auto 20px auto;
        }

        div#spinner > div {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
        }

        div#spinner > div:before {
            content: "";
            display: block;
            margin: 0 auto;
            width: 15%;
            height: 15%;
            background-color: #AAA;
            border-radius: 100%;
            animation: spinner-fade-delay 1.2s infinite ease-in-out both;
        }

        div#spinner > div:nth-child(2) {
            transform: rotate(30deg);
        }
        div#spinner > div:nth-child(3) {
            transform: rotate(60deg);
        }
        div#spinner > div:nth-child(4) {
            transform: rotate(90deg);
        }
        div#spinner > div:nth-child(5) {
            transform: rotate(120deg);
        }
        div#spinner > div:nth-child(6) {
            transform: rotate(150deg);
        }
        div#spinner > div:nth-child(7){
            transform: rotate(180deg);
        }
        div#spinner > div:nth-child(8) {
            transform: rotate(210deg);
        }
        div#spinner > div:nth-child(9) {
            transform: rotate(240deg);
        }
        div#spinner > div:nth-child(10) {
            transform: rotate(270deg);
        }
        div#spinner > div:nth-child(11) {
            transform: rotate(300deg);
        }
        div#spinner > div:nth-child(12) {
            transform: rotate(330deg);
        }

        div#spinner > div:nth-child(2):before {
            animation-delay: -1.1s;
        }
        div#spinner > div:nth-child(3):before {
            animation-delay: -1s;
        }
        div#spinner > div:nth-child(4):before {
            animation-delay: -0.9s;
        }
        div#spinner > div:nth-child(5):before {
            animation-delay: -0.8s;
        }
        div#spinner > div:nth-child(6):before {
            animation-delay: -0.7s;
        }
        div#spinner > div:nth-child(7):before {
            animation-delay: -0.6s;
        }
        div#spinner > div:nth-child(8):before {
            animation-delay: -0.5s;
        }
        div#spinner > div:nth-child(9):before {
            animation-delay: -0.4s;
        }
        div#spinner > div:nth-child(10):before {
            animation-delay: -0.3s;
        }
        div#spinner > div:nth-child(11):before {
            animation-delay: -0.2s;
        }
        div#spinner > div:nth-child(12):before {
            animation-delay: -0.1s;
        }

        @keyframes spinner-fade-delay {
            0%, 39%, 100% {
                opacity: 0;
            }
            40% {
                opacity: 1;
            }
        }
    </style>
`);


//insert html
document.querySelector("body").insertAdjacentHTML("beforeend", `
    <a href="#" id="arrow">
        <img title="go to post" src="https://raw.githubusercontent.com/jkhsjdhjs/pr0-stuff/master/arrow.png">
    </a>
    <div id="overlay" hidden>
        <div id="overlay-veil"></div>
        <div id="overlay-content">
            <div id="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div id="status-icon"></div>
            <div id="status"></div>
        </div>
    </div>
`);


class Overlay {
    constructor(overlay, spinner, status_icon_elem, status) {
        this.overlay_elem = overlay;
        this.spinner_elem = spinner;
        this.status_icon_elem = status_icon_elem;
        this.status_elem = status;
    }
    show(bool) {
        this.overlay_elem.hidden = !bool;
    }
    show_spinner(bool) {
        this.spinner_elem.style.display = bool ? "block" : "none";
        this.status_icon_elem.style.display = bool ? "none" : "block";
    }
    error(text) {
        this.status_icon(false);
        this.status(text);
    }
    success(text) {
        this.status_icon(true);
        this.status(text);
    }
    status_icon(bool) {
        this.show_spinner(false);
        this.status_icon_elem.textContent = bool ? "✓" : "✕";
        this.status_icon_elem.style.color = bool ? "green" : "red";
    }
    status(text) {
        this.status_elem.textContent = text;
    }
}

const GM_fetch = (url, options) => new Promise((resolve, reject) => {
    const request = GM_xmlhttpRequest({...options, ...{
        url: url,
        responseType: "json",
        fetch: true,
        onload: res => resolve(res),
        onerror: err => reject(err)
    }});
    if(options.signal)
        options.signal.onabort = () => request.abort();
});

const overlay = new Overlay(
    document.querySelector("div#overlay"),
    document.querySelector("div#spinner"),
    document.querySelector("div#status-icon"),
    document.querySelector("div#status")
);

let abort;

document
    .querySelector("div#overlay-veil")
    .addEventListener("click", () => {
        overlay.show(false);
        abort.abort();
    });

document.querySelector("a#arrow").addEventListener("click", async e => {
    abort = new AbortController();
    e.preventDefault();
    overlay.show_spinner(true);
    overlay.status("fetching post...");
    overlay.show(true);
    try {
        const matches = location.href.match(/^https?:\/\/(full|img|vid)\.pr0gramm\.com\/((?:\d+){4}\/(?:\d+){2}(?:\/(?:\d+){2})?\/.+\.([A-z0-9]{3,4}))$/i);
        if(!matches.length)
            throw new Error("url doesn't match regex");
        const path = matches[1] === "full" && matches[3] === "png"
                   ? matches[2].slice(0, -3) + "jpg"
                   : matches[2];
        const response = await GM_fetch("https://pr0gramm.com/api/items/get?flags=15&tags=!p:" + path, {
            signal: abort.signal
        });
        if(response.status !== 200)
           throw new Error("api error");
        const json = response.response;
        if(json.error || !json.items.length)
            throw new Error("no post found");
        const item = json.items[0];
        overlay.success("redirecting...");
        location.href = "//pr0gramm.com/" + (item.promoted ? "top" : "new") + "/" + item.id;
    }
    catch(error) {
        overlay.error(error);
    }
});
