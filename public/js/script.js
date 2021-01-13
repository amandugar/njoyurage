var cursor = {
	delay: 8,
	_x: 0,
	_y: 0,
	endX: (window.innerWidth / 2),
	endY: (window.innerHeight / 2),
	cursorVisible: true,
	cursorEnlarged: false,
	$dot: document.querySelector('.cursor-dot'),
	$outline: document.querySelector('.cursor-dot-outline'),

	init: function () {
		// Set up element sizes
		this.dotSize = this.$dot.offsetWidth;
		this.outlineSize = this.$outline.offsetWidth;

		this.setupEventListeners();
		this.animateDotOutline();
	},

	//     updateCursor: function(e) {
	//         var self = this;

	//         console.log(e)

	//         // Show the cursor
	//         self.cursorVisible = true;
	//         self.toggleCursorVisibility();

	//         // Position the dot
	//         self.endX = e.pageX;
	//         self.endY = e.pageY;
	//         self.$dot.style.top = self.endY + 'px';
	//         self.$dot.style.left = self.endX + 'px';
	//     },

	setupEventListeners: function () {
		var self = this;

		// Anchor hovering
		document.querySelectorAll('a').forEach(function (el) {
			el.addEventListener('mouseover', function () {
				self.cursorEnlarged = true;
				self.toggleCursorSize();
			});
			el.addEventListener('mouseout', function () {
				self.cursorEnlarged = false;
				self.toggleCursorSize();
			});
		});

		// Click events
		document.addEventListener('mousedown', function () {
			self.cursorEnlarged = true;
			self.toggleCursorSize();
		});
		document.addEventListener('mouseup', function () {
			self.cursorEnlarged = false;
			self.toggleCursorSize();
		});


		document.addEventListener('mousemove', function (e) {
			// Show the cursor
			self.cursorVisible = true;
			self.toggleCursorVisibility();

			// Position the dot
			self.endX = e.pageX;
			self.endY = e.pageY;
			self.$dot.style.top = self.endY + 'px';
			self.$dot.style.left = self.endX + 'px';
		});

		// Hide/show cursor
		document.addEventListener('mouseenter', function (e) {
			self.cursorVisible = true;
			self.toggleCursorVisibility();
			self.$dot.style.opacity = 1;
			self.$outline.style.opacity = 1;
		});

		document.addEventListener('mouseleave', function (e) {
			self.cursorVisible = true;
			self.toggleCursorVisibility();
			self.$dot.style.opacity = 0;
			self.$outline.style.opacity = 0;
		});
	},

	animateDotOutline: function () {
		var self = this;

		self._x += (self.endX - self._x) / self.delay;
		self._y += (self.endY - self._y) / self.delay;
		self.$outline.style.top = self._y + 'px';
		self.$outline.style.left = self._x + 'px';

		requestAnimationFrame(this.animateDotOutline.bind(self));
	},

	toggleCursorSize: function () {
		var self = this;

		if (self.cursorEnlarged) {
			self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
			self.$outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
		} else {
			self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
			self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
		}
	},

	toggleCursorVisibility: function () {
		var self = this;

		if (self.cursorVisible) {
			self.$dot.style.opacity = 1;
			self.$outline.style.opacity = 1;
		} else {
			self.$dot.style.opacity = 0;
			self.$outline.style.opacity = 0;
		}
	}
}

cursor.init();

$(window).scroll(function () {
	if ($(this).scrollTop() > 80) {
		document.getElementById("navbarTop").style.backgroundColor = "#FFFFFF";
	} else {
		document.getElementById("navbarTop").style.backgroundColor = "rgba(0, 0, 0, 0.3)";
	}
});

$(document).ready(function () {
	$("#tags").hide();
	$('#myCanvas').tagcanvas({
		textColour: '#444;',
		textFont: `'Lato', sans-serif"`,
		outlineColour: 'rgba(0,0,0,0)',
		bgOutline: null,
		freezeDecel: true,
		reverse: true,
		depth: .6,
		initial: [0.1, 0.1],
		maxSpeed: 0.1,
		dragControl: true,
		minSpeed: 0.001
	}, 'tags')
});

$('.single-item-rtl').slick({
	dots: true,
	infinite: true,
	speed: 3000,
	autoplay: true,
	autoplaySpeed: 3000,
	cssease: 'ease-in',
	slidesToShow: 1,
	pauseOnHover: false,
	pauseOnFocus: false,
	slidesToScroll: 1,
	dotsc: true,
	prevArrow: `<i class="bi bi-chevron-left a-left control-c prev slick-prev"></i>`,
	nextArrow: `<i class="bi bi-chevron-right a-right control-c next slick-next"></i>`
});
let canva = document.getElementById("myCanvas");
setInterval(function () {
	if (screen.width >= 960) {
		canva.width = 400;
		canva.height = 400;
	} else if (screen.width < 960 && screen.width >= 768) {
		canva.width = 400;
		canva.height = 400;
	} else if (screen.width < 768 && screen.width >= 350) {
		canva.width = 350;
		canva.height = 350;
	} else {
		canva.width = 270;
		canva.height = 270;
	}
}, 1000)



// Params
var sliderSelector = '.swipe1',
	options = {
		init: false,
		loop: true,
		speed: 800,
		slidesPerView: 1, // or 'auto'
		// spaceBetween: 10,
		centeredSlides: true,
		effect: 'coverflow', // 'cube', 'fade', 'coverflow',
		coverflowEffect: {
			rotate: 50, // Slide rotate in degrees
			stretch: 0, // Stretch space between slides (in px)
			depth: 100, // Depth offset in px (slides translate in Z axis)
			modifier: 1, // Effect multipler
			slideShadows: true, // Enables slides shadows
		},
		grabCursor: true,
		parallax: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		breakpoints: {
			1025: {
				slidesPerView: 3,
				spaceBetween: 0
			}
		},
		// Events
		on: {
			imagesReady: function () {
				this.el.classList.remove('loading');
			}
		}
	};
var mySwiper = new Swiper(sliderSelector, options);

// Initialize slider
mySwiper.init();

var galleryThumbs = new Swiper('.gallery-thumbs', {
	effect: 'coverflow',
	grabCursor: true,
	centeredSlides: true,
	slidesPerView: '2',
	// coverflowEffect: {
	//   rotate: 50,
	//   stretch: 0,
	//   depth: 100,
	//   modifier: 1,
	//   slideShadows : true,
	// },

	coverflowEffect: {
		rotate: 0,
		stretch: 0,
		depth: 50,
		modifier: 6,
		slideShadows: false,
	},

});


var galleryTop = new Swiper('.swiper-container.testimonial', {
	speed: 400,
	spaceBetween: 50,
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},
	direction: 'vertical',
	pagination: {
		clickable: true,
		el: '.swiper-pagination',
		type: 'bullets',
	},
	thumbs: {
		swiper: galleryThumbs
	}
});
