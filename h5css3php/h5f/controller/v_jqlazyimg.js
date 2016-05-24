// <img width=176 height=132 src="<?=IMG_PLACEHOLDER?>" original="<?=$imgw1[2]['img_176x132']?>" />
vve.extend({

	lazyimgsload:function(ev){
		var n=vve.img_array.length, $w=$(window), wh=$w.height(),src='';
		window.onresize = document.onscroll = function(e) {
			// vve.clog('lazyimgsload');
			for(i=0;i<n;++i) {
				if($(vve.img_array[i]).offset().top < wh+$w.scrollTop()) {
					img=vve.img_array.splice(i,1); // 加载过的剔除
					--n;
					// console.log(img[0]);
					src = img[0].getAttribute('original');
					if (src) {
						img[0].src=src;
						img[0].removeAttribute('original');
					}
				}
			}
		}
	},
	
	lazyimgsinit:function(){
		vve.img_array=[];
		var img=null, imgs = document.getElementsByTagName('img'),i=0,l=imgs.length;

		for(i=0;i<l;++i) {
			vve.img_array.push(imgs[i]);
		}
		vve.lazyimgsload();
	},

});

// 运行它
$(function(){ vve.lazyimgsinit(); });
