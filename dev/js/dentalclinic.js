(function($) {
	var DENTALCLINIC = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {

			common: {
				go: function(topPos, speed, callback) {
					var curTopPos = $sel.window.scrollTop(),
						diffTopPos = Math.abs(topPos - curTopPos);
					$sel.body.add($sel.html).animate({
						"scrollTop": topPos
					}, speed, function() {
						if(callback) {
							callback();
						}
					});
				}
			},

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

					self.fixedBlock();
				},

				check: function() {
					var self = this,
						block = false,
						blockTop = false,
						top = $sel.window.scrollTop(),
						buffer = parseInt($sel.window.height()) / 1.8;
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
				},

				fixedBlock: function() {
					$sel.window.on("scroll", function() {
						var $elements = $(".sticky"),
							sticky = $elements.outerHeight(),
							sTop = $sel.window.scrollTop();

						if(sTop > sticky) {
							$sel.body.addClass("sticky-elements");
							$elements.addClass("sticky-activate");

							setTimeout(function() {
								$sel.body.addClass("sticky-elements--show");
							},300);
						} else {
							$sel.body.removeClass("sticky-elements");
							$sel.body.removeClass("sticky-elements--show");
							$elements.removeClass("sticky-activate");
						}

					});

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
				posLeft: "",


				init: function() {
					var self = this;

					self.button.on("click", function() {
						var btn = $(this);

						self.posLeft = btn.offset().left;

						if (!btn.hasClass("active")) {
							btn.addClass("active");

							if ($sel.window.width() <= "620") {
								//$sel.body.addClass("open-lazy-modal");
							}

							self.show(self.menu, btn);
						} else {
							btn.removeClass("active");

							if ($sel.window.width() <= "620") {
								//$sel.body.removeClass("open-lazy-modal");
							}

							self.hide(self.menu, btn);
						}
					});
				},
				show: function(menu, btn) {
					var self = this;

					menu.addClass("active-block");

					setTimeout(function() {

						menu.addClass("active-show");

						setTimeout(function() {
							btn.css({
								"position": "fixed",
								"left": self.posLeft,
							});

							$sel.body.addClass("open-menu");

						}, 220);

					}, 200);
				},
				hide: function(menu, btn) {
					var self = this;

					menu.removeClass("active-show");
					btn.css({
						"position": "relative",
						"left": "inherit",
					});

					setTimeout(function() {
						$sel.body.removeClass("open-menu");

					}, 300);

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
					self.miniNews($slider);
					self.newsSlider($(".content-slider"));
				},

				mainSlider: function(slider) {
					var self = this,
						$mainSlider = $(".main-slider"),
					 	$slider = $mainSlider.find(slider),
						$itemSlider = $(".main-slider-item", $slider),
						$arrowContainer = $(".slick-arrow-container", $mainSlider);

					self.sliderEffect($slider, $mainSlider, $itemSlider, $arrowContainer, true, true, true);

					/*$slider.on("swipe", function(event, slick, direction) {
						var $element = $(event.currentTarget).find(".main-slider-item.slick-active"),
							idElement = $element.attr("id"),
							$toggle = $(".main-slider-item-info");

						self.sliderToggleAnimation($toggle, idElement);
					});*/

					/*$(".slick-arrow", $arrowContainer).on("click", $arrowContainer, function() {
						var el = $(this),
							$container  = el.closest(".main-slider"),
							$sliderItem = $container.find(".main-slider-item.slick-active");
							idItem =  $sliderItem.attr("id"),
							$photo = $(".main-slider-item-info");

						self.sliderToggleAnimation($photo, idItem);
					});*/

					$slider.on("beforeChange", function(event, slick, currentSlide, nextSlide) {
						var $element = $(event.currentTarget).find(".main-slider-item[data-slick-index='"+nextSlide+"']"),
							idElement = $element.attr("id"),
							$toggle = $(".main-slider-item-info");
						self.sliderToggleAnimation($toggle, idElement);
					});


				},

				servicesSlider: function(slider) {
					var self = this,
						$servicesSlider = $(".services-slider"),
					 	$slider = $servicesSlider.find(slider),
						$itemSlider = $(".services-slider-item", $slider),
						$arrowContainer = $(".slick-arrow-container", $servicesSlider),
						itemSLide = -1;

					self.servicesCalculation();
					self.sliderEffect($slider, $servicesSlider, $itemSlider, $arrowContainer, false, false, true );

					/*$slider.on("swipe", function(event, slick, direction){
						if (direction == "left") {
							self.servicesCalculation("prevElement")
						} else {
							self.servicesCalculation("nextElement")
						}
					});

					$(".slick-arrow-prev", $arrowContainer).on("click", $arrowContainer, function() {
						self.servicesCalculation("nextElement");
						return;
					})
					$(".slick-arrow-next", $arrowContainer).on("click", $arrowContainer, function() {
						self.servicesCalculation("prevElement");
						return;
					})*/

					$slider.on("beforeChange", function(event, slick, currentSlide) {
						if (currentSlide < itemSLide && currentSlide !== 0) {
							self.servicesCalculation("nextElement");
						} else if (currentSlide > itemSLide && currentSlide !== 0) {
							self.servicesCalculation("prevElement");
						} else if (currentSlide == 0) {
							self.servicesCalculation("prevElement");
							itemSLide = -1;
						}
					});
				},

				advSlider: function(slider) {
					var self = this,
						$advSlider = $(".advantages-slider"),
						$slider = $advSlider.find(slider),
						$itemSlider = $(".main-slider-item", $slider),
						$arrowContainer = $(".slick-arrow-container", $advSlider);

					self.sliderEffect($slider, $advSlider, $itemSlider, $arrowContainer, false, false, true);

					/*$slider.on("swipe", function(event, slick, direction) {
						var $element = $(event.currentTarget).find(".advantages-slider-item.slick-active"),
							idElement = $element.attr("id"),
							$photo = $(".advantages-photo", ".advantages-photo-container");

						self.sliderToggleAnimation($photo, idElement);
					});

					$(".slick-arrow", $arrowContainer).on("click", $arrowContainer, function() {
						var el = $(this),
							$container  = el.closest(".advantages-slider"),
							$sliderItem = $container.find(".advantages-slider-item.slick-active");
							idItem =  $sliderItem.attr("id"),
							$photo = $(".advantages-photo", ".advantages-photo-container");

						self.sliderToggleAnimation($photo, idItem);
					});*/


					$slider.on("beforeChange", function(event, slick, currentSlide, nextSlide) {
						var $element = $(event.currentTarget).find(".advantages-slider-item[data-slick-index='"+nextSlide+"']"),

							$toggle = $(".main-slider-item-info");

							idElement = $element.attr("id"),
							$photo = $(".advantages-photo", ".advantages-photo-container");

						self.sliderToggleAnimation($photo, idElement);
					});
				},

				newsSlider: function(slider) {
					var self = this;

					slider.each(function() {
						(function(sliderItem) {
							var	$newsSlider = sliderItem.parents(".content-slider-container"),
								$slider = $newsSlider.find(sliderItem),
								$itemSlider = $(".content-slider-item", sliderItem),
								$arrowContainer = $(".slick-arrow-container", $newsSlider);

							self.sliderEffect($slider, $newsSlider, $itemSlider, $arrowContainer, false);
						})($(this));
					});

				},

				miniNews: function(slider) {
					var self = this,
						$newsSlider = $(".mini-news-slider"),
						$slider = $newsSlider.find(slider),
						$itemSlider = $(".news-item", $slider),
						$arrowContainer = $(".slick-arrow-container", $newsSlider);

					self.sliderEffect($slider, $newsSlider, $itemSlider, $arrowContainer, false);
				},

				sliderToggleAnimation: function(el, idElement) {
					var self = this;

					el.each(function (index, element) {
						var $item = $(this);

						$item.removeClass("active-animation");

						setTimeout(function() {
							$item.removeClass("active");
							$("[data-sliderToggle="+idElement+"]").addClass("active");
						}, 200);
						setTimeout(function() {
							$("[data-sliderToggle="+idElement+"]").addClass("active-animation");
						}, 400);

					});

				},

				sliderEffect: function(slider, container, itemSlider, arrowContainer, hidePoint, animate, autoplay) {
					var self= this;

					animate = animate ? true : false;
					autoplay = autoplay ? true : false;

					if (autoplay) {
						autoplay = true;
						var autoplaySpeed = 300;
					}
					slider.slick({
						arrows: true,
						appendArrows: arrowContainer,
						autoplay: autoplay,
  						autoplaySpeed: autoplaySpeed,
						prevArrow: '<div class="slick-arrow-prev"></div>',
						nextArrow: '<div class="slick-arrow-next"></div>',
						infinite: true,
						speed: 1000,
						slidesToShow: 1,
						//autoplay: true,
						autoplaySpeed: 6000,
						fade: animate,
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
						if (Math.round(xCoor) == -50) {
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
			},

			forms: {
				init: function($form) {
					var self = this;

					self.fillInput();
					self.dataMobile();

					if (!$form) {
						var $form = $sel.body;
					}

					self.validateForm($form);

				},

				fillInput: function() {
					var self = this,
						input = $(".fill-background");

					input.on("click", function() {
						var el = $(this);

						$sel.body.find(input).removeClass("active");
						if (!el.hasClass("active")) {
							el.addClass("active");
						}
					});

					$(document).mouseup(function (event) {
						if (input.has(event.target).length === 0){
							input.removeClass("active");
						}
					});
				},

				dataMobile: function() {
					var self = this;
					$("[data-number]").each(function() {
						var $item = $(this);
						$item.mask($item.data("number"));
					});
				},

				validateForm: function($form) {
					var self = this;

					$(".form", $sel.body).each(function() {
						var $form = $(this),
							$formFields = $form.find("[data-error]"),
							formParams = {
								rules: {

								},
								messages: {

								}
							};


						$formFields.each(function() {
							var $field = $(this);
							formParams.messages[$field.attr("name")] = $field.data("error");
						});

						if($form.data("success")) {

							formParams.submitHandler = function(form) {

								var options = {
									type: "ajax",
									bcgcolor: "#fff",
									customclass: "form-call-container",
									btnclosetml: '<button data-lazymodal-close class="lazy-modal-close">'+
													'<span class="form-close"></span>'+
												 '</button>',
								    positionclose: "inside",
									init: function(obj) {
										obj.options.htmlContent = $(".form", obj.options.htmlContent);
									},
								};
								$.lazymodal.open($("button",$form), options, $form.data("success"));
							};
						}
						$form.validate(formParams);
					});
				}
			},

			ajaxLoader: function() {
				$sel.body.on("click", ".load-more", function(event) {
					var $linkAddress = $(this),
						href = $linkAddress.attr("href"),
						$container = $($linkAddress.data("container"));

					$linkAddress.addClass("loading");

					(function(href, $container) {
						$.ajax({
							url: href,
							success: function(data) {
								var $data = $(data).addClass("load-events-item");
									$container.append($data);
								setTimeout(function() {
									$container.find(".load-events-item").removeClass("load-events-item");
									$linkAddress.removeClass("loading");
								}, 100);
								setTimeout(function() {
									DENTALCLINIC.bgLines.show(true);
									DENTALCLINIC.reload();
								}, 300);
							}
						})
					})(href, $container);
					event.preventDefault();
				})
			},

			accordion: {
				init: function() {
					var self = this,
						$accordion = $(".accordion"),
						$accordionItem = $(".accordion-header", $accordion);



					$accordionItem.on("click", function() {
						var $el = $(this).parent(),
							$elHide = $accordion.find(".accordion-item.active");

						if (!$el.hasClass("active")) {
							self.show($el);
							self.hide($elHide);
						} else {
							self.hide($el);
						}

					});

				},

				show: function(el) {
					var self = this;

					el.addClass("active");

					setTimeout(function() {
						el.addClass("show-content");

						setTimeout(function() {
							DENTALCLINIC.common.go(el.offset().top, 500);

							DENTALCLINIC.bgLines.show(true);
						}, 100);
					}, 300);
					setTimeout(function() {
						DENTALCLINIC.bgLines.show(true);
					}, 600);

				},

				hide: function(el) {
					el.removeClass("show-content");
					setTimeout(function() {
						el.removeClass("active");
						DENTALCLINIC.bgLines.show(true);
					}, 300);

				}

			},

			filter: {

				showEl: [],

				init: function() {
					var self = this,
						$filterItem = $("[data-filter]");

					$filterItem.on("click", function() {
						var item = $(this),
							dataItem = item.data("filter"),
							$allItem = $(".doctors-item[filter]"),
							$showItem;

						$filterItem.removeClass("active");

						setTimeout(function() {
							item.addClass("active");
						},50);

						if (dataItem === "all") {
							$showItem = $(".doctors-item[filter]");
						} else {
							$showItem = $(".doctors-item[filter *='"+dataItem+"']");
						}

						self.show($showItem, $allItem);
					});

				},

				show: function(el, elements) {
					var self = this;

					elements.addClass("hide");
					elements.parent().css("border-top", "none");
					setTimeout(function() {
						elements.addClass("hide-block");

						el.removeClass("hide-block");
						setTimeout(function() {
							el.removeClass("hide");
							el.parent().css("border-top", "1px solid rgb(242, 242, 242)");
							DENTALCLINIC.bgLines.show(true);
						},50);

					},300);
				}
			},

			modalWindow: function() {
				var self = this;
				// вызывает метод init
				$(".reviews-item[data-lazymodal]").lazyModal({
					bcgcolor: "rgba(242, 246, 244, 0.5)",
				    type: "ajax",
					init: function(obj) {
						obj.options.htmlContent = $(".reviews-item", obj.options.htmlContent);
					},
					customclass: "form-reviews-container",
					btnclosetml: '<button data-lazymodal-close class="lazy-modal-close">'+
									'<span class="form-close"></span>'+
								 '</button>',
				    positionclose: "inside",
					closeonbcg: true,
				});

				$(".open-form[data-lazymodal]").lazyModal({
				    type: "ajax",
					bcgcolor: "#fff",
					init: function(obj) {
						obj.options.htmlContent = $(".form", obj.options.htmlContent);
					},
					afterImplant: function(obj) {
						DENTALCLINIC.forms.init(obj.options.htmlContent);
					},
					customclass: "form-call-container",
					btnclosetml: '<button data-lazymodal-close class="lazy-modal-close">'+
									'<span class="form-close"></span>'+
								 '</button>',
				    positionclose: "inside",
				});

				// Options for the first group
				$("[data-fancybox]").fancybox({
					arrows : true,
					keyboard : true,
					buttons : [
						'close'
					],
					defaultType : 'image',
					animationEffect: "zoom-in-out",
				});

			},

			blackVisually: {

				clickForToggle: false,

				cookieActive: false,

				button: false,

				init: function() {
					var self = this;

					self.button = $(".mobile-menu-version");


					self.toggleVersion();

					self.button.on("click", function(e) {
						var el = $(this);
						e.preventDefault();
						self.clickForToggle = true;
						self.toggleVersion(el);
					})

				},

				checkCookie: function() {
					var self = this;
					self.cookieActive = $.cookie("poor_vision");
				},

				toggleVersion: function(el) {
					var self = this;

					self.checkCookie();

					if (self.cookieActive) {
						$sel.html.addClass("poor-vision");
						self.button.text("Обычная версия");
					}

					if ($sel.window.width() <= "1023") {
						self.button.addClass("hide");
						$sel.html.removeClass("poor-vision");
						$.removeCookie("poor_vision");
					} else {
						self.button.removeClass("hide");
					}

					if (self.clickForToggle) {
						if (self.cookieActive) {
							$sel.html.removeClass("poor-vision");
							$.removeCookie("poor_vision", { path: '/' });
							el.text("Версия для слабовидящих");
						} else {
							$sel.html.addClass("poor-vision");
							$.cookie("poor_vision", true, { path: '/' });
							el.text("Обычная версия");
						}
					}

				}

			},

			bgLines: {

				bgLinesContainer: '<div class="page-inner page-inner--w1 bg-lines"></div>',

				init: function() {
					var self = this;

					if ($sel.window.width() >= "1300") {
						$sel.body.append(self.bgLinesContainer);
						self.show();

						$sel.window.resize(function() {
							self.show(true);
						});
					}

				},

				show: function(show) {
					var self = this;

					for (var i = 5; i >= 1; i--) {
						$(".bg-lines").append('<div class="bg-lines-vertical">');
					}

					var pos = $(".bg-lines").offset();
					var widthblock = 0;

					$(".bg-lines-vertical").each(function() {

						(function($el) {
							$el.css({
								"position"    : "fixed",
								"top"         : 0,
								"bottom"      : 0,
								"background"  : "#f2f2f2",
								"width"       : "1px",
								"height"      : "100%",
								"left"		  : widthblock + pos.left + 60,
								"z-index"     : "-1000"
							});
							widthblock = widthblock + 295;
						})($(this));

					});


					var pastElem = $sel.body.find(".bg-lines-horizontal-line");
					if (show) {
						pastElem.remove();
					}

					$(".bg-lines-horizontal").each(function() {
						(function($el) {
							var posTop = $el.offset().top;
							$sel.body.append('<div class="bg-lines-horizontal-line" data-horpos="'+posTop+'">');
						})($(this));
					})

					var elements = $sel.body.find(".bg-lines-horizontal-line");

					elements.each(function() {
						var dataEl = $(this).data("horpos");
						$(this).css({
							"position"    : "absolute",
							"top"         : dataEl,
							"background"  : "#f2f2f2",
							"width"       : "100%",
							"height"      : "1px",
							"left"		  : 0,
							"right"       : 0,
							"z-index"     : "-1000"
						})
					})

				}

			},


			toggleElements: function() {
				var self = this,
					$toggle = $(".toggle");

				$toggle.each(function() {
					(function(el) {
						el.on("click", function() {
							var toggleEl = $(this),
								toggleId = toggleEl.attr("id"),
								$container = $sel.body.find("[data-toggle='"+toggleId+"']");

							if (toggleEl.hasClass("active")) {
								toggleEl.removeClass("active-animation");
								$container.removeClass("active-animation");
								setTimeout(function() {
									toggleEl.removeClass("active");
									$container.removeClass("active");
								}, 300);
							} else {
								toggleEl.addClass("active");
								$container.addClass("active");
								setTimeout(function() {
									toggleEl.addClass("active-animation");
									$container.addClass("active-animation");
								}, 300);
							}
						})
					})($(this));
				})
			},
		};

	})();

	DENTALCLINIC.menu();
	DENTALCLINIC.blackVisually.init();
	setTimeout(function() {
		DENTALCLINIC.bgLines.init();
	}, 300);
	DENTALCLINIC.mobileMenu.init();
	DENTALCLINIC.scrollAnimation.init();
	DENTALCLINIC.map.init();
	DENTALCLINIC.slickSliders.init();
	DENTALCLINIC.forms.init();
	DENTALCLINIC.ajaxLoader();
	DENTALCLINIC.accordion.init();
	DENTALCLINIC.filter.init();
	DENTALCLINIC.modalWindow();
	DENTALCLINIC.toggleElements();

	DENTALCLINIC.reload = function() {
		DENTALCLINIC.modalWindow();
		DENTALCLINIC.bgLines.init(true);
		DENTALCLINIC.scrollAnimation.init();
	}
})(jQuery);
