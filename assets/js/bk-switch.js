/*
 * bk-switch
 * https://github.com/lemonroot/bk-switch
 *
 * Copyright (c) 2013 lemonlwz
 * Licensed under the MIT license.
 */

(function($) {
  var method = {
    init: function(){
      this.elem = $(this.options.elem);
      this.content = this.elem.find('.switch-content');
      this.ul = this.content.find('ul')
      this.items = this.ul.find('li');
      this.leftBtn = this.elem.find('.J_left');
      this.rightBtn = this.elem.find('.J_right');
      this.template = this.options.template;

      this.items.each(function(k, v){
        $(v).attr({'data-index': k});
      });

      this.setWidth();
      this.bind();
    },
    setWidth: function(){
      var width = this.items.length * this.options.itemWidth;
      this.ul.width(width);
    },
    bind: function(){
      var _this = this;
      this.elem.on('click', '.J_left, .J_right', switchHandler);
      this.switchHandler = switchHandler;

      function switchHandler(evt){
        if($(evt.currentTarget).hasClass('J_left')){
          _this.switchLeftHandler(evt);
        } else {
          _this.switchRightHandler(evt);
        }
      };

      //hover item
      this.elem.on('mouseover mouseleave', 'li, .bk-switch-detail', hoverHandler);
      this.hoverHandler = hoverHandler;
      function hoverHandler(evt){

        var $target = $(evt.currentTarget);
        if($target.hasClass('bk-switch-detail')){
          clearTimeout(_this.timer);
          if(evt.type === 'mouseleave'){
            _this.timer = setTimeout(function(){
              $target.hide();
            }, 200);
          }
          return false;
        }

        var $item = $(evt.currentTarget);
        var $parent = _this.elem;
        var html, user, detail, index, left;
        index = $item.attr('data-index');
        html = $parent.find('.J_bkSwitchDetail' + index);

        if(evt.type !== 'mouseleave'){
          if(html.length){
            clearTimeout(_this.timer);
            $parent.find('.J_bkSwitchDetail').hide();
            html.show();
          } else {
            //html = $('<div class="' + _this.options.itemCls + ' J_bkSwitchDetail J_bkSwitchDetail' + index + '">');
            if(_this.template.length){
              var params = {};
              $.each(_this.options.params, function(key, attr){
                params[key] = $item.attr(attr);
              });
              $.ajax({
                url: _this.options.url,
                dataType: _this.options.dataType || 'jsonp',
                data: params,
                success: function(data){
                  html = $(_this.template).tmpl(data);
                  render();
                }
              });
            } else{
              user = $item.attr('data-user');
              detail = $item.attr('data-detail');
              html = $([
                '<div class="bk-switch-detail J_bkSwitchDetail' + index + '">',
                '  <i class="arrow"></i>',
                '  <label>' + user + ':</label>',
                '  <span>' + detail + '</span>',
                '</div>'
              ].join(''));
              render();
            }
            function render(){

              var w = html.width();
              var wl = $item.offset().left;
              var pw = $parent.width();
              var pwl = $parent.offset().left;
              var xl = 0;
              if(wl + w > pwl + pw){
                left = pw - w;
                xl = wl - pwl - left;
              } else {
                left =  wl - pwl;
              }
              html.css({
                left: left,
                zIndex: 10
              });
              html.find('.arrow').css({
                left: xl + 30
              });

              html.addClass('J_bkSwitchDetail J_bkSwitchDetail' + index);
              html.css('position', 'absolute');
              html.on('mouseover mouseleave', function(e){
                if(e.type === 'mouseover'){
                  clearTimeout(_this.timer);
                  $('.J_bkSwitchDetail').hide();
                  html.show();
                } else {
                  clearTimeout(_this.timer);
                  _this.timer = setTimeout(function(){
                    $('.J_bkSwitchDetail').hide();
                  }, 200);
                }
              });
              $parent.append(html);
            }
          }

          var w = html.width();
          var wl = $item.offset().left;
          var pw = $parent.width();
          var pwl = $parent.offset().left;
          var xl = 0;
          if(wl + w > pwl + pw){
            left = pw - w;
            xl = wl - pwl - left;
          } else {
            left =  wl - pwl;
          }
          html.css({
            left: left
          });
          html.find('.arrow').css({
            left: xl + 30
          });
        } else {
          if(html.length){
            clearTimeout(_this.timer);
            _this.timer = setTimeout(function(){
              $('.J_bkSwitchDetail').hide();
            }, 200);
          }
        }
      };

    },
    switchLeftHandler: function(evt){
      var ul = this.ul;
      var width = this.options.width;
      var left = ul.get(0).offsetLeft - width;
      var maxLeft = ul.width() - width;
      if(left < -maxLeft){
        left = -maxLeft;
      }
      ul.animate({
        left: left
      }, 600);
    },
    switchRightHandler: function(evt){
      var ul = this.ul;
      var width = this.options.width;
      var left = ul.get(0).offsetLeft + width;
      var maxLeft = 0;
      if(left > 0){
        left = maxLeft;
      }
      ul.animate({
        left: left
      }, 600);
    },
    unbind: function(){
      this.elem.unbind('click', this.switchHandler);
      this.items.unbind('mouseenter mouseleave', this.options.hoverHandler);
    }
  };

  // Collection method.
  //$.fn.bkSwitch = function() {
  //  return this.each(function(i) {
  //    // Do something bkSwitch to each selected element.
  //    $(this).html('bkSwitch' + i);
  //  });
  //};

  // Static method.
  $.bkSwitch = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.bkSwitch.options, options);
    // Return something bkSwitch.
    method.options = options;
    method.init();
    return {
      unbind: function(){
        method.unbind();
      }
    };
  };

  // Static method default options.
  $.bkSwitch.options = {
    itemCls: 'bk-switch-detail',
    template: []
  };

}(jQuery));
