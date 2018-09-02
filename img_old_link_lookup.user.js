// ==UserScript==
// @name        Direct Link Reverse Lookup
// @author      jkhsjdhjs
// @namespace   jkhsjdhjs
// @description Optional redirect from IMG/VID links (img/vid.pr0gramm.com) to their respective post
// @include     /^https?://(?:vid|img).pr0gramm.com.+\..+/
// @version     1.12
// @updateURL   https://github.com/jkhsjdhjs/pr0-stuff/raw/master/direct_link_reverse_lookup.user.js
// @downloadURL https://github.com/jkhsjdhjs/pr0-stuff/raw/master/direct_link_reverse_lookup.user.js
// @icon        http://pr0gramm.com/media/pr0gramm-favicon.png
// ==/UserScript==

/*Changelog:
 * 1.8: added Changelog, added vid.pr0gramm.com support
 * 1.9: added mp4 support
 * 1.11: change update/download url
 * 1.12: change update/download url to v2.0 script
*/

//"Load jQuery if not loaded" Code from: https://css-tricks.com/snippets/jquery/load-jquery-only-if-not-present/
//CSS Spinner from: http://tobiasahlin.com/spinkit/

var RegExpIMG = /^https?:\/\/(?:img|vid)\.pr0gramm\.com\/(\d+\/\d+\/(?:\d+\/)?.+\.(?:jpg|png|gif|webm|mp4)).*/i;
var RegExpPR0 = /^https?:\/\/pr0gramm\.com\/(?:new|top)\/(\d+)/i;
var xhr;

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if(!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function ajaxCall() {
    var matches = RegExpIMG.exec(location.href);
    xhr = $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://pr0.totally.rip/api/v1/img_reverse_lookup.php',
        data: { 'image': matches[1] },
        success: function callback(obj) {
            if(obj.error == "null") {
                $('#status').text('Weiterleitung...');
                $('#status').css('color', 'green');
                window.location = location.protocol + "//pr0gramm.com/new/" + obj.id.toString();
            }
            else if(obj.error == "notFound") {
                $('.spinner').text('X');
                $('.spinner').css({
                    'font-size': '100px',
                    'font-weight': 'bold',
                    'color': '#333'
                });
                $('#status').html('Bild nicht in der Datenbank!<br>Warten Sie 10 Minuten und versuchen Sie es erneut.');
                $('#status').css('color', 'red');
            }
            else {
                $('.spinner').text('X');
                $('.spinner').css({
                    'font-size': '100px',
                    'font-weight': 'bold',
                    'color': '#333'
                });
                $('#status').text('Unbekannter Fehler!');
                $('#status').css('color', 'red');
            }
        },
        error: function (jqXHR) {
            if(jqXHR.statusText != "abort") {
                ajaxCall();
            }
        }
    });
}

