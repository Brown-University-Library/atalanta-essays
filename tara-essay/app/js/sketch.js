$(function() {

	console.log("I loaded the sketch.js file");

	//waypoints - sticky essay nav
	var waypoint = new Waypoint({
		element: document.getElementById('essay-nav'), // tells waypoint which DOM element's position to observe on scroll
		handler: function(direction) { // triggered when the top of the element hits the top of the viewport
			console.log('Direction: ' + direction);
			if(direction === 'down') { // if scrolling down the page, animate to the next part of the image
				stickEssayNav();
			}
			else { // if scrolling back up the page, animate to the previous part of the image and fade the current text out
				unstickEssayNav();
			}
		},
		offset: 50, // moving the trigger location from 0 at the top of the viewport
	});
	function stickEssayNav() {
		console.log("essay nav hit top of viewport");
		$('#essay-nav').addClass('sticky-essay-nav');
	}
	function unstickEssayNav() {
		console.log("essay nav left top of viewport");
		$('#essay-nav').removeClass('sticky-essay-nav');
	}

});