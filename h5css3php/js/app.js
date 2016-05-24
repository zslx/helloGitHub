zsl.extend({
	jump:function(id){
		document.getElementById(id).scrollIntoView();
	},

	loadHtml: function(url) {
		var xhr = zsl.createXHR();
		xhr.open('GET', url, false); // false 阻塞式同步调用
		// 同步调用时，都阻塞，包括setTimeout，超时设置只能服务器处理
		xhr.setRequestHeader('tpl','html');
		try{
			xhr.send(null);
		}catch(ex){
			zsl.clog('ajax 超时：断网处理');
		}
		zsl.clog('loadhtml send');
		return xhr.responseText;
	},

	loadModule: function(pnode, html, css, js, charset) {
		// var jsons = '{"s1":"aa","s4":"xx","s2":"yy"}';
		// var json = JSON.parse(jsons);

		// load html
		var piece = zsl.loadHtml(html);
		pnode.innerHTML = piece;
		// load css and js
		zsl.loadcss(css, function() {
			zsl.loadjs(js, function() {}, charset);
		});
	},

});

zsl.clog(window.localStorage);

$(function(){
	singletonBtn.add('超时处理', ajaxTimeout);

	function ajaxTimeout(){

		zsl.ajxpost('ajax.php','postdatas=测试 Ajax（异步） 超时', 8000,function(ret){
			zsl.zlog(ret);
		},function(err){
			zsl.zlog(err);
		});

	}

	singletonBtn.add('加载组件', function() {
		// <noscript id="data-json">
		//   {"html":"ajax.php?getparams=focus-box",
		//   "css":["/webd/xcar/css/index.css"],
		//   "js":["/webd/xcar/js/public_func.js","/webd/tpl/f1.js"],
		//   "pid":"module-node"
		//   }
		// </noscript>
		// <div id="module-node"></div>
		
		var ds = document.getElementById('data-json'),
		json = JSON.parse(ds.innerHTML),
		pn = document.getElementById(json.pid);
		zsl.zlog(json, true);
		zsl.loadModule(pn, json.html, json.css, json.js, 'gb2312');
	});
	
});
