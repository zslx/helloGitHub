'use strict';
const argv = process.argv;
// process.argv [ 'node', 'argv1my.js', 'argv2first', 'argv3second' ]

const fs = require('fs'), _BOM = /^\uFEFF/;

var name = argv[2];
if(!name) {
    console.log('no template file name.');
    return;
}

var path = require('path')
, dirname = path.dirname
, extname = path.extname
, resolve = path.resolve
, includePath = resolve(dirname(__filename), name)
, ext = extname(name);

console.log(includePath);

const template = fs.readFileSync(includePath).toString().replace(_BOM, '');
var str = template;

// const pat= new RegExp('(<%%|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)');
const pat= new RegExp('<%%|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>');
const commentpat = new RegExp('<!--|-->');

// ejsparse();
beforeRender(template);

function ejsparse() {
    var result = pat.exec(str),
        arr = [], firstPos, lastPos;
    console.log(result);

    while (result) {
        firstPos = result.index;
        lastPos = pat.lastIndex;

        if (firstPos !== 0) {
            arr.push(str.substring(0, firstPos));
            str = str.slice(firstPos);
        }

        arr.push(result[0]);
        str = str.slice(result[0].length);
        result = pat.exec(str);

        console.log('\n',result,'\n');
        
    }

    if (str) {
        arr.push(str);
    }
    console.log(`${arr.length}\n${arr}`);
}

// 收集 registerxxx:
function beforeRender(html){
    // <!-- registerCSSFile:/v/welcome.css -->
    // <!-- registerJSFile:/v/welcome.js?v=4 -->
    let result=commentpat.exec(html),
        arr=[],
        begin=0,end=0;
    while(result) {
        begin = result.index;
        if(begin!==0) {
            // 前面有内容
            arr.push(html.substring(0, begin));
            html = html.slice(begin);
        }
        arr.push(result[0]);
        html = html.slice(result[0].length);
        result = commentpat.exec(html);
    }
    if(html.length>0) {
        arr.push(html);
    }
    // console.log(`${arr.length}\n`,arr);
    
    let scripts={jsfile:[],js:[],cssfile:[],css:[], html:[]}, comments=false;
    arr.forEach((line,index)=>{
        // console.log(`${index}:${line}\n`);
        switch(line) {
        case '<!--':
            if(arr[index+2]!=='-->') {
                throw new Error('<!-- without -->');
            }
            comments=true;
            break;
        case '-->':
            break;
        default:
            line = line.trim();
            if(comments) {
                let ii=line.indexOf(':'), kv=ii===-1?'':line.substr(0,ii);
                switch(kv) {
                case 'registerJSFile':
                    line = `<script src="${line.substr(ii+1)}"></script>`;
                    scripts.jsfile.push(line);
                    break;
                case 'registerCSSFile':
                    line = `<link href="${line.substr(ii+1)}" rel="stylesheet">`;
                    scripts.cssfile.push(line);
                    break;
                case 'registerJS':
                    scripts.js.push(line.substr(ii+1));
                    break;
                case 'registerCSS':
                    scripts.css.push(line.substr(ii+1));
                    break;
                default:
                }
            }else{
                if(line) {
                    scripts.html.push(line);
                }
            }
            comments=false;
        }
    });
    
    console.log(scripts);
    console.log(`${scripts.html}`);
}
