/*
 * banner-fade-slider
 * https://github.com/lemonroot/banner-fade-slider
 *
 * Copyright (c) 2013 lemonlwz
 * Licensed under the MIT license.
 */

(function($) {

  var method = {
    init: function(elem, options){
      options.elem = elem;
      options.wrap = elem.find(options.containerCls);
      options.items = options.wrap.find(options.itemCls);
      this.initBg(options.items);
      options.numberWrap = this.initNumber(options);
      options.width = elem.width();
      options.height = elem.height();

      options.items.css({'z-index': 1});
      $(options.items[0]).css({'z-index': 2});

      switch(options.anim){
        case 'slideup':
          this.initSlideUpItems(options);
          break;
        case 'slide':
          this.initSlideItems(options);
          break;
        case 'fade':
        default:
          this.initFadeItems(options);
      }

      this.initEvent(options);
      if(options.auto){
        this.setAuto(options);
      }
    },
    initEvent: function(options){
      var elem = options.elem;
      var items = options.items;
      var _this = this;

      if(items.length <= 1){
        return false;
      }

      elem.on('mouseenter mouseleave', function(evt){
        if(!options.auto){
          return false;
        }
        if(evt.type === 'mouseenter'){
          _this.slideStop(options);
        } else {
          _this.setAuto(options);
        }
      });
      elem.on('click', options.numberCls + ' a', function(evt){
        _this.slideStop(options);
        var index = parseInt($(evt.target).text(), 10);
        _this.setActive(index, options);
        _this.setAuto(options);
        return false;
      });

      elem.on('click', '.J_prev', function(evt){
        _this.slideStop(options);
        var index = _this.index - 1;
        if(index < 0){
          index = _this.items.length - 1;
        }
        _this.setActive(index, options);
        _this.setAuto(options);
        return false;
      });

      elem.on('click', '.J_next', function(evt){
        _this.slideStop(options);
        var index = _this.index + 1;
        if(index >= _this.items.length){
          index = 0;
        }
        _this.setActive(index, options);
        _this.setAuto(options);
        return false;
      });

      options.items.on('click', function(evt){
        //window.location.href = $(evt.currentTarget).attr('href');
        var href = $(evt.currentTarget).attr('href');
        if(href){
          window.open(href, '_blank');
        }
      });
    },
    slideStop: function(options){
      clearInterval(options.timer);
    },
    setAuto: function(options){
      var elem = options.elem;
      clearInterval(options.timer);
      var _this = this;
      options.timer = setInterval(function(){
        var index = (options.index + 1) % options.items.length;
        _this.setActive(index, options);
      }, options.delay);
    },
    setActive: function(index, options){
      var items = options.items,
          numberElems = options.numberWrap.find('a'),
          length = items.length;
      index = index >= length ? length-1 : index;

      if(options.index === index){
        return;
      }

      switch(options.anim){
        case 'slideup':
          this.slideUpAnim(index, options);
          break;
        case 'slide':
          this.slideAnim(index, options);
          break;
        case 'fade':
        default:
          this.fadeAnim(index, options);
      }

      $(numberElems[options.index]).removeClass('active');
      $(numberElems[index]).addClass('active');
      options.index = index;
    },
    slideUpAnim: function(index, options){
      var wrap = options.wrap,
          height = options.height;

      if(method._hadTransition){
        $(wrap).css({'top': -index * height + 'px'});
      } else {
        $(wrap).animate({
          'left': -index * height + 'px'
        }, .8);
      }
    },
    slideAnim: function(index, options){
      var wrap = options.wrap,
          width = options.width;

      if(method._hadTransition){
        $(wrap).css({'left': -index * width + 'px'});
      } else {
        $(wrap).animate({
          'left': -index * width + 'px'
        }, .8);
      }
    },
    fadeAnim: function(index, options){
      var items = options.items;
      if(method._hadTransition){
        $(items[options.index]).css({'opacity': 0, 'z-index': 1});
        $(items[index]).css({'opacity': 1, 'z-index': 2});
      } else {
        $(items[options.index]).animate({
          'opacity': 0,
          'z-index': 1
        }, 800);
        $(items[index]).animate({
          'opacity': 1,
          'z-index': 2
        }, 800);
      }
    },
    initBg: function(items){
      this.index = 0;
      items.each(function(k, v){
        var v = $(v);
        v.css({
          'background-image': 'url(' + v.attr('data-bg') + ')',
          'display': 'block',
          'opacity': !k? 1 : 0
        });
      });
    },
    initSlideUpItems: function(options){
      var elem = options.elem;
      var wrap = options.wrap;
      var items = options.items;
      var length = items.length;
      elem.css({
        'position': 'relative',
        'overflow': 'hidden'
      });
      wrap.css({
        'position': 'relative',
        'top': 0,
        'transition-property': 'top'
      });
      items.css({
        'position': 'relative',
        'opacity': 1
      });
    },
    initSlideItems: function(options){
      var elem = options.elem;
      var wrap = options.wrap;
      var items = options.items;
      var width = options.width;
      var length = items.length;
      elem.css({
        'position': 'relative',
        'overflow': 'hidden'
      });
      wrap.css({
        'position': 'relative',
        'left': 0,
        'width': width * length + 'px',
        'transition-property': 'left'
      });
      items.css({
        'position': 'relative',
        'float': 'left',
        'display': 'inline',
        'width': width + 'px',
        'opacity': 1
      });
    },
    initFadeItems: function(options){
      var wrap = options.wrap;
      var items = options.items;
      wrap.css({
        'position': 'relative'
      });
      items.css({
        'position': 'absolute',
        'left': 0,
        'top': 0
      });
    },
    initNumber: function(options){
      var length = options.items.length;
      var numberWrap = $('<div class="' + options.numberCls.slice(1) + '"></div>'),
          i, activeStr;
      if(length<=1){
        numberWrap.addClass('less-count');
      }
      var bd = $('<div class="bd"></div>');
      for(i=0; i<length; i++){
        activeStr = i===0 ? 'active' : '';
        bd.append('<a href="#" class="' + activeStr + '">' + i + '</a>');
      }
      numberWrap.append(bd);
      options.elem.append(numberWrap);
      return numberWrap;
    },
    _hadTransition: (function(){
      var name = 'transition',
          tempEl = document.createElement('div'),
          prefixs = ['Webkit', 'Moz', 'O'];
      if (tempEl.style[name] === undefined) {
        for(var i=0; i < prefixs.length; i++){
          name = prefixs[i] + 'Transition';
          if(tempEl.style[name] !== undefined){
            this._hadTransition = name;
            return name;
          }
        }
        this._hadTransition = null;
        return null;
      }
      this._hadTransition = true;
      return true;
    })(this)
  };

  // Collection method.
  $.fn.bannerFadeSlider = function(options) {
    var _elems = [];
    return $.extend(this.each(function(i) {
      // Do something bannerFadeSlider to each selected element.
      _elems.push($.bannerFadeSlider(this, options));
    }), {
      slideStop: function(){
        $(_elems).each(function(i){
          this.slideStop(options);
        });
      },
      setAuto: function(){
        $(_elems).each(function(i){
          this.setAuto(options);
        });
      },
      setActive: function(index){
        method.setActive(index, options);
      }
    });
  };

  // Static method.
  $.bannerFadeSlider = function(elem, options) {
    // Override default options with passed-in options.
    elem = $(elem);
    options = $.extend({}, $.bannerFadeSlider.options, options);
    // Return something bannerFadeSlider.
    method.init(elem, options);
    return $.extend({
      slideStop: function(){
        method.slideStop(options);
      },
      setAuto: function(){
        method.setAuto(options);
      },
      setActive: function(index){
        method.setActive(index, options);
      }
    }, elem);
  };

  // Static method default options.
  $.bannerFadeSlider.options = {
    punctuation: '.',
    containerCls: '.slider-container',
    itemCls: 'li',
    numberCls: '.slider-number',
    delay: 5E3,
    anim: 'fade',
    index: 0,
    auto: true
  };

}(jQuery));
