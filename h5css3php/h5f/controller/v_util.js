function VVEngine(env){
	var z = {};					
	if(env.vve===undefined) { env.vve = z; }else{ z = env.vve; } // 不覆盖
	if(z.loaded!==undefined) { return; }						 // 防止重复加载!
	z.loaded=true;
	
	z.extend=function(o){
		var k,target=this;
		// alert(this===z);
		for(k in o) {
			target[k]=o[k];
		}
	};

	z.extend({				// study from jquery
		namespace: function(ns) {
			var parts=ns.split('.'),object=this,i,len,sub;
			for(i=0,len=parts.length; i<len;++i) {
				sub = parts[i];
				// vve.clog('sub ns:'+i+' '+sub);
				if(!object[sub]) {
					object[sub] = {};
				}
				object = object[sub];
			}
			return object;
		},
		// create a in-memory div, set it's inner text(which jQuery automatically encodes) then grab the encoded contents back out.  The div never exists on the page.
		htmlEncode:function(value) {
			return $('<div/>').text(value).html();
		},
		htmlDecode:function(value) {
			return $('<div/>').html(value).text();
		},

	});
	// 在 vve 中创建新 namespace:
	// vve.namespace('bbs.ui'), vve.namespace('blog.ui.event')
	// 得到: vve.bbs.ui,  vve.blog.ui.event


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
		z.output = document.getElementById(tagid);

		var wsUri = "ws://localhost:8080/";
		z.websocket = new WebSocket(wsUri);

		z.websocket.onopen = function(evt) { onOpen(evt) };
		z.websocket.onclose = function(evt) { onClose(evt) };
		z.websocket.onmessage = function(evt) { onMessage(evt) };
		z.websocket.onerror = function(evt) { onError(evt) };
	}



	z.extend({
		initSSE:function() {
			var eSource = new EventSource("/h5f/business/sse.php"); 

			z.addHandler(eSource, 'open', function(e) {
				z.clog('SSE opened');
			});

			eSource.onerror = function(err) {
				// onmessage, onerror 都触发了！？
				z.clog('error:'+err.eventPhase);
			};

			eSource.onmessage = function(event) {
				z.clog('onmessage');
				z.clog(event);
				// z.clog(event.data);
			};

			z.addHandler(eSource, 'ssetime', function(e) {
				z.clog('ssetime:'+ e.data);
			});

			z.addHandler(eSource, 'myevent', function(e) {
				z.clog('myevent:'+ e.data);
			});

		},
		initWebsocket:function(onmessage){
			// listen
			if(window.WebSocket !== undefined) {

				function wserror(event) {
					vve.clog("Error: " + event.data);
					// vve.clog(event);
				}
				function wsopen(e) {
					vve.clog('websocket connected');

					var message='Open:测试 来自 websocket';
					connection.send(message);

				}
				function wsclose(e) {
					vve.clog('websocket closed:'+e.code+' '+e.reason);
				}

				function wsmessage (event) {
					vve.clog(event.data);
				}

				var connection = new WebSocket('ws://localhost:8080');
				connection.onopen = wsopen;
				connection.onclose = wsclose;
				connection.onerror = wserror;
				if(onmessage !== undefined ) {
					connection.onmessage = onmessage;
				}else{
					connection.onmessage = wsmessage;
				}
				z.wsc = connection;
			}
		},
		sendWSData:function(data) {
			if(z.wsc !== undefined) {
				z.wsc.send(data);
			}else{
				z.clog('没有建立 websocket 链接');
			}
		},

		zlog:function(msg, clr) {
			var cmdw = document.getElementById('vve_debug_log_div'),$v,
			pn=document.getElementById('debug');
			if(cmdw === null) {
				cmdw = document.createElement('DIV');
				$v=$(cmdw);
				$v.attr('id','vve_debug_log_div');
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

		// 
		ajxpost: function(url,data,timeout,okf,errf) {
			var xhr = z.createXHR(), tot=null;

			xhr.onreadystatechange=function() {
				z.clog('post readyState:'+xhr.readyState+' status:'+xhr.status);
				if(xhr.readyState===4 && xhr.status===200) {
					if(tot!==null) {
						clearTimeout(tot); tot=null;
					}
					// z.clog('responseHeader:'+xhr.getResponseHeader('Date')+'<br>'+xhr.getAllResponseHeaders());
					okf(xhr.responseText);
					xhr=null;	// 释放内存
				}
			}

			xhr.open('POST', url, true);
			// z.clog('post open');
			xhr.setRequestHeader('myfav','xyqt');
			xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded'); // 必须？

			tot = setTimeout(function() {
				xhr.abort();
				// delete xhr;
				xhr=null;
				errf('ajax 超时');
			}, timeout);
			xhr.send(data);
			// z.clog('post send');
		},

		ajxget: function(url, timeout, okf, errf) {
			var xhr = z.createXHR(), tot=null;

			xhr.onreadystatechange=function() {
				z.clog('get readyState:'+xhr.readyState+' status:'+xhr.status);
				if(xhr.readyState===4 && xhr.status===200) {
					if(tot!==null) {
						clearTimeout(tot); tot=null;
					}
					// z.clog('responseHeader:'+xhr.getResponseHeader('Date')+'<br>'+xhr.getAllResponseHeaders());
					okf(xhr.responseText);
					xhr=null;	// 释放内存
				}
			}

			xhr.open('GET', url, true);
			// z.clog('get open');
			xhr.setRequestHeader('myfav','xfzg');

			tot = setTimeout(function() {
				xhr.abort();
				// delete xhr;
				xhr=null;
				errf('ajax 超时了');
			}, timeout);
			xhr.send(null);
			// z.clog('get send');
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

		loadLayout:function(id,callback) {
			var container = document.getElementById('layout'),
			jiekou = '/h5f/layout/'+id+'.html';


			// 观察变动
			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
			var mo = new MutationObserver(function(records){mo.takeRecords(); mo.disconnect();  callback(); });
			var option = {
				'childList': true, 
				'subtree': true
			};
			mo.observe(container, option);

			z.ajxget(jiekou, 1000, function ok(d){
				container.innerHTML = d;
			}, function err(d){
				container.innerHTML = d;
			});

			// if(callback !== undefined) {
			// 	var to=setTimeout(callback,1000);
			// }

			// container.onload=callback;
			// container.onchange=callback;

		},

		loadPiece:function(id,callback) {
			var container = document.getElementById(id),
			jiekou = '/h5f/controller/loadmodule.php?id='+id;

			z.ajxget(jiekou, 1000, function ok(d){
				container.innerHTML = d;
			}, function err(d){
				container.innerHTML = d;
			});
			if(callback !== undefined) {
				callback();
			}
		},

		renderTpl:function(tpl,data){
			var k='',v='',r=tpl;
			for(x in data) {
				k = '[='+x+']';
				r = r.replace(k, data[x]);
			}
			return r;
		},
		loadTpl:function(id, callback) {
			var container = document.getElementById(id),
			data,tpl='/h5f/component/'+id+'.html';

			z.ajxget(tpl, 1000, function ok(t){
				data = JSON.parse('{"title":"V积分活动","desc":"看看你的传播力","picture":"/h5f/res/1.jpg"}');
				container.innerHTML = z.renderTpl(t, data);
			}, function err(d){
				container.innerHTML = d;
			});
			if(callback !== undefined) {
				callback();
			}			
		},

	});
}
