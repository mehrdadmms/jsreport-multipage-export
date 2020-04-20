const jsreport = require('jsreport-core')();

jsreport
    .init()
    .then(() => {})
    .catch((e) => {
        if (e) throw e;
    });

module.exports.render = (html, data, callback) => {
    jsreport
        .render({
            template: {
                content: html,
                engine: 'handlebars',
                recipe: 'chrome-pdf',
                // helpers: json.helpers,
                chrome: {
                    landscape: true
                }
            },
            data: data
        })
        .then(resp => callback(null, resp.content))
        .catch(err => {if (err) callback(err)});
};

