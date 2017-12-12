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
		};

	})();

	DENTALCLINIC.menu();
})(jQuery);
