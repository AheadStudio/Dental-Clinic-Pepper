(function($, window, undefined){

     // !! ---- Lazy modal initialized ---- !!

     if (!$) {
         console.error("Please coonect jQuery lib");
         return;
     }

     // !! ---- Lazy modal initialized ---- !!

     if ( $.fn.lazyModal ) {
         if ( 'console' in window ) {
             console.error("FancyBox already initialized");
         }
         return;
     }

    /**
     * Default options for the lazyModal.
     */
    var defaults = {
        position             :  "center",
        background           :  "rgba(0, 0, 0, 0.7)",
        positionClose        :  "outside",
        color                :  "rgb(198, 88, 121)",
        backgroundStructure  :  "<div class='lazy-modal-background'></div>",
        modalStructure       :  "<div class='lazy-modal'><div class='lazy-modal-container'></div></div>",
        trTimeBackground     :  "0.3",
    };

    /**
     * Main settings for the lazyModal.
     */
    var settings = {

        /**
         * Final options for the lazyModal.
         */
        options: {},

        init: function(params) {
            // сам элемент
            var el = this;

            // актуальные настройки, будут индивидуальными при каждом запуске
            settings.options = $.extend({}, defaults, params);

            // инициализируем один раз
            var init = $(el).data('lazyModal');

            if (init) {
                return el;
            } else {
                settings.initialize(el);
            }

        },

        initialize: function(el) {
            var self = this;
            return el.on("click.lazyModal", function() {
                self.show($(el));
            });
        },

        show: function(el, hideElements) {
            var self = this,
                dataElement = $(el).data("lmElement"),
                modalWindow = $("[data-lm-block='" + dataElement + "']"),
                $lazyBlock;

            self.options.body = $("body");

            if (self.options.body.lenght === 0) {
                self.checkError("Body not found");
                return;
            }

            if (!self.options.body.hasClass("show-lazy-modal")) {
                self.options.body.addClass("show-lazy-modal");
                self.options.body.prepend(self.options.backgroundStructure);
                $lazyBlock = self.options.body.find(".lazy-modal-background");

                if ($lazyBlock.lenght !== 0) {

                    var cssValBackground = {
                        "background"           :  self.options.background,
                        "transition-duration"  :  self.options.trTimeBackground + "s",
                    }

                    $lazyBlock.css(cssValBackground);

                    setTimeout(function() {
                        $lazyBlock.addClass("lazy-modal-background--show");
                        $lazyBlock.after(self.options.modalStructure);
                        var $container = self.options.body.find("div.lazy-modal-container");
                        $container.html(modalWindow.get(0).outerHTML);
                        $container.append("<div class='close'>X</div>");
                        $(".close", $container).on("click", function() {
                            self.hide();
                        });

                        setTimeout(function() {
                            self.options.lazyBlock = $("div.lazy-modal");
                            self.hideBlock($(el));
                            self.options.lazyBlock.addClass("lazy-modal-container--show");
                        }, 300);

                    }, 50);

                }

            }
        },

        hideBlock: function(el) {
            var self = this;
            $(document).keyup(function(e) {
                if (e.keyCode == 27) {
                    self.hide();
                }
            });

            self.options.lazyBlock.mouseup(function (event) {
                if (self.options.lazyBlock.has(event.target).length === 0) {
                    self.hide();
                }
            });

        },

        update: function(el) {

        },

        destroy: function(el) {

        },

        hide: function() {
            var self = this,
                $body = $("body"),
                $lazyBackground = $body.find(".lazy-modal-background"),
                $lazyBlock = $("div.lazy-modal");

            $lazyBlock.removeClass("lazy-modal-container--show");
            $lazyBackground.removeClass("lazy-modal-background--show");

            setTimeout(function() {
                $lazyBlock.remove();
                $lazyBackground.remove();
                $body.removeClass("show-lazy-modal");
            }, 800);
        },

        checkError: function(errorText) {
            $.error(errorText);
            return;
        },


    };

    $.fn.lazyModal = function(method) {
        if (method === "bodyBackground" || method === "checkError" || method === "initialize") {
            return $.error('This method: "' +  method + '" propected.');
        }
        // немного магии
        if (settings[method]) {
            // если запрашиваемый метод существует, мы его вызываем
            // все параметры, кроме имени метода прийдут в метод
            // this так же перекочует в метод
            return settings[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method || "") {
            // если первым параметром идет объект, либо совсем пусто
            // выполняем метод init
            return settings.init.apply(this, arguments);
        } else {
            // если ничего не получилось
            $.error('Method:  "' +  method + '" not find, please read documentation.');
        }
    };

})(jQuery, window);

// вызывает метод init
$("span[data-lm-element]").lazyModal();
