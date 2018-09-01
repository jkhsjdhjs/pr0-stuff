// ==UserScript==
// @name        Disable Link Outline
// @author      jkhsjdhjs
// @namespace   jkhsjdhjs
// @description Deaktiviert die Rahmen um Bilder- und Textlinks.
// @include     *pr0gramm.com*
// @version     1.0
// @updateURL	https://totally.rip/pr0/disable_link_outline.user.js
// @downloadURL	https://totally.rip/pr0/disable_link_outline.user.js
// @icon		http://pr0gramm.com/media/pr0gramm-favicon.png
// @grant       none
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('a:focus { outline: none; }');
