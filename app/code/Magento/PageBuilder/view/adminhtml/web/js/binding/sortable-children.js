/*eslint-disable */
define(["jquery", "knockout", "uiEvents", "Magento_PageBuilder/js/drag-drop/move-content-type", "Magento_PageBuilder/js/utils/array"], function (_jquery, _knockout, _uiEvents, _moveContentType, _array) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);
  _uiEvents = _interopRequireDefault(_uiEvents);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var draggedContentType; // Create a new sortable Knockout binding

  _knockout.default.bindingHandlers.sortableChildren = {
    /**
     * Init the draggable binding on an element
     *
     * @param element
     * @param valueAccessor
     * @param allBindingsAccessor
     * @param data
     * @param context
     */
    init: function init(element, valueAccessor, allBindingsAccessor, data, context) {
      var instance = context.$data.parent;

      var options = _knockout.default.unwrap(valueAccessor());

      var originalPosition;
      (0, _jquery.default)(element).sortable(options).on("sortstart", function (event, ui) {
        originalPosition = ui.item.index();
        draggedContentType = instance.children()[originalPosition];

        _uiEvents.default.trigger("sortableChildren:sortstart", {
          instance: instance,
          originalPosition: originalPosition,
          ui: ui
        });
      }).on("sortupdate", function (event, ui) {
        if (this === ui.item.parent()[0]) {
          var index = ui.item.index();

          var targetParent = _knockout.default.dataFor(ui.item.parent()[0]).parent;

          if (targetParent && (originalPosition !== index || draggedContentType.parent !== targetParent)) {
            ui.item.remove();

            if (draggedContentType.parent === targetParent) {
              (0, _array.moveArrayItem)(instance.children, originalPosition, index);
            } else {
              (0, _moveContentType.moveContentType)(draggedContentType, index, targetParent);
            }

            _uiEvents.default.trigger("sortableChildren:sortupdate", {
              instance: instance,
              newPosition: index,
              originalPosition: originalPosition,
              ui: ui
            });
          }
        }
      });
    }
  };
});
//# sourceMappingURL=sortable-children.js.map