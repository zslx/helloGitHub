(function(env){
	var z = {};					
	if(env.zsl===undefined) { env.zsl = z; }else{ z = env.zsl; } // 不覆盖
	if(z.loaded!==undefined) { return; }						 // 防止重复加载!
	z.loaded=true;
	
	z.extend=function(o){
		var k,target=this;
		// alert(this===z);
		for(k in o) {
			target[k]=o[k];
		}
	};

	zsl.extend({				// study from jquery
		namespace: function(ns) {
			var parts=ns.split('.'),object=this,i,len,sub;
			for(i=0,len=parts.length; i<len;++i) {
				sub = parts[i];
				// zsl.clog('sub ns:'+i+' '+sub);
				if(!object[sub]) {
					object[sub] = {};
				}
				object = object[sub];
			}
			return object;
		}
	});
	// 在 zsl 中创建新 namespace:
	// zsl.namespace('bbs.ui'), zsl.namespace('blog.ui.event')
	// 得到: zsl.bbs.ui,  zsl.blog.ui.event

	z.showViewportSize = function() {
		var the_width = $(window).width();
		var the_height = $(window).height();                   
		$('#width').text(the_width);
		$('#height').text(the_height);
	};

	z.clog = function(){		// 条件预加载，防止重复判断
		if(typeof console === 'object'){
			return function(msg){ console.log(msg); };
		}else if(typeof opera === 'object'){
			return function(msg){ opera.postError(msg);};
		}else if(typeof java ==='object' && typeof java.lang === 'object'){
			return function(msg){ java.lang.System.out.println(msg);};
		}
	}();						// 函数表达式可以这样立即执行并赋值

	z.itype = function (obj,type) {
		return (type === "Null" && obj === null) ||
			(type === "Undefined" && obj === void 0 ) ||
			(type === "Number" && isFinite(obj)) ||
			Object.prototype.toString.call(obj).slice(8,-1) === type;
	}
	z.namespace('css');	// z.css
	z.namespace('jss');	// z.jss



	// websocket private
	function onOpen(evt) {
		writeToScreen("CONNECTED");
		// doSend("WebSocket rocks");
	}
	function onClose(evt) {
		writeToScreen("DISCONNECTED");
	}
	function onMessage(evt) {
		writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
		z.websocket.close();
	}
	function onError(evt) {
		writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
	}

	function doSend(message) {
		writeToScreen("SENT: " + message);
		z.websocket.send(message);
	}
	function writeToScreen(message) {
		var pre = document.createElement("p");
		pre.style.wordWrap = "break-word";
		pre.innerHTML = message;
		z.output.appendChild(pre);
	}
	// window.addEventListener("load", init, false);

	z.wsend = doSend;
	z.initWebSocket = function (tagid) {
		var wsUri = "ws://echo.websocket.org/";
		z.output = document.getElementById(tagid);
		z.websocket = new WebSocket(wsUri);
		z.websocket.onopen = function(evt) { onOpen(evt) };
		z.websocket.onclose = function(evt) { onClose(evt) };
		z.websocket.onmessage = function(evt) { onMessage(evt) };
		z.websocket.onerror = function(evt) { onError(evt) };
	}




	z.extend({
		zlog:function(msg, clr) {
			var cmdw = document.getElementById('zsl_debug_log_div'),$v,
			pn=document.getElementById('debug');
			if(cmdw === null) {
				cmdw = document.createElement('DIV');
				$v=$(cmdw);
				$v.attr('id','zsl_debug_log_div');
				$v.css({padding:'2px',width:'80%'});

				if(pn===null){
					if(document.body) {
						document.body.appendChild(cmdw);
					}else{
						document.bodyElement.appendChild(cmdw);
					}
				}else{
					pn.appendChild(cmdw);
				}
				$v.dblclick(function(){ $v[0].parentNode.removeChild($v[0]);} );
			}else{
				$v=$(cmdw);
			}
			if(typeof(msg)=== 'object') {
				var ss='',x;
				for(x in msg) {
					ss+=x+' : '+msg[x] + '<br>';
				}
				// if(append!==undefined) {
				if(clr!==undefined) {
					cmdw.innerHTML=ss;
				}else{
					cmdw.innerHTML += ss;
				}
			}else{
				if(clr!==undefined) {
					cmdw.innerHTML=msg;
				}else{
					cmdw.innerHTML += msg;
				}
			}
			cmdw.innerHTML += '<hr>';
		},
		addHandler:function(element, type, handler, bb) {
			if(element.addEventListener) {
				arguments.callee=function(element, type, handler, bb){
					element.addEventListener(type, handler, bb!==undefined);
				}				// 使用延迟加载技术 避免重复判断
			}else if(element.attachEvent) {
				arguments.callee=function(element, type, handler, bb){
					// element.attachEvent('on'+type, handler);
					element.attachEvent('on'+type,function(){handler.call(element);});
				}
			}else{
				arguments.callee=function(element, type, handler, bb){
					element['on'+type] = handler;
				}
			}
			arguments.callee(element, type, handler, bb);
		},
		removeHandler:(function() {
			if(document.addEventListener) {
				return function(element, type, handler, bb) {
					element.removeEventListener(type, handler, bb!==undefined);
				};				// 使用条件加载技术 避免重复判断
			}else if(document.attachEvent) {
				return function(element, type, handler, bb) {
					element.detachEvent('on'+type, handler);
				};
			}else{
				return function(element, type, handler, bb) {
					element['on'+type] = null;
				};
			}
		})(),
		createXHR: function() {
			if(typeof XMLHttpRequest !== 'undefined') {
				createXHR = function(){ // 延迟加载，重写现有函数，防止重复判断
					return new XMLHttpRequest();
				}
			}else if(typeof ActiveXObject !== 'undefined') {
				if(typeof arguments.callee.activeXv !== 'string') {
					var versions=['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'],i,len,xhr=null;
					for(i=0,len=versions.length;i<len;++i) {
						try{
							xhr=new ActiveXObject(versions[i]);
							arguments.callee.activeXv=versions[i];
							delete xhr; xhr=null;
							break;
						}catch(ex){}
					}
				}
				createXHR = function(){
					return new ActiveXObject(arguments.callee.activeXv);
				}
			}else{
				throw new Error('No XHR object available.');
			}
			return createXHR();
		},

		ajxpost: function(url,data,timeout,okf,errf) {
			var xhr = z.createXHR(), tot=null;

			xhr.onreadystatechange=function() {
				z.clog('post readyState:'+xhr.readyState+' status:'+xhr.status);
				if(xhr.readyState===4 && xhr.status===200) {
					if(tot!==null) {
						clearTimeout(tot); tot=null;
					}
					z.clog('responseHeader:'+xhr.getResponseHeader('Date')+'<br>'+xhr.getAllResponseHeaders());
					okf(xhr.responseText);
					xhr=null;	// 释放内存
				}
			}

			xhr.open('POST', url, true);
			z.clog('post open');
			xhr.setRequestHeader('myfav','xyqt');
			xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded'); // 必须？

			tot = setTimeout(function() {
				xhr.abort();
				// delete xhr;
				xhr=null;
				errf('ajax 超时');
			}, timeout);
			xhr.send(data);
			z.clog('post send');
		},

		ajxget: function(url, timeout, okf, errf) {
			var xhr = z.createXHR(), tot=null;

			xhr.onreadystatechange=function() {
				z.clog('get readyState:'+xhr.readyState+' status:'+xhr.status);
				if(xhr.readyState===4 && xhr.status===200) {
					if(tot!==null) {
						clearTimeout(tot); tot=null;
					}
					z.clog('responseHeader:'+xhr.getResponseHeader('Date')+'<br>'+xhr.getAllResponseHeaders());
					okf(xhr.responseText);
					xhr=null;	// 释放内存
				}
			}

			xhr.open('GET', url, true);
			z.clog('get open');
			xhr.setRequestHeader('myfav','xfzg');

			tot = setTimeout(function() {
				xhr.abort();
				// delete xhr;
				xhr=null;
				errf('ajax 超时');
			}, timeout);
			xhr.send(null);
			z.clog('get send');
		},

		loadcss:function(css,cb){
			var c=document.createElement('link'),cc=null,l=css.length,i=0,
			head=document.documentElement.getElementsByTagName('head')[0],
			s='',loaded=true;

			if(z.itype(css,'Array')) {
				for(i=0;i<l;++i) {
					s = css[i];
					if( z.css[ s ] === undefined ) {
						z.css[ s ] = 1;
						cc = c.cloneNode();
						cc.rel='stylesheet';
						cc.type='text/css';
						cc.href = s;
						head.appendChild(cc);
					}else{
						z.css[ s ] += 1;
						z.clog(z.css[s] + ' 已经加载过 '+ s);
					}
				}
			}else{
				if( z.css[ css ] === undefined ) {
					z.css[ css ] = 1;
					c.rel='stylesheet';
					c.type='text/css';
					c.href=css;
					head.appendChild(c);
					cc=c;
				}else{
					z.css[ css ] += 1;
					z.clog(z.css[css] + ' 已经加载过 '+ css);
				}
			}
			if(cb!==undefined) {
				if(loaded) {
					cb();
					return;
				}
				z.addHandler(cc,'load', cb);
			}
		},

		loadjs:function(fjs,cb,cs){
			var j=document.createElement('script'),jc=null,i=0,l=fjs.length,
			head=document.documentElement.getElementsByTagName('head')[0],
			charset = (cs===undefined?'utf-8':cs), s='', loaded=true;

			if(z.itype(fjs,'Array')) {
				for(i=0;i<l;++i) {
					s = fjs[i];
					if( z.jss[ s ] === undefined ) {
						z.jss[s] = 1;
						jc = j.cloneNode();
						jc.src = s;
						jc.charset = charset;
						head.appendChild(jc);
						loaded = false;
					}else{
						z.jss[s] +=1;
						z.clog(z.jss[s] + ' 已经加载过 '+ s);
					}
				}
			}else{
				if( z.jss[ fjs ] === undefined ) {
					z.jss[ fjs ] = 1;
					j.src=fjs;
					head.appendChild(j);
					jc = j;
					jc.charset = charset;
					loaded = false;
				}else{
					z.jss[fjs] +=1;
					z.clog(z.jss[fjs] + ' 已经加载过 '+ jfs);
				}
			}
			if(cb!==undefined) {
				if(loaded) {
					cb();
					return;
				}
				z.addHandler(jc,'load', cb);
				z.addHandler(jc,'readystatechange', function() {
					if(this.readyState==='loaded' || this.readyState==='complete') {
						cb.call(this);
					}
				});				// for IE<9
			}
		},


	});
})(window);

$(function(){
	window.singletonBtn=function() {
		var pn=document.getElementById('webcom'),btn=null,ic=0,seedbtn=null;
		if(seedbtn===null) {
			seedbtn=document.createElement('button');
			if(pn===null) {
				// pn=document.getElementsByTagName('body')[0];
				pn=document.body;
			}
			// zsl.zlog('new button only once?!',true);
		}
		return {
			add:function(name,handler,parent){
				++ic;
				btn=seedbtn.cloneNode();
				btn.id='dtn'+ic;
				btn.onclick=handler;
				btn.innerHTML=name;
				if(parent!==undefined) pn=parent;
				pn.insertBefore(btn,pn.firstChild);
				return btn;
			}
		};
	}();
});
