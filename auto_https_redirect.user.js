// ==UserScript==
// @name        Auto HTTPS Redirect
// @author      jkhsjdhjs
// @namespace   jkhsjdhjs
// @description Leitet beim Aufruf von http://pr0gramm.com automatisch zu https://pr0gramm.com weiter.
// @include     http://pr0gramm.com*
// @version     1.1
// @updateURL	https://totally.rip/pr0/auto_https_redirect.js
// @downloadURL	https://totally.rip/pr0/auto_https_redirect.js
// @icon		http://pr0gramm.com/media/pr0gramm-favicon.png
// @grant       none
// ==/UserScript==

window.location = location.href.replace("http://", "https://");
