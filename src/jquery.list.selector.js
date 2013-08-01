/**
  * jquery.list.selector.js
  * @author: CWI Software
  * @version: 1.0.0
  *
  * Created by Cwi Software on 2013-07-30. Please report any bug at https://github.com/CWI/jquery-list-selector
  *
  * Copyright (c) 2013 Cwi Software http://www.cwi.com.br
  *
  * The MIT License (http://www.opensource.org/licenses/mit-license.php)
  *
  * Permission is hereby granted, free of charge, to any person
  * obtaining a copy of this software and associated documentation
  * files (the "Software"), to deal in the Software without
  * restriction, including without limitation the rights to use,
  * copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the
  * Software is furnished to do so, subject to the following
  * conditions:
  *
  * The above copyright notice and this permission notice shall be
  * included in all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  */
(function($) {
  "use strict"
  // Global settings
  listSettings = [];

  methods = {
    defaults: {
      postPropertyName: 'items[]',
      dataTag: 'data',
      onToggle: function (elm) {
      },
      onSelect: function (elm) {
        $(elm).addClass('selected');
      },
      onUnselect: function (elm) {
        $(elm).removeClass('selected');
      },
      onBeforeSelect: function (elm) {
        // You can return false here to avoid selection
        return true;
      },
      onBeforeUnselect: function (elm) {
        // You can return false here to avoid unselection
        return true;
      }
    },
    init: function(options) {
      var settings = $.extend(methods.defaults, options || {});

      listSettings[$(this).listSelector('listId')] = settings;

      $(this).listSelector('appendEvents');
    },
    listId: function() {
      var id = $(this).attr('id');

      if (!id)
        $.error("Selected element should have id defined.");

      return id;
    },
    toggle: function(elm) {
      method = $(this).listSelector('isSelected', elm) ? 'unselect' : 'select';

      $(this).listSelector(method, elm);
    },
    isSelected: function(elm) {
      // Is selected if exists an input hidden added by the plugin
      return $('input[type=hidden].list-selector-hidden', elm).length > 0;
    },
    select: function(elm) {
      var settings = listSettings[$(this).listSelector('listId')];
      var data = $(elm).attr(settings.dataTag);

      if (settings.onBeforeSelect && !settings.onBeforeSelect.apply(this, [elm]))
        return;

      $(elm).append('<input type="hidden" name="' + settings.postPropertyName + '" class="list-selector-hidden" value="' + data + '" />');

      if (settings.onToggle)
        settings.onToggle.apply(this, [elm, true]);

      if (settings.onSelect)
        settings.onSelect.apply(this, [elm]);
    },
    unselect: function(elm) {
      var settings = listSettings[$(this).listSelector('listId')];

      if (settings.onBeforeUnselect && !settings.onBeforeUnselect.apply(this, [elm]))
        return;

      $('input[type=hidden].list-selector-hidden', elm).remove();

      if (settings.onToggle)
        settings.onToggle.apply(this, [elm, false]);

      if (settings.onUnselect)
        settings.onUnselect.apply(this, [elm]);
    },
    appendEvents: function() {
      $listElm = $(this);

      var liElements = $('li', $listElm);

      liElements.click(function(){
        $listElm.listSelector('toggle', this);
      });
    },
    selectedElements: function() {
      return $('input[type=hidden].list-selector-hidden', this).closest('li');
    },
    unselectedElements: function() {
      return $('li', this).not($(this).listSelector('selectedElements'));
    },
    elements: function() {
      return $('li', this);
    },
    selectedItems: function() {
      var items = [];

      $('input[type=hidden].list-selector-hidden', this).each(function(){
        items.push($(this).val());
      });

      return items;
    }
  };

  $.fn.listSelector = function(method) {
    var params = Array.prototype.slice.call(arguments, 1);
    if (methods[method]) {
      return methods[method].apply(this, params);
    } else {
      $.error('Undefined list selector method: ' + method);
    }
  };

})(jQuery);
