var html2json = require('html2json').html2json;
const request = require("request-promise-native");
const fs = require("fs");

function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

main = async () => {

    let html = await request("https://www.vultr.com/api/");

    let relevantHtml = html.substring(html.indexOf("<div class=\"main-content"), html.indexOf('<!-- /.main-content -->'));
    

    let json = html2json(relevantHtml);

    let rows = json.child[0].child.filter(t => t.node == 'element');

    rows.shift();
    rows.shift();
    rows.shift();

    let api = fs.createWriteStream('./api.generated.js');

    let indent = 0;
    
    const write = (s) => {
        for (let index = 0; index < indent; index++) {
            api.write('\t');
        }
        api.write(s)
    }

    write('const Rest = require(\'./rest.js\');\n');

    let classes = [];

    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        const h2 = element.child.filter(t => t.tag == 'h2').map(t => t.child[0].text.toString());

        let a = {
            className : h2.toString().replace(/ /g, ''),
            shortName : element.attr.id
        };

        classes.push(a);
        
        write('class ' + a.className + ' {\n');

        indent++;
        write('/**\n');
        write(' * @param {Rest} rest REST-interface \n');
        write(' */\n');
        write('constructor(rest) {\n');
        indent++;
        write('this.rest = rest;\n');
        indent--;
        write('}\n');

        const calls = element.child.filter(t => t.tag == 'div');

        const callMeta = [];

        for (let j = 0; j < calls.length; j++) {
            const call = calls[j];

            let x = {
                name : call.attr.id.replace(new RegExp(element.attr.id + '_', 'gi'), ''),
                params : [],
                urlPart : call.child.filter(x => x.tag == 'h3').map(x => x.child[0].text.trim())[0],
                desc : call.child.filter(t => t.tag == 'p').map(x => x.child[0].text),
                apiKeyRequired : false,
                requestType : 'GET'
            };

            x.apiKeyRequired = call.child.filter(x => x.tag == 'table')[0]
                                   .child.filter(x => x.tag == "tr")[0]
                                   .child.filter(x => x.tag == "td")[1]
                                   .child.map(x => x.text.trim())[0] == 'Yes';
            x.method = call.child.filter(x => x.tag == 'table')[0]
                            .child.filter(x => x.tag == "tr")[1]
                            .child.filter(x => x.tag == "td")[1]
                            .child.map(x => x.text.trim())[0];
            
            const codeblocks = call.child.filter(t => t.tag == 'div' && t.attr.class == 'code');
            
            const parameterBlock = codeblocks[2].child.filter(x => x.tag == "pre")[0].child.filter(x => x.tag == "code").map(x => x.child[0].text.split('\n'))[0];

            for (let k = 0; k < parameterBlock.length; k++) {
                if(parameterBlock[k].length == 0 || parameterBlock[k] == 'No parameters.') continue;
                
                const param = parameterBlock[k];
                let arr = param.split(' ');
                x.params.push({
                    name : arr[0],
                    type : arr[1],
                    optional : arr[2] == '(optional)',
                    desc : arr.slice(2).join(' ').replace(/&#039;/gi, '\'')
                });
            }

                       
            // parameters
            write('/**\n');
            write(' * '+x.desc+'\n');
            write(' *\n');
            for (let k = 0; k < x.params.length; k++) {
                const param = x.params[k];
                write(' * @param {'+jsUcfirst(param.type)+'} '+param.name.toLowerCase()+' '+param.desc +'\n');
            }
            write(' * @return {Promise}\n');
            write(' */\n')
            write(x.name + ' (' + x.params.map(x => x.name.toLowerCase()).join(', ') + ') {\n');

            indent++;
            
            const required = x.params.filter(x => !x.optional);
            const optional = x.params.filter(x => x.optional);

            if(x.params.length > 0) {
                write('let payload = {');
            }

            if(required.length > 0) {
                api.write(required.map(x => '\'' + x.name +'\' : '+ x.name.toLowerCase()).join(', '));
            }

            if(x.params.length > 0) {
                api.write(' };\n');
            }

            for (let k = 0; k < optional.length; k++) {
                const op = optional[k];
                write('if(' + op.name.toLowerCase() + ' !== undefined) { payload[\''+op.name+'\'] = '+op.name.toLowerCase()+'; }\n');
            }

            write('return this.rest.execute(\''+x.urlPart+'\', '+x.apiKeyRequired+', \''+x.method+'\'');

            if(x.params.length > 0) {
                api.write(', payload');
            }
            api.write(');\n');

            indent--;
            write('}\n')
        }
        
        indent--;


        write('}\n')
    }

    write('\n\n');
    write('class Vultr {\n');
    indent++;
    write('constructor(apiKey) {\n')
    indent++;
    write('this.rest = new Rest(apiKey);\n');
    for (let index = 0; index < classes.length; index++) {
        const element = classes[index];
        write('this.'+element.shortName+' = new '+element.className+'(this.rest);\n');
    }
    indent--;
    write('}\n\n');
    write('get apiKey() { return this.rest.apiKey; }\n');
    write('set apiKey(apiKey) { this.rest.apiKey = apiKey; }\n');
    indent--;
    write('}\n');

    write('\n\n');
    write('module.exports = Vultr;\n');

    api.end();

};


main();