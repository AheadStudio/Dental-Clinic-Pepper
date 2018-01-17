(function($, window, undefined){
    "use strict";
    // === Check Jquery === //

    if (!$) {
        console.error("Please coonect jQuery lib");
        return;
    }

    // === Lazy modal initialized === //
    if ( $.fn.lazyModal ) {
        $.error("LazyModal already initialized");
        return;
    }

    var $html = $("html");
    var $body = $("body");

    // === Lazy modal initialized === //
    var defaults = {

        // Position modal window
        position:  "",

        // Content for show
        content:  "",

        // Color background
        bcgcolor:  "rgba(0, 0, 0, 0.7)",

        // Postion button close
        positionclose:  "outside",

        // Close modal when clicked outside
        closeoutside: true,

        // Transition effect
        // fade, top, bottom, left, right, zoom
        effectshow: "top",

        // Type modal
        type: "html",

        // Custom class
        customclass: "",

        // template modal window
        basetpl:
        '<div class="lazy-modal">' +
            '<div class="lazy-modal-background"></div>' +
            '<div class="lazy-modal-scroll">' +
                '<div class="lazy-modal-container">' +
                '</div>' +
            '</div>' +
        '</div>',

        // Button close template
        btnclosetml: '<button data-lazymodal-close class="lazy-modal-close">'+
                        '<?xml version="1.0" encoding="iso-8859-1"?>'+
                         '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="612px" height="612px" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">' +
                            '<g><g id="_x31_0_41_"><g><path d="M415.338,196.662c-7.535-7.535-19.737-7.535-27.253,0l-82.181,82.18l-81.033-81.032c-7.478-7.478-19.584-7.478-27.042,0'+
            				'c-7.478,7.478-7.478,19.584,0,27.042l81.033,81.033l-81.587,81.587c-7.535,7.535-7.535,19.736,0,27.253s19.737,7.517,27.253,0'+
            				'l81.588-81.587l81.032,81.032c7.478,7.478,19.584,7.478,27.043,0c7.478-7.478,7.478-19.584,0-27.043l-81.033-81.032l82.181-82.18'+
            				'C422.873,216.399,422.873,204.179,415.338,196.662z M306,0C136.992,0,0,136.992,0,306s136.992,306,306,306'+
            				'c168.988,0,306-137.012,306-306S475.008,0,306,0z M306,573.75C158.125,573.75,38.25,453.875,38.25,306'+
            				'C38.25,158.125,158.125,38.25,306,38.25c147.875,0,267.75,119.875,267.75,267.75C573.75,453.875,453.875,573.75,306,573.75z"/></g></g></g></svg>'+
                     '</button>',

        // Create structure
        // using params
        init: $.noop,

        // Before injected in DOM
        beforeImplant: $.noop,

        // Injected in DOM
        // addition modal structure in DOM model
        afterImplant: $.noop,

        // Before show modal window
        // call before show
        beforeShow: $.noop,

        // Show modal window
        // call together modal window
        show: $.noop,

        // Before close modal window
        // call before close window
        beforeClose: $.noop,

        // Close modal window
        // destroy structure in DOM model
        close: $.noop,

    };

    // === Class LazyModal ===//
    var LazyModal = function(el, settings, content) {
        var self = this;

        self.options = $.extend({}, $.lazymodal.defaults, settings);
        self.options.content = content;

        self.el = el;

        self.create();
    };

    // === Expanding class new properties === //
    $.extend(LazyModal.prototype, {

        // == Create structure == //
        create: function() {
            var self = this,
                initialization,
                htmlContent;

            initialization = self.el.data("lazyModalInit");

            if (initialization === "on") {
                $.error("Plugin already initialized");
            } else {
                self.el.data("lazyModalInit", "on");
            }

            if (self.options.type === "html") {
                htmlContent = $(self.options.content).get(0).outerHTML;
                self.options.htmlContent = $(htmlContent);

                self.hooks("init");
                self.implant();

            }
            if (self.options.type === "ajax") {
                (function(href) {
                    $.ajax({
                        url: href,
                        success: function(data) {
                            var $data = $(data);
                            self.options.htmlContent = $data;

                            self.hooks("init");
                            self.implant();
                        }
                    })
                })(self.options.content);

            }

        },

        // == Load structure  in DOM model== //
        implant: function() {
            var self = this,
                widStyles = {
                    "margin-right": "17px",
                    "overflow": "hidden",
                };

            self.hooks("beforeLoad");

            if ($body) {

                $body.css("overflow", "hidden");
                $html.css(widStyles);

                $body.prepend(self.options.basetpl);
                self.options.htmlStructure = {};

                setTimeout(function() {

                    self.options.htmlStructure.mainContainer = $(".lazy-modal", $body);
                    self.options.htmlStructure.contentContainer = $(".lazy-modal-container", self.options.htmlStructure.mainContainer);
                    self.options.htmlStructure.background = $(".lazy-modal-background", self.options.htmlStructure.mainContainer);

                    self.options.htmlStructure.mainContainer.addClass(self.options.customclass);
                    self.options.htmlStructure.background.css("background", self.options.bcgcolor);

                    if (self.options.positionclose === "outside") {
                        self.options.htmlStructure.mainContainer.append(self.options.btnclosetml);
                    } else if (self.options.positionclose === "inside") {
                        self.options.htmlStructure.contentContainer.append(self.options.btnclosetml);
                    }

                    self.includeContent(self.options.htmlStructure.contentContainer, self.options.position);

                }, 100)

            } else {
                $.error("No find 'body' in DOM model");
            }

        },


        // == include content in container == //
        includeContent: function(container, position) {
            var self = this;

            if (position) {
                container.addClass("lazy-modal-container--" + position);
            }
            container.append(self.options.htmlContent);

            self.hooks("afterImplant");

            self.showModal();

        },


        // == show modal window ==//
        showModal: function() {
            var self = this,
                content = self.options.htmlStructure.contentContainer;

            self.hooks("beforeShow");


            setTimeout(function() {
                content.addClass("lazy-modal-container--show");
                self.hooks("afterShow");
                self.addEvent();
            }, 400);
        },


        // == addition event close ==//
        addEvent: function() {
            var self = this;

            self.hooks("beforeClose");

            $("[data-lazymodal-close]").off("click.lm-close").on("click.lm-close", function(e) {
                e.stopPropagation();
                e.preventDefault();

                self.closeModal();
            });

            /*$(self.options.htmlStructure.background).off("click.lm-close").on("click.lm-close", function(e) {
                e.stopPropagation();
                e.preventDefault();

                self.closeModal();
            });*/

        },

        // == close modal == //
        closeModal: function() {
            var self = this,
                $container = self.options.htmlStructure.mainContainer,
                $content = self.options.htmlStructure.contentContainer,
                widStyles = {
                    "margin-right": "",
                    "overflow": "",
                };;

            $content.removeClass("lazy-modal-container--show");

            setTimeout(function() {

                $container.remove();
                self.el.data("lazyModalInit", "off");
                $html.css(widStyles);
                $body.css("overflow", "auto");
                self.hooks("afterClose");

            }, 600);

        },


        // == hooks function for user == //
        hooks : function(name) {
            var self = this,
                obj = self,
                args  = Array.prototype.slice.call(arguments, 1);

            args.unshift(obj);

            if ($.isFunction(self.options[name])) {
                self.options[name].apply(obj, args);
            }

        },


    });


    // === Lazy modal methods === //
    $.lazymodal = {

        defaults: defaults,

        open: function(el, settings, content) {
            return new LazyModal(el, settings, content);
        },

        hide: function(el, settings, content) {
            return new LazyModal(el, settings, content);
        },

        close: function(el, settings, content) {
            return new LazyModal(el, settings, content);
        },

        destroy: function(el, settings, content) {
            return new LazyModal(el, settings, content);
        },

    }


    // === Start plugin === //
    // set handler for click
    function startPlugin(event) {
        var el = $(this),
            settings = event.data ? event.data.options : {},
            data = el.data(),
            sizeDataObj = 0,
            content = settings.content ? settings.content : data.lazymodal;

        if (event.isDefaultPrevented()) {
            return;
        }
        event.preventDefault();

        sizeDataObj = Object.keys(data).length;

        if (sizeDataObj >= 2) {
            settings = $.extend({}, data, settings);
        }

        if (content === "" || !content) {
            content = $(this);
        }

        $.lazymodal.open(el, settings, content);
    }


    // === Create lazy modal plugin === //
    $.fn.lazyModal = function(options) {
        options  = options || {};
        var $el = false;

        this.each(function() {
            (function($el) {
                $el.off("click.lm-on").on("click.lm-on", {
                    item: $el,
                    options: options,
                }, startPlugin);

            })($(this));

        });
    };

})(jQuery, window);
