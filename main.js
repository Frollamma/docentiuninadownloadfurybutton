// ==UserScript==
// @name         Docenti unina autodownloader button (with popups!)
// @homepage     https://github.com/Frollamma/docentiuninadownloadfurybutton
// @namespace    https://puntodegenere.netlify.app/
// @version      1.1
// @description  Creates a button that allows you to download all files at once.
// @author       Frollo & ZOLV
// @match        https://www.docenti.unina.it/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unina.it
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    let base_url_string = 'https://www.docenti.unina.it/webdocenti-be/allegati/materiale-didattico/';
    let pdfPattern = /\.pdf$/; // ending with .pdf
    let filePattern = /\..+$/; // ending with .* (to exclude directories)
    let separator = '__';

    function createButton(context, func) {
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Download all files";
        button.onclick = func;
        context.appendChild(button);
    }

    window.onload = function() {
        console.log("Docenti Unina Download Fury Button is running!");
        createButton(document.body, function() {

            let angular_element = document.querySelector('[ng-show*="materialeDidatticoController"]');
            let files = angular.element(angular_element).controller().getMaterialeDidattico().contenutoCartella;
            let prof_id = angular.element(angular_element).controller().getIdProfessor();
            window.base_directory_url_string = 'https://www.docenti.unina.it/webdocenti-be/docenti/' + prof_id + '/materiale-didattico/areapubb/';

            for (let file of files) {
                download_element(file, '');
            }

        }
                    );
    };

    function download_element(file, name_prepend) {
        let filename = base_url_string + String(file.id);
        //console.log(file);

        if (pdfPattern.test(file.nome)) {
            fetch(filename, { // codice rubato
                method: 'GET'
            }).then(resp => resp.blob())
                .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = name_prepend + file.nome; // the filename you want
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
        }
        else if (filePattern.test(file.nome)){
            window.open(filename);
        }
        else { // This is supposed to only be directories
            fetch(window.base_directory_url_string + String(file.id) + '?codIns=', {
                method: 'GET'
            }).then(resp => resp.json())
                .then(json => {
                for (let element of json.contenutoCartella){
                    let prep = file.nome + separator;
                    if (name_prepend != '') {
                        prep = name_prepend + separator + prep;
                    }
                    download_element(element, prep);
                }
            })
        }
    }

    console.log("Docenti Unina Download Fury Button exists!");
})();
