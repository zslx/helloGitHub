// onmessage =function (evt){
// 	var d = evt.data;			// get main thread data
// 	postMessage( d );			// post data to main thread
// }

// Worker 里，self 和 this 指的都是 Worker 的全局作用域

importScripts('/h5f/controller/v_worker.util.js');
var n=0, w_timer=null,url='/h5f/business/beats.php?n=';
self.addEventListener('message', function(e) {
	var data = e.data;
	switch (data.cmd) {
    case 'start':
		self.postMessage('WORKER STARTED: ' + data.msg);

		w_timer = setInterval(function(){
			vve.ajxget(url+n, 1000, function successf(d){
				n = parseInt(d);
				self.postMessage('beats:'+ d);
			}, function errorf(d){
				self.postMessage('beats[error]:'+ d);
			});
		}, 2000);

		break;
    case 'stop':
		self.postMessage('WORKER STOPPED: ' + data.msg);
		if(w_timer!==null) {clearInterval(w_timer);w_timer=null; }

		self.close(); // Terminates the worker.
		break;
	case 'load':
		// importScripts('a.js','b.js'); full path 需要全路径？
		importScripts(data.msg);
		// 都在 worker 作用域中
		break;
    default:
		self.postMessage('Unknown command: ' + data.msg);
	};
}, false);
