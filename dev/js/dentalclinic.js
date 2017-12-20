(function($) {
	var DENTALCLINIC = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {

			scrollAnimation: {

				blocks: [],
				init: function() {
					var self = this;

					$("[data-animationblock]:not(.animated)").each(function() {
						var $item = $(this),
							itemAnimation = $item.data("animationtype"),
							itemAnimationDuration = $item.data("animationduration");

						if (!itemAnimationDuration) {
							itemAnimationDuration = 0;
						}
						self.blocks.push({
							"html": $item,
							"top": $item.offset().top,
							"typeAnimation": itemAnimation,
							"animation-duration" : itemAnimationDuration
						});
						$item.addClass("before-" + itemAnimation);
						$item.css("animation-duration", itemAnimationDuration);
					});

					$sel.window.on("scroll", function() {
						self.check();
					});
					setTimeout(function() {
						self.check();
					}, 50);

				},
				check: function() {
					var self = this,
						block = false,
						blockTop = false,
						top = $sel.window.scrollTop(),
						buffer = parseInt($sel.window.height()) / 1.1;
					for(var i = 0, len = self.blocks.length; i < len; i++) {
						block = self.blocks[i],
						blockTop = parseInt(block.top, 10);
						if(block.html.hasClass("animated")) {
							continue;
						}
						if(top + buffer >= blockTop) {
							block.html.addClass("animated");
						}

					}
				}
			},

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

			mobileMenu:{
				button: $(".header-burger-holder"),
				menu: $(".mobile-menu"),
				close: $(".mobile-menu-close"),


				init: function() {
					var self = this;

					self.button.on("click", function() {
						var btn = $(this);

						btn.addClass("active");
						self.show(self.menu);
					});
					self.close.on("click", function() {
						self.button.removeClass("active");
						self.hide(self.menu);
					})
				},
				show: function(menu) {
					menu.addClass("active-block");
					setTimeout(function() {
						menu.addClass("active-show");
					}, 200);
				},
				hide: function(menu) {
					menu.removeClass("active-show");

					setTimeout(function() {
						menu.removeClass("active-block");
					}, 600);
				}
			},

			slickSliders: {
				init: function() {
					var self = this,
						$slider = $(".slick-slider");

					self.mainSlider($slider);
					self.servicesSlider($slider);
					self.advSlider($slider);
				},

				mainSlider: function(slider) {
					var self = this,
						$mainSlider = $(".main-slider"),
					 	$slider = $mainSlider.find(slider),
						$itemSlider = $(".main-slider-item", $slider),
						$arrowContainer = $(".slick-arrow-container", $mainSlider);

					self.sliderEffect($slider, $mainSlider, $itemSlider, $arrowContainer, true);
				},

				servicesSlider: function(slider) {
					var self = this,
						$servicesSlider = $(".services-slider"),
					 	$slider = $servicesSlider.find(slider),
						$itemSlider = $(".services-slider-item", $slider),
						$arrowContainer = $(".slick-arrow-container", $servicesSlider);

					self.servicesCalculation();
					self.sliderEffect($slider, $servicesSlider, $itemSlider, $arrowContainer, false);

					$slider.on("swipe", function(event, slick, direction){
						if (direction == "left") {
							self.servicesCalculation("prevElement")
						} else {
							self.servicesCalculation("nextElement")
						}
					});

					$(".slick-arrow-prev", $arrowContainer).on("click", $arrowContainer, function() {
						self.servicesCalculation("nextElement");
					})
					$(".slick-arrow-next", $arrowContainer).on("click", $arrowContainer, function() {
						self.servicesCalculation("prevElement");
					})


				},

				advSlider: function(slider) {
					var self = this,
						$advSlider = $(".advantages-slider"),
						$slider = $advSlider.find(slider),
						$itemSlider = $(".main-slider-item", $slider),
						$arrowContainer = $(".slick-arrow-container", $advSlider);

					self.sliderEffect($slider, $advSlider, $itemSlider, $arrowContainer, false);



					$slider.on("swipe", function(event, slick, direction) {
						var $element = $(event.currentTarget).find(".advantages-slider-item.slick-active"),
							idElement = $element.attr("id"),
							$photo = $(".advantages-photo", ".advantages-photo-container");

						self.advSliderEffect($photo, idElement);
					});

					$(".slick-arrow", $arrowContainer).on("click", $arrowContainer, function() {
						var el = $(this),
							$container  = el.closest(".advantages-slider"),
							$sliderItem = $container.find(".advantages-slider-item.slick-active");
							idItem =  $sliderItem.attr("id"),
							$photo = $(".advantages-photo", ".advantages-photo-container");

						self.advSliderEffect($photo, idItem);
					});

				},

				advSliderEffect: function(el, idElement) {
					var self = this;

					el.each(function (index, element) {
						var $item = $(this);

						$item.removeClass("active-animation");

						setTimeout(function() {
							$item.removeClass("active");
							$("[data-adv="+idElement+"]").addClass("active");
						}, 200);
						setTimeout(function() {
							$("[data-adv="+idElement+"]").addClass("active-animation");
						}, 400);

					});

				},

				sliderEffect: function(slider, container, itemSlider, arrowContainer, hidePoint) {

					slider.slick({
						arrows: true,
						appendArrows: arrowContainer,
						prevArrow: '<div class="slick-arrow-prev"></div>',
						nextArrow: '<div class="slick-arrow-next"></div>',
						infinite: true,
						speed: 600,
						slidesToShow: 1,
						//autoplay: true,
						autoplaySpeed: 6000
					});

					if (hidePoint == true) {
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

			map: {
				init: function() {

			    	$("#map", $sel.body).each(function() {
			            var $map = $(this),
			            	lng = parseFloat($map.data("lng"), 10) || 0,
			            	lat = parseFloat($map.data("lat"), 10) || 0,
			            	zoom = parseInt($map.data("zoom"));
			            var options = {
							center: new google.maps.LatLng(lat, lng),
							zoom: zoom,
							mapTypeControl: false,
							panControl: false,
							zoomControl: true,
							zoomControlOptions: {
								style: google.maps.ZoomControlStyle.LARGE,
								position: google.maps.ControlPosition.TOP_RIGHT
							},
							scaleControl: true,
							streetViewControl: true,
							streetViewControlOptions: {
								position: google.maps.ControlPosition.TOP_RIGHT
							},
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							styles: [
								{"featureType": "landscape", "stylers": [
				                    {"saturation": -100},
				                    {"lightness": 0},
				                    {"visibility": "on"}
				                ]},
				                {"featureType": "poi", "stylers": [
				                    {"saturation": -300},
				                    {"lightness": -10},
				                    {"visibility": "simplified"}
				                ]},
				                {"featureType": "road.highway", "stylers": [
				                    {"saturation": -100},
				                    {"visibility": "simplified"}
				                ]},
				                {"featureType": "road.arterial", "stylers": [
				                    {"saturation": -100},
				                    {"lightness": 0},
				                    {"visibility": "on"}
				                ]},
				                {"featureType": "road.local", "stylers": [
				                    {"saturation": -100},
				                    {"lightness": 0},
				                    {"visibility": "on"}
				                ]},
				                {"featureType": "transit", "stylers": [
				                    {"saturation": -100},
				                    {"visibility": "simplified"}
				                ]},
				                {"featureType": "administrative.province", "stylers": [
				                    {"visibility": "off"}
				                ]},
				                {"featureType": "water", "elementType": "labels", "stylers": [
				                    {"visibility": "on"},
				                    {"lightness": -25},
				                    {"saturation": -100}
				                ]},
				                {"featureType": "water", "elementType": "geometry", "stylers": [
				                    {"hue": "#ffff00"},
				                    {"lightness": -25},
				                    {"saturation": -97}
				                ]}
				            ]
				        };

			            var api = new google.maps.Map($map[0], options);
			            var point = new google.maps.Marker({
			            	position: new google.maps.LatLng(lat, lng),
			            	map: api,
			                icon: $map.data("icon")
			            });

			        });
			    }
			}
		};

	})();

	DENTALCLINIC.menu();
	DENTALCLINIC.mobileMenu.init();
	DENTALCLINIC.scrollAnimation.init();
	DENTALCLINIC.map.init();
	DENTALCLINIC.slickSliders.init();
})(jQuery);
