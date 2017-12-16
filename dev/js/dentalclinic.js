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

			slickSliders: {
				init: function() {
					var self = this,
						$slider = $(".slick-slider");

					self.mainSlider($slider);
					self.servicesSlider($slider);
				},

				mainSlider: function(slider) {
					var self = this,
						$mainSlider = $(".main-slider"),
					 	$slider = $mainSlider.find(slider),
						$itemSlider = $(".main-slider-item", $slider);

					$slider.slick({
						arrows: true,
						appendArrows: $(".slick-arrow-container", $mainSlider),
						prevArrow: '<div class="slick-arrow-prev"></div>',
						nextArrow: '<div class="slick-arrow-next"></div>',
						infinite: true,
						speed: 600,
						slidesToShow: 1,
						//autoplay: true,
						autoplaySpeed: 6000
					});
					self.sliderEfect($slider, $mainSlider, $itemSlider);
				},

				servicesSlider: function(slider) {
					var self = this,
						$servicesSlider = $(".services-slider"),
					 	$slider = $servicesSlider.find(slider),
						$itemSlider = $(".services-slider-item", $slider);

					$slider.slick({
						arrows: true,
						appendArrows: $(".slick-arrow-container", $servicesSlider),
						prevArrow: '<div class="slick-arrow-prev"></div>',
						nextArrow: '<div class="slick-arrow-next"></div>',
						infinite: true,
						speed: 600,
						slidesToShow: 1,
						//autoplay: true,
						autoplaySpeed: 6000
					});

					$slider.on("swipe", function(event, slick, direction){
						if (direction == "left") {
							self.servicesCalculation("nextElement")
						} else {
							self.servicesCalculation("prevElement")
						}
					});

					self.sliderEfect(false, $servicesSlider, $itemSlider);

					self.servicesCalculation();
				},

				sliderEfect: function(slider, container, itemSlider) {
					if (slider != false) {
						slider.on("swipe", function(event, slick, direction) {
							var $arrows = $(".slick-arrow-container", container);

							$arrows.addClass("hide");
							setTimeout(function() {
								$arrows.removeClass("hide");
							}, 600);

						});
					}

					itemSlider.on("mousedown", function() {
						item = $(this);
						item.css("cursor", "-webkit-grab");
					})

					itemSlider.on("mouseup", function() {
						item = $(this);
						item.css("cursor", "pointer");
					})

				},

				servicesCalculation: function(number) {
					var self = this,
						$containerCircle = $(".services-container"),
						degContainer = $containerCircle.attr("data-deg");
						$items = $(".services-item", $containerCircle),
						itemsQuantity = $items.length,
						radius = 360 / itemsQuantity;
						wContainerCircle = $containerCircle.outerWidth(),
						hContainerCircle = $containerCircle.outerHeight();

					if (number == "nextElement") {
						var number = Number(degContainer) - radius;
					} else {
						var number = Number(degContainer) + radius;
					}
					$containerCircle.attr("data-deg", number);
					$items.each(function(index, element) {
						el = $(this);
						xCoor = (wContainerCircle / 2 * Math.cos( (number * Math.PI) / 180 )) + ((wContainerCircle / 2) - 50);
						yCoor = (wContainerCircle / 2 * Math.sin( (number * Math.PI) / 180 )) + ((wContainerCircle / 2) - 50);

						el.css({
							"left" : Math.round(xCoor),
							"top"  : Math.round(yCoor),
						});

						el.removeClass("active");
						if (Math.round(xCoor) == -50 && Math.round(yCoor) == 300) {
							el.addClass("active");
						}
						number = number + radius;
					});

				},

			},
		};

	})();

	DENTALCLINIC.menu();
	DENTALCLINIC.slickSliders.init();
})(jQuery);
