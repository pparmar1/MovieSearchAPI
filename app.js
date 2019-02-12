'use strict'
const express = require("express");
const app = express();
const request = require("request");
const mustache = require('mustache');
const fs = require('fs');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';

function serve(){
    app.use(express.static(STATIC_DIR));
    setupTemplates(app, TEMPLATES_DIR);
    setupRoutes(app);
    app.listen(1395, function(){
        console.log("Movie App has started!");
    });

}

serve();

module.exports = serve;


function setupRoutes(app) {
    app.get("/results", displayResults(app));
}



function displayResults(app){
    return async function(req,res) {
            request("http://www.omdbapi.com/?i=tt3896198&apikey=thewdb&s=california",function(error,response,body){
                if(!error && response.statusCode === 200){
                    let results = JSON.parse(body);
                    let model = {results: results["Search"]};
                    console.log(results);
                    const html = doMustache(app, 'results', model);
                    res.send(html);
                }
            });
    }
}









/** Add contents all dir/*.ms files to app templates with each
 *  template being keyed by the basename (sans extensions) of
 *  its file basename.
 */
function setupTemplates(app, dir) {
    app.templates = {};
    for (let fname of fs.readdirSync(dir)) {
        const m = fname.match(/^([\w\-]+)\.ms$/);
        if (!m) continue;
        try {
            app.templates[m[1]] =
                String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
        }
        catch (e) {
            console.error(`cannot read ${fname}: ${e}`);
            process.exit(1);
        }
    }
}

/** Return result of mixing view-model view into template templateId
 *  in app templates.
 */
function doMustache(app, templateId, view) {
    const templates = { footer: app.templates.footer };
    return mustache.render(app.templates[templateId], view, templates);
}