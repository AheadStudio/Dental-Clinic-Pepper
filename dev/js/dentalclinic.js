(function($) {
	var DENTALCLINIC = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {
			menu: function() {
				var self = this;

				$(".header-menu-item-holder--has-submenu").on("mouseenter", function() {
					var $holder = $(this);
					$(".header-menu-level1", $holder).css("display", "block");
					setTimeout(function() {
						$(".header-menu-level1", $holder).addClass("show");
					}, 50);
				});
				$(".header-menu-item-holder--has-submenu").on("mouseleave", function() {
					var $holder = $(this);
					$(".header-menu-level1", $holder).removeClass("show");
					setTimeout(function() {
						$(".header-menu-level1", $holder).css("display", "none");
					}, 350);
				});
			},

			slickSlider: {
				init: function() {
					var self = this;

					self.mainSlider();
				},

				mainSlider: function() {
					var slider = $(".slick-slider");

					slider.slick({
						arrows: true,
						appendArrows: $(".slick-arrow-container"),
						prevArrow: '<div class="slick-arrow-prev"></div>',
						nextArrow: '<div class="slick-arrow-next"></div>',
						infinite: true,
						speed: 600,
						slidesToShow: 1,
						//autoplay: true,
						autoplaySpeed: 6000
					});

					slider.on("swipe", function(event, slick, direction) {
						var arrows = $(".slick-arrow-container", ".main-slider");

						arrows.addClass("hide");
						setTimeout(function() {
							arrows.removeClass("hide");
						}, 600);

					});
				}
			},
		};

	})();

	DENTALCLINIC.menu();
	DENTALCLINIC.slickSlider.init();
})(jQuery);
