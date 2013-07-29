(function($) {

  // Global settings
  listSettings = [];

  methods = {
    defaults: {
      postPropertyName: 'items[]',
      dataTag: 'data',
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
      var settings = $.extend(methods['defaults'], options || {});

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

      if (settings.onSelect)
        settings.onSelect.apply(this, [elm]);
    },
    unselect: function(elm) {
      var settings = listSettings[$(this).listSelector('listId')];

      if (settings.onBeforeUnselect && !settings.onBeforeUnselect.apply(this, [elm]))
        return;

      $('input[type=hidden].list-selector-hidden', elm).remove();

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
      var settings = listSettings[$(this).listSelector('listId')];

      return $('input[type=hidden].list-selector-hidden', this).closest('li');
    },
    selectedItems: function() {
      var items = [];

      $('input[type=hidden].list-selector-hidden', this).each(function(){
        items.push($(this).val());
      })

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
  }

}(jQuery));
