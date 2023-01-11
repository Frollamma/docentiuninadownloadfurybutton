// ==UserScript==
// @name         Docenti unina autodownloader button (with popups!)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Creates a buttons that allows you to download all files at once. It creates a popup every time but you can change some settings to speed it up, check https://superuser.com/questions/901289/download-link-from-firefox-console
// @author       Frollo
// @match        https://www.docenti.unina.it/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unina.it
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function createButton(context, func) {
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Download all files";
        button.onclick = func;
        context.appendChild(button);
    }

    window.onload = function() {
        createButton(document.body, function() {
            let base_url_string = 'https://www.docenti.unina.it/webdocenti-be/allegati/materiale-didattico/';
            let angular_element = document.querySelector('[ng-show*="materialeDidatticoController"]');
            let files = angular.element(angular_element).controller().getMaterialeDidattico().contenutoCartella;

            for (let file of files) {
                window.open(base_url_string + String(file.id));
            }
        }
        );
    };
})();