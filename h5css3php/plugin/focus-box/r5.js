/*
@ 朝革图
使用示例：
http://js.xcar.com.cn/ad/temporary_bubble/focus/1.php
*/

if(typeof console == 'undefined'){
	console = {log:function(){}};
}

var btnRoll = function(options){
	this.opts = {
		root: null,
		IntervalForPlay : 3000,
		iListWidth      : null,
		preCallBack		: null,
		nextCallBack	: null,
		playCallback	: null,
		nextCallBefore	: null,
		preCallBefore	: null,
		goToCallBack	: null,
		goToCallBefore	: null,
		playCallBefore	: null,
		stopCallBack	: null,
		compass         : 'left',
		easing			: "easeOutCirc"
	};
	if(typeof options == "object"){
		this.setOptions(options);
	}
	this.pOpts = {
		rootNode	: ((typeof this.opts.root == 'string') ? this.$$(this.opts.root) : this.opts.root)
	}
	this.pOpts.childNode = this.pOpts.rootNode.children.item(0);
	this.pOpts.iListWidth = (this.opts.iListWidth == null) ? this.pOpts.rootNode.children.item(0).offsetWidth : this.opts.iListWidth;
	this.pOpts.iListLength = this.pOpts.rootNode.children.length;
	this.pOpts.intervals = new Array();
	this.pOpts.RollIsRun = true;
	this.pOpts.isPlay = true;
	this.pOpts.preBefor = 1;
	this.pOpts.Interval = [];
	this.pOpts.playInterrupt = false;
	this.pOpts.page={
		pre		: 1,
		count : this.getPageCount()
	};
	window.isCGTr5 = true;
};
btnRoll.prototype = {
	constructor : btnRoll,
	setOptions	: function(options){
		var _this = this;
		(function(){for(var i in options){
			_this.opts[i] = options[i];
		}})();
	},
	getPageCount : function(){
		var s = this.pOpts.rootNode.getElementsByTagName(this.pOpts.childNode.tagName);
		var j = 0;
		for(var i=0,len=s.length;i<len;i++){
			if(s.item(i).parentNode === this.pOpts.rootNode){
				j++;
			}
		}
		return j;
	},
	$$	: function(id){
		return document.getElementById(id);
	},
	pre : function(){
		if(this.pOpts.RollIsRun && parseInt(this.pOpts.page.count)>1){
			this.pOpts.RollIsRun = false;
			var _this = this;
			var pOpts = _this.pOpts;
			var rootNode = _this.pOpts.rootNode;
			_this.pOpts.preBefor = _this.pOpts.page.pre;
			if(pOpts.page.pre <=1){
				var _this_pre = pOpts.page.count;
				if(typeof _this.opts.preCallBefore == "function"){_this.opts.preCallBefore(_this_pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
				rootNode.insertBefore(rootNode.children[pOpts.page.count-1],rootNode.firstChild);
				rootNode.style.left = - parseInt(pOpts.iListWidth) + "px";
				_this.G({Element:rootNode,Time:1000,Attr:_this.opts.compass,Value:0,Animation:_this.opts.easing,CallBack:function(){
					var node_count = pOpts.page.count - 1;
					var pageCount  = node_count;
					while(node_count--){
						rootNode.insertBefore(rootNode.children[pOpts.page.count-1],rootNode.firstChild);
						rootNode.style.left =  -parseInt(pOpts.iListWidth * (pageCount-node_count))+"px";
					}
					_this.pOpts.page.pre = pOpts.page.count;
					if(typeof _this.opts.preCallBack == "function"){_this.opts.preCallBack(_this.pOpts.page.pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
					_this.pOpts.RollIsRun = true;
				}});
			}else{
				var _this_pre = pOpts.page.pre - 1;
				if(typeof _this.opts.preCallBefore == "function"){_this.opts.preCallBefore(_this_pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
				_this.G({Element:rootNode,Time:1000,Attr:_this.opts.compass,Value:(  - parseInt(pOpts.iListWidth)*(pOpts.page.pre-2) ),Animation:_this.opts.easing,CallBack:function(){
					_this.pOpts.page.pre = pOpts.page.pre - 1;
					if(typeof _this.opts.preCallBack == "function"){_this.opts.preCallBack(_this.pOpts.page.pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
					_this.pOpts.RollIsRun = true;
				}});
			}
		}
	},
	next : function(){
		if(this.pOpts.RollIsRun && parseInt(this.pOpts.page.count)>1){
			this.pOpts.RollIsRun = false;
			var _this = this;
			var pOpts = _this.pOpts;
			var rootNode = _this.pOpts.rootNode;
			_this.pOpts.preBefor = _this.pOpts.page.pre;
			if(pOpts.page.pre >= pOpts.page.count){
				var _this_pre = 1;
				var node_count = pOpts.page.count-1;
				if(typeof _this.opts.nextCallBefore == "function"){_this.opts.nextCallBefore(_this_pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
				rootNode.appendChild(rootNode.children[0]);
				rootNode.style.left = "-" + parseInt(pOpts.iListWidth)*(pOpts.page.count-2)+"px";
				_this.G({Element:rootNode,Time:1000,Attr:_this.opts.compass,Value:parseInt("-" + parseInt(pOpts.iListWidth)*(pOpts.page.count-1)),Animation:_this.opts.easing,CallBack:function(){
						try{
							var i = 0;
							while(node_count--){
								i++;
								rootNode.appendChild(rootNode.children[0]);
								if(_this.pOpts.page.count==2){
									rootNode.style.left = '0px';
								}else{
									rootNode.style.left = -parseInt(pOpts.iListWidth * (node_count)) + "px";
								}
							}
						}catch(e){
						}
							_this.pOpts.page.pre = 1;
							if(typeof _this.opts.nextCallBack == "function"){_this.opts.nextCallBack(_this.pOpts.page.pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
							_this.pOpts.RollIsRun = true;
						
					}
				});
			}else{
				var _this_pre = pOpts.page.pre + 1;
				if(typeof _this.opts.nextCallBefore == "function"){_this.opts.nextCallBefore(_this_pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
				_this.G({Element:rootNode,Time:1000,Attr:_this.opts.compass,Value:(  - parseInt(pOpts.iListWidth)*(pOpts.page.pre) ),Animation:_this.opts.easing,CallBack:function(){
						_this.pOpts.page.pre = pOpts.page.pre + 1;
						if(typeof _this.opts.nextCallBack == "function"){_this.opts.nextCallBack(_this.pOpts.page.pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
						_this.pOpts.RollIsRun = true;
					}
				});
			}
		}
	},
	goTo : function(to){
		var _this = this;
		this.clearG(function(){
			if(_this.pOpts.RollIsRun || parseInt(_this.pOpts.page.count)>1){
				_this.pOpts.RollIsRun = false;
				var pOpts = _this.pOpts;
				var rootNode   = _this.pOpts.rootNode;
				var node_count = pOpts.page.count;
				var pageCount  = node_count;
				var _this_pre = parseInt(to);
				_this.pOpts.preBefor = _this.pOpts.page.pre;
				if(typeof _this.opts.goToCallBefore == "function"){_this.opts.goToCallBefore(_this_pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
				_this.G({
					Element : rootNode,
					Time : 1000,
					Attr : _this.opts.compass,
					Value : ( -parseInt(pOpts.iListWidth)*(to-1) ),
					Animation : _this.opts.easing,
					CallBack : function(){
						_this.pOpts.page.pre = parseInt(to);
						if(typeof _this.opts.goToCallBack == "function"){_this.opts.goToCallBack(_this.pOpts.page.pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
						_this.pOpts.RollIsRun = true;
						_this.setPlayInterrupt(false);
					}
				});
				_this.pOpts.page.pre = parseInt(to);
				return true;
			}else{
				return false;
			}
		});
	},
	setPlayInterrupt : function(f){
		this.pOpts.playInterrupt = f;
	},
	getPlayInterrupt : function(){
		return this.pOpts.playInterrupt;
	},
	getPage : function(){
		return this.pOpts.page;
	},
	setPage : function(p,j){
		this.pOpts.page.count = p;
		this.pOpts.page.pre = (typeof j != 'undefined')?j:0;
	},
	unSet : function(){
		this.stop();	//停止播放
		this.clearG(function(){	//停止滚动
			;	//释放变量
			this.pOpts = {};
			this.opts = {};
		});
	},
	play : function(){
		if(this.pOpts.isPlay && parseInt(this.pOpts.page.count)>1){
			this.pOpts.isPlay = false;
			var _this = this;
			_this.pOpts.intervals.push(
				setInterval(function(){
					_this.next();
				}, _this.opts.IntervalForPlay)
			);
			if(typeof _this.opts.playCallback == "function"){_this.opts.playCallback(_this.pOpts.page.pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
		}
	},
	stop : function(){
		var _this = this;
		(function(){for(var i in _this.pOpts.intervals){
			clearInterval(_this.pOpts.intervals[i]);
		}})();
		_this.pOpts.length = 0;
		if(typeof _this.opts.stopCallback == "function"){_this.opts.stopCallback(_this.pOpts.page.pre,_this.pOpts.page.count,_this.pOpts.preBefor);}
		this.pOpts.isPlay = true;
	},
	getPlayState : function(){
		return !this.pOpts.isPlay;
	},
	getBeforPage : function(){
		return _this.pOpts.preBefor;
	},
	getRollIsRun : function(){
		return this.pOpts.RollIsRun;
	},
	T : {
		Quad:{
			easeInQuad: function(x, t, b, c, d) {
				return c * (t /= d) * t + b
			},
			easeOutQuad: function(x, t, b, c, d) {
				return - c * (t /= d) * (t - 2) + b
			},
			easeInOutQuad: function(x, t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t + b;
				return - c / 2 * ((--t) * (t - 2) - 1) + b
			},
			easeInCubic: function(x, t, b, c, d) {
				return c * (t /= d) * t * t + b
			},
			easeOutCubic: function(x, t, b, c, d) {
				return c * ((t = t / d - 1) * t * t + 1) + b
			},
			easeInOutCubic: function(x, t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t + 2) + b
			},
			easeInQuart: function(x, t, b, c, d) {
				return c * (t /= d) * t * t * t + b
			},
			easeOutQuart: function(x, t, b, c, d) {
				return - c * ((t = t / d - 1) * t * t * t - 1) + b
			},
			easeInOutQuart: function(x, t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
				return - c / 2 * ((t -= 2) * t * t * t - 2) + b
			},
			easeInQuint: function(x, t, b, c, d) {
				return c * (t /= d) * t * t * t * t + b
			},
			easeOutQuint: function(x, t, b, c, d) {
				return c * ((t = t / d - 1) * t * t * t * t + 1) + b
			},
			easeInOutQuint: function(x, t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
			},
			easeInSine: function(x, t, b, c, d) {
				return - c * Math.cos(t / d * (Math.PI / 2)) + c + b
			},
			easeOutSine: function(x, t, b, c, d) {
				return c * Math.sin(t / d * (Math.PI / 2)) + b
			},
			easeInOutSine: function(x, t, b, c, d) {
				return - c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
			},
			easeInExpo: function(x, t, b, c, d) {
				return (t == 0) ? b: c * Math.pow(2, 10 * (t / d - 1)) + b
			},
			easeOutExpo: function(x, t, b, c, d) {
				return (t == d) ? b + c: c * ( - Math.pow(2, -10 * t / d) + 1) + b
			},
			easeInOutExpo: function(x, t, b, c, d) {
				if (t == 0) return b;
				if (t == d) return b + c;
				if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				return c / 2 * ( - Math.pow(2, -10 * --t) + 2) + b
			},
			easeInCirc: function(x, t, b, c, d) {
				return - c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
			},
			easeOutCirc: function(x, t, b, c, d) {
				return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
			},
			easeInOutCirc: function(x, t, b, c, d) {
				if ((t /= d / 2) < 1) return - c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
				return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
			},
			easeInElastic: function(x, t, b, c, d) {
				var s = 1.70158;
				var p = 0;
				var a = c;
				if (t == 0) return b;
				if ((t /= d) == 1) return b + c;
				if (!p) p = d * .3;
				if (a < Math.abs(c)) {
					a = c;
					var s = p / 4
				} else var s = p / (2 * Math.PI) * Math.asin(c / a);
				return - (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
			},

			easeOutElastic: function(x, t, b, c, d) {
				var s = 1.70158;
				var p = 0;
				var a = c;
				if (t == 0) return b;
				if ((t /= d) == 1) return b + c;
				if (!p) p = d * .3;
				if (a < Math.abs(c)) {
					a = c;
					var s = p / 4
				} else var s = p / (2 * Math.PI) * Math.asin(c / a);
				return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
			},
			easeInOutElastic: function(x, t, b, c, d) {
				var s = 1.70158;
				var p = 0;
				var a = c;
				if (t == 0) return b;
				if ((t /= d / 2) == 2) return b + c;
				if (!p) p = d * (.3 * 1.5);
				if (a < Math.abs(c)) {
					a = c;
					var s = p / 4
				} else var s = p / (2 * Math.PI) * Math.asin(c / a);
				if (t < 1) return - .5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
			},
			easeInBack: function(x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c * (t /= d) * t * ((s + 1) * t - s) + b
			},
			easeOutBack: function(x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
			},
			easeInOutBack: function(x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
				return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
			},
			easeOutBounce: function(x, t, b, c, d) {
				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b
				} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b
				} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b
				}
			}
		}
	},
	clearG : function(CF){
		this.setPlayInterrupt(true);
		for(var i=0,len=this.pOpts.Interval.length;i<len;i++){
			clearTimeout(this.pOpts.Interval[i]);
		}
		this.setPlayInterrupt(false);
		if(typeof CF == 'function')CF();
	},
	G : function (opts){
		var s = window.navigator.userAgent.toLowerCase().match(/msie/);
		var isIE = (s != null && typeof s[0] == 'string' && s[0]=='msie');
		function $chk(attr){
			return typeof attr != 'undefined'?true:false;
		}
		var _this = this;
		var arr = [];
		var E = $chk(opts.Element)?opts.Element:null;
		var S  = opts.Attr;
		var V  = opts.Value;
		var T  = $chk(opts.Time) ? opts.Time : 1000;
		var W  = $chk(opts.Animation) ? opts.Animation : 'easeInOutSine';
		var CF = $chk(opts.CallBack) ? opts.CallBack : null;
		var x = 0,
		b = ( E.style[S] == '') ? 0 : parseInt(E.style[S]),
		c = parseInt(V)-b,	
		t = 0;
		if(isIE){
			d = (T) / 40;
		}else{
			d = (T) / 22;
		}
		W = (W) ? W : 'easeInQuad';
		var T = this.T;
		function Run(){
			E.style[S] = Math.ceil(T.Quad[W](x,t,b,c,d))+'px';
				if(t<d){
					t++;
					if(!_this.getPlayInterrupt()){
						_this.pOpts.Interval.push(setTimeout(Run,25));
					}
				}else{
					E.style[S] = V+"px";
					if(typeof CF == 'function')CF();
				}
			
		}
		Run();
	},
	getQuad  : function(){
		return this.opts.easing;
	},
	setQuad  : function(str){
		this.opts.easing = str;
	},
	getQuads : function(){
		var temp_arr = [];
		for(var i in this.T.Quad){
			temp_arr.push(i);
		}
		return temp_arr;
	}
};