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
      this.elem = elem;
      this.options = options;
      this.anim = options.anim;
      this.wrap = this.elem.find(options.containerCls);
      this.items = this.wrap.find(options.itemCls);
      this.initBg(this.items);
      this.numberWrap = this.initNumber(this.items.length);
      this.width = elem.width();
      this.height = elem.height();

      this.items.css({'z-index': 1});
      $(this.items[0]).css({'z-index': 2});

      switch(this.anim){
        case 'slideup':
          this.initSlideUpItems();
          break;
        case 'slide':
          this.initSlideItems();
          break;
        case 'fade':
        default:
          this.initFadeItems();
      }

      this.initEvent();
      if(options.auto){
        this.setAuto();
      }
    },
    initEvent: function(){
      var _this = this,
          elem = this.elem;

      if(_this.items.length <= 1){
        return false;
      }

      elem.on('mouseenter mouseleave', function(evt){
        if(!_this.options.auto){
          return false;
        }
        if(evt.type === 'mouseenter'){
          _this.slideStop();
        } else {
          _this.setAuto();
        }
      });
      elem.on('click', this.options.numberCls + ' a', function(evt){
        _this.slideStop();
        var index = parseInt($(evt.target).text(), 10);
        _this.setActive(index);
        _this.setAuto();
        return false;
      });

      elem.on('click', '.J_prev', function(evt){
        _this.slideStop();
        var index = _this.index - 1;
        if(index < 0){
          index = _this.items.length - 1;
        }
        _this.setActive(index);
        _this.setAuto();
        return false;
      });

      elem.on('click', '.J_next', function(evt){
        _this.slideStop();
        var index = _this.index + 1;
        if(index >= _this.items.length){
          index = 0;
        }
        _this.setActive(index);
        _this.setAuto();
        return false;
      });

      _this.items.on('click', function(evt){
        //window.location.href = $(evt.currentTarget).attr('href');
        window.open($(evt.currentTarget).attr('href'), '_blank');
      });
    },
    slideStop: function(){
      clearInterval(this.timer);
    },
    setAuto: function(){
      clearInterval(this.timer);
      var _this = this;
      this.timer = setInterval(function(){
        var index = (_this.index + 1) % _this.items.length;
        _this.setActive(index);
      }, this.options.delay);
    },
    setActive: function(index){
      var items = this.items,
          numberElems = this.numberWrap.find('a'),
          length = items.length;
      index = index >= length ? length-1 : index;

      if(this.index === index){
        return;
      }

      switch(this.anim){
        case 'slideup':
          this.slideUpAnim(index);
          break;
        case 'slide':
          this.slideAnim(index);
          break;
        case 'fade':
        default:
          this.fadeAnim(items, index);
      }

      $(numberElems[this.index]).removeClass('active');
      $(numberElems[index]).addClass('active');
      this.index = index;
    },
    slideUpAnim: function(index){
      var wrap = this.wrap,
          height = this.height;

      if(method._hadTransition){
        $(wrap).css({'top': -index * height + 'px'});
      } else {
        $(wrap).animate({
          'left': -index * height + 'px'
        }, .8);
      }
    },
    slideAnim: function(index){
      var wrap = this.wrap,
          width = this.width;

      if(method._hadTransition){
        $(wrap).css({'left': -index * width + 'px'});
      } else {
        $(wrap).animate({
          'left': -index * width + 'px'
        }, .8);
      }
    },
    fadeAnim: function(items, index){
      if(method._hadTransition){
        $(items[this.index]).css({'opacity': 0, 'z-index': 1});
        $(items[index]).css({'opacity': 1, 'z-index': 2});
      } else {
        $(items[this.index]).animate({
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
    initSlideUpItems: function(){
      var elem = this.elem,
          wrap = this.wrap,
          items = this.items,
          length = items.length;
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
    initSlideItems: function(){
      var elem = this.elem,
          wrap = this.wrap,
          items = this.items,
          width = this.width,
          length = items.length;
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
    initFadeItems: function(){
      var wrap = this.wrap,
          items = this.items;
      wrap.css({
        'position': 'relative'
      });
      items.css({
        'position': 'absolute',
        'left': 0,
        'top': 0
      });
    },
    initNumber: function(length){
      var numberWrap = $('<div class="' + this.options.numberCls.slice(1) + '"></div>'),
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
      this.elem.append(numberWrap);
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
          this.slideStop();
        });
      },
      setAuto: function(){
        $(_elems).each(function(i){
          this.setAuto();
        });
      },
      setActive: function(index){
        method.setActive(index);
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
        method.slideStop();
      },
      setAuto: function(){
        method.setAuto();
      },
      setActive: function(index){
        method.setActive(index);
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
    auto: true
  };

}(jQuery));