function code() {
    if(RegExpIMG.test(location.href)) {
        if($('img').length || $('video').length) {
            $('body').append('<a href="#" id="a_arrow"><img id="arrow" title="Zum Post" src="https://github.com/jkhsjdhjs/pr0-stuff/raw/master/arrow.png"></a>');
            $('#arrow').css({
                'height': '75px',
                'width': '75px'
            });
            $('#a_arrow').css({
                'position': 'fixed',
                'top': '10px',
                'right': '10px',
                'height': '75px',
                'width': '75px'
            });
            $('#a_arrow').on('click', function(e) {
                e.preventDefault();
                $('body').append('<div id="info"></div>');
                $('body').append('<div id="veil"></div>');
                $('#info').append('<div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>');
                $('#info').append('<span id="status">ID wird abgefragt...</span>');
                addGlobalStyle('.spinner{margin:100px auto;width:80px;height:80px;position:relative}.container1>div,.container2>div,.container3>div{width:15px;height:15px;background-color:#333;border-radius:100%;position:absolute;-webkit-animation:bouncedelay 1.2s infinite ease-in-out;animation:bouncedelay 1.2s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.spinner .spinner-container{position:absolute;width:100%;height:100%}.container2{-webkit-transform:rotateZ(45deg);transform:rotateZ(45deg)}.container3{-webkit-transform:rotateZ(90deg);transform:rotateZ(90deg)}.circle1{top:0;left:0}.circle2{top:0;right:0}.circle3{right:0;bottom:0}.circle4{left:0;bottom:0}.container2 .circle1{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.container3 .circle1{-webkit-animation-delay:-1s;animation-delay:-1s}.container1 .circle2{-webkit-animation-delay:-.9s;animation-delay:-.9s}.container2 .circle2{-webkit-animation-delay:-.8s;animation-delay:-.8s}.container3 .circle2{-webkit-animation-delay:-.7s;animation-delay:-.7s}.container1 .circle3{-webkit-animation-delay:-.6s;animation-delay:-.6s}.container2 .circle3{-webkit-animation-delay:-.5s;animation-delay:-.5s}.container3 .circle3{-webkit-animation-delay:-.4s;animation-delay:-.4s}.container1 .circle4{-webkit-animation-delay:-.3s;animation-delay:-.3s}.container2 .circle4{-webkit-animation-delay:-.2s;animation-delay:-.2s}.container3 .circle4{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes bouncedelay{0%,100%,80%{-webkit-transform:scale(0)}40%{-webkit-transform:scale(1)}}@keyframes bouncedelay{0%,100%,80%{transform:scale(0);-webkit-transform:scale(0)}40%{transform:scale(1);-webkit-transform:scale(1)}}');
                $('#info').css({
                    'height': '40%',
                    'width': '35%',
                    'z-index': '1',
                    'background-color': '#161618',
                    'border-radius': '5px',
                    'position': 'fixed',
                    'top': '50%',
                    'left': '50%',
                    'transform': 'translate(-50%, -50%)',
                    'color': '#F5F7F6',
                    'box-shadow': '10px 10px 10px -6px #000',
                    'padding': '10px',
                    'font-family': 'sans-serif',
                    'text-align': 'center',
                    'font-size': '24px'
                });
                $('#veil').css({
                    'height': '100%',
                    'width': '100%',
                    'z-index': '0',
                    'background-color': '#000',
                    'opacity': '0.6',
                    'position': 'absolute'
                });
                $('#status').css({
                    'margin-top': '70px',
                });
                ajaxCall();
                $('#veil').on('click', function(e) {
                    $('#info').remove();
                    $('#veil').remove();
                    if(xhr) {
                        xhr.abort();
                    }
                });
            });
        }
    }
    else if(RegExpPR0.exec(location.href)) {
        var matches = RegExpPR0.exec(location.href);
        $.ajax({
            type: 'GET',
            url: location.protocol + '//pr0gramm.com/api/items/info',
            data: { 'itemId': matches[1] },
            success: function callback(returnvalue) {
                var obj = $.parseJSON(returnvalue);
                for(var i = 0; i <= Object.keys(obj.comments).length - 1; i++) {
                    console.log(obj.comments[Object.keys(obj.comments)[i]]);
                }
            }
        });
    }
}

//--Load jQuery of not loaded
if(typeof jQuery == 'undefined') {
    function getScript(url, success) {
        var script = document.createElement('script');
        script.src = url;
        var head = document.getElementsByTagName('head')[0],
        done = false;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                // callback function provided as param
                success();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            };
        };
        head.appendChild(script);
    };
    getScript(location.protocol + '//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js', function() {
        if (typeof jQuery == 'undefined') {
            // Super failsafe - still somehow failed...
            alert("jQuery konnte nicht geladen werden. Laden Sie die Seite neu.");
        }
        else {
            //jQuery successfully loaded, execute primary userscript code
            code();
        }
    });
}
else {
    //jQuery is already present, execute primary userscript code
    code();
};
