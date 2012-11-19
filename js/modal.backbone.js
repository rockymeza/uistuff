/*global _: true, Backbone: true */

/**
 * A Lightbox using jQuery and Backbone.js.
 *
 * dependencies:
 * jQuery
 * Underscore.js and Backbone.js
 */

;(function($, exports, undefined) {
  /**
   * Our base Backbone classes.
   */
  var View = Backbone.View.extend({
    /**
     * Please remember to call super:
     *
     * Backbone.View.prototype.initialize.apply(this, arguments);
     */
    initialize: function() {
      _.bindAll(this,
        'close',
        'onClose'
      );
    },

    /**
     * Adds a method for killing zombies.
     *
     * Based on Derick Bailey's blog post:
     * http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
     */
    close: function(event) {
      if ( event && event.preventDefault ) {
        event.preventDefault();
      }

      this.remove();
      this.undelegateEvents();
      this.onClose();
      this.trigger('close', this);
    },

    onClose: function() {}
  });

  var current_modal;

  var Modal = View.extend({
    tagName: 'div',
    className: 'overlay',

    events: {
      'click' : 'closeIfOverlay',
      'click .modal-close': 'close'
    },

    initialize: function(options) {
      View.prototype.initialize.apply(this, arguments);

      // Meta data container
      this.$infoContainer = $('<div>')
        .addClass('lightbox-info-container')
        .appendTo(this.el);

      // Meta data elements
      this.$info = $('<div>')
        .addClass('lightbox-info')
        .appendTo(document.body);
      this.$title = $('<h1>')
        .addClass('lightbox-title')
        .appendTo(this.$infoContainer);
      this.$description = $('<div>')
        .addClass('lightbox-description')
        .appendTo(this.$infoContainer);

      this.extraEvents();

      options = options || {};

      var left  = $(window).width() / 2 - this.options.width / 2,
          right = $(window).width() / 2 + this.options.width / 2,
          top   = $(window).height() / 2 - this.options.height / 2;

      this.$content = $('<div class="content">');
      this.$el.append(this.$content);

      // Set image and dimensions
      // this.$img = $('<img>')
      //   .attr('src', options.src)
      //   .css({
      //     width: options.width+'px',
      //     height: options.height+'px'
      //   })
      //   .hide()
      //   .appendTo(this.el);

      this.$content.css({
        left: left+'px',
        top: top+'px',
        width: this.options.width+'px',
        height: this.options.height+'px'
      });
      // Close button
      this.$close = $('<button type="button" class="modal-close">x</button>');

      this.$content.append(this.$close);

      this.$info.css({
        left: (right + 14)+'px',
        top: (top + 20)+'px'
      });

      // Set overlay info text
      this.$title.text(options.title ? '' : options.title);
      this.$description.html(options.description ? '' : options.description);

      // Recheck periodically if overlay image is finished loading.  Hide
      // loading animation if so.
      // var self = this;
      // var loadCheckerId = setInterval(function() {
      //   if ( self.$img[0].complete ) {
      //     clearInterval(loadCheckerId);
      //   }
      // }, 100);
      this.$content.append(this.options.body);
    },

    closeIfOverlay: function(event) {
      if ( event.target === this.el ) {
        this.close();
      }
    },

    extraEvents: function() {
      var self = this;

      // Events for toggling meta data
      this.$info.click(function() { self.toggleInfo(); });

      // Keypress event for hiding lightbox
      $(document).keydown(function(event) {
        if ( event.which === 27 ) {
          self.close();
          return false;
        }
      });
    },

    show: function() {
      if ( current_modal !== this ) {
        this.$el.appendTo(document.body);

        if ( current_modal ) {
          current_modal.close();
        }

        current_modal = this;
      }

      return this;
    },

    onClose: function() {
      current_modal = null;
    },

    /**
     * Remove lightbox resources.
     */
    // cleanup: function() {
    //   // Remove img if found
    //   if ( this.$img !== undefined ) {
    //     this.$img.remove();
    //     this.$img = undefined;
    //   }
    // },

    /**
     * Toggle display of meta data.
     */
    toggleInfo: function() {
      this.$infoContainer.fadeToggle();
    }
  });


  var html = function(body) {
    var modal = new Modal({
      body: body
    });

    return modal;
  };

  exports.modal = {
    html: html
  };

})(jQuery, window);
