(function($){
	$.fn.bgLazyload = function(){
		var _win = $(window);
		var _this = this;
		var _tick = false; //控制 scroll 触发频率
		var _elements = [];

		var loadBackground = function(elem, src, callback){
			var tmpImage = new Image()
			tmpImage.onload = function(e){
				elem.css('background-image', 'url(' + e.target.src + ')');
				elem.data('fm-bgloaded', true);
				elem.removeAttr('bg-src');

				if(callback){callback()}
			}
			tmpImage.src = src;
		}
		var isLoaded = function(elem){
			return elem.data('fm-bgloaded') === true ? true : false;
		}
		// 检测是否需要加载
		// @param elem {jQuery Object}
		var checkNeedLoad = function(elem){
			if(isLoaded(elem)){
				return false;
			}

			var winTop = _win.scrollTop(),
				winBottom = winTop + _win.height(),
				elemTop = elem.offset().top,
				elemBottom = elemTop + elem.outerHeight(true);
			if(winTop > elemTop && winTop < elemBottom){ //顶部相交
				return true;
			}else if(winBottom > elemTop && winBottom < elemBottom){ //底部相交
				return true;
			}else if(winTop < elemTop && winBottom > elemBottom){ //图片小于窗口且内部包含
				return true;
			}else if(winTop > elemTop && winBottom < elemBottom){//图片大于窗口且纵跨窗口
				return true;
			}

			return false;
		}
        var screenoutUrl = function(bgimg){
            var res = bgimg.match(/(http(?:s)?:\/\/.*?)(?:"|\))/);
            return res?res[1]:false;
        }


		// 初始化时先刷一遍，看看是否有需要加载的图片
		_this.each(function(index, element){
			var _elem = $(element);
			var _img = screenoutUrl(_elem.css('background-image'));
            if(!_img){
                return true;
            }
			_elem.css('background-image', 'none');
			_elem.attr('bg-src', _img);
			if(checkNeedLoad(_elem)){
				loadBackground(_elem, _img)
			}
		});

		window.addEventListener('scroll', function lazyload(e){
			if(!_tick){ // 优化 scroll 事件性能
				_tick = true;
				_elements = $.grep(_this, function(e, i){
					return !isLoaded($(e));
				})
				$.each(_elements, function(index, element){
					var _elem = $(element);
					if(checkNeedLoad(_elem)){
						loadBackground(_elem, _elem.attr('bg-src'))
					}
				});
				//当没有需要加载背景图像的时候，就去掉对懒加载的 scroll 事件
				if(_elements.length === 0){
					window.removeEventListener('scroll', lazyload);
				}
				_tick = false;
			}

		})
	}
})(jQuery);
