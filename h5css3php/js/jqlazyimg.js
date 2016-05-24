// <img width=176 height=132 src="<?=IMG_PLACEHOLDER?>" original="<?=$imgw1[2]['img_176x132']?>" />
$(function(){
	var img_array=[],img=null, imgs = document.getElementsByTagName('img'),i=0,l=imgs.length;
	for(i=0;i<l;++i) {
		img_array.push(imgs[i]);
	}
	var n=img_array.length, $w=$(window), wh=$w.height(),src='';
	document.onscroll = function(e) {
		for(i=0;i<n;++i) {
			if($(img_array[i]).offset().top < wh+$w.scrollTop()) {
				img=img_array.splice(i,1);
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
});
