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

$(window).scroll(function () {
	if ($(this).scrollTop() > 80) {
		document.getElementById("navbarTop").style.backgroundColor = "#FFFFFF";
	} else {
		document.getElementById("navbarTop").style.backgroundColor = "rgba(0, 0, 0, 0.3)";
	}
});

cursor.init();

if (window.location.pathname === "/") {

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
				rotate: 50,
				stretch: 0,
				depth: 100,
				modifier: 1,
				slideShadows: true,
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


	mySwiper.init();

	var galleryThumbs = new Swiper('.gallery-thumbs', {
		effect: 'coverflow',
		grabCursor: true,
		centeredSlides: true,
		slidesPerView: '2',
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
}
if (window.location.pathname === "/about") {
	var myIndex = 0;
	carousel();

	function carousel() {
		var i;
		var x = document.getElementsByClassName("mySlides");
		for (i = 0; i < x.length; i++) {
			x[i].style.display = "none";
		}
		myIndex++;
		if (myIndex > x.length) { myIndex = 1 }
		x[myIndex - 1].style.display = "block";
		setTimeout(carousel, 2000); // Change image every 2 seconds
	}
}