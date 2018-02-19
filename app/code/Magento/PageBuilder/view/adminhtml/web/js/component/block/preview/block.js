/*eslint-disable */
define(["knockout", "underscore", "../../format/style-attribute-filter", "../../format/style-attribute-mapper"], function (_knockout, _underscore, _styleAttributeFilter, _styleAttributeMapper) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var PreviewBlock =
  /*#__PURE__*/
  function () {
    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function PreviewBlock(parent, config) {
      var _this = this;

      this.parent = void 0;
      this.config = void 0;
      this.data = {};
      this.previewStyle = void 0;
      var styleAttributeMapper = new _styleAttributeMapper();
      var styleAttributeFilter = new _styleAttributeFilter();
      this.parent = parent;
      this.config = config || {}; // Create an empty observable for all fields

      if (this.config.fields) {
        _underscore.keys(this.config.fields).forEach(function (key) {
          _this.updateDataValue(key, "");
        });
      } // Subscribe to this blocks data in the store


      this.parent.stage.store.subscribe(function (data) {
        _underscore.forEach(data, function (value, key) {
          _this.updateDataValue(key, value);
        });
      }, this.parent.id);
      this.previewStyle = _knockout.computed(function () {
        // Extract data values our of observable functions
        var styles = styleAttributeMapper.toDom(styleAttributeFilter.filter(_underscore.mapObject(_this.data, function (value) {
          if (_knockout.isObservable(value)) {
            return value();
          }

          return value;
        })));
        return _this.afterStyleMapped(styles);
      });
      Object.keys(styleAttributeFilter.getAllowedAttributes()).forEach(function (key) {
        if (_knockout.isObservable(_this.data[key])) {
          _this.data[key].subscribe(function () {
            _this.previewStyle.notifySubscribers();
          });
        }
      });
    }
    /**
     * Retrieve the template for the preview block
     *
     * @returns {string}
     */


    var _proto = PreviewBlock.prototype;

    /**
     * Update the data value of a part of our internal Knockout data store
     *
     * @param {string} key
     * @param value
     */
    _proto.updateDataValue = function updateDataValue(key, value) {
      if (typeof this.data[key] !== "undefined" && _knockout.isObservable(this.data[key])) {
        this.data[key](value);
      } else {
        if (_underscore.isArray(value)) {
          this.data[key] = _knockout.observableArray(value);
        } else {
          this.data[key] = _knockout.observable(value);
        }
      }
    };
    /**
     * Callback function to update the styles are mapped
     *
     * @param {string} styles
     * @return styles
     */


    _proto.afterStyleMapped = function afterStyleMapped(styles) {
      return styles;
    };

    _createClass(PreviewBlock, [{
      key: "template",
      get: function get() {
        if (this.config.preview_template) {
          return this.config.preview_template;
        }

        return "";
      }
    }]);

    return PreviewBlock;
  }();

  return PreviewBlock;
});
//# sourceMappingURL=block.js.map