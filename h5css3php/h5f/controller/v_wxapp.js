// 具体业务代码
$(function(){

	$('#tdi').click(function(){
		vve.loadTpl('tdi');
		$(this).unbind('click');
	});

	$('#imgtxt').click(function(){
		vve.loadPiece('imgtxt');
		$(this).unbind('click');
	});

	$('#ninetypebtn').click(function(){
		var type=$('#ninetype').val(),
		url = '/h5f/business/9type.php?t='+type,
		timeout=parseInt($('#timeout').val());
		function successf(data){
			$('#ninetypeshow').html('<pre class="">第'+ type +'型：'+ data +'</pre>');
		}
		function errorf(data){
			vve.clog(data);
		}
		vve.ajxget(url, timeout, successf, errorf);
	});









	// beats
	var btv=document.getElementById('beats'), beatsworker=null;
	$('#beatstart').click(function(){
		if(Worker!==undefined) {
			beatsworker = new Worker('./controller/v_beats_worker.js');
			beatsworker.postMessage({'cmd': 'start', 'msg': 'Hi'}); //start the worker
			vve.addHandler(beatsworker,'message',function(e) {
				btv.innerHTML = e.data;
			});
			this.innerHTML='worker ok';
		}else{
			this.innerHTML='不支持 worker';
		}
	});
	$('#beatstop').click(function(){
		beatsworker.postMessage({'cmd': 'stop', 'msg': 'Bye'});
		// beatsworker.terminate();
		// beatsworker=null;
	});


	$('#worker_loader').click(function(){
		beatsworker.postMessage({'cmd': 'load', 'msg': '/h5f/controller/v_worker_loader.js'});
	});

	// sse
	$('#initsse').click(function(){
		if(window.EventSource !== undefined) {
			vve.initSSE();
		}else{
			this.innerHTML='not support SSE.';
		}
	});


	// listen
	var $wst = $('#wsrtxt');
	function listen(event){
		// 听什么是业务部分
		vve.clog(event.data);
		$wst.html(event.data);
	}

	$('#wsinitbtn').click(function(){
		if(window.WebSocket !== undefined) {
			vve.initWebsocket(listen);
		}else{
			this.innerHTML = 'not support Websocket';
		}
	});

	$('#wsbtn').click(function(){
		vve.sendWSData($('#wsdata').val());
	});

});
