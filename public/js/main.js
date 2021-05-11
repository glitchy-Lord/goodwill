// ===========================
// ======== HAMBURGER ========
// ===========================

const hamburger = document.querySelector('.hamburger');
const navbarMenu = document.querySelector('.navbar__menu');

hamburger.addEventListener('click', mobileMenu);

function mobileMenu() {
	hamburger.classList.toggle('active');
	navbarMenu.classList.toggle('active');
}

// ===========================
// == MARQUEE LIKE SCROLLING ==
// ===========================

try {
	const root = document.documentElement;
	const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue(
		'--marquee-elements-displayed'
	);
	const marqueeContent = document.querySelector('.marquee__content');

	root.style.setProperty('--marquee-elements', marqueeContent.children.length);

	for (let i = 0; i < marqueeElementsDisplayed; i++) {
		marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
	}
} catch (err) {
	console.log(err);
}

// =============================
// CHANGE NAVBAR STYLE ON SCROLL
// =============================

const navbarBrand = document.querySelector('.navbar__brand');
const navbarLogo = document.querySelector('.navbar__logo');
const navbarIntersection = document.querySelector('.navbar-intersection');

const navbarIntersectionOptions = {};

const navbarIntersectionObserver = new IntersectionObserver(function (
	entries,
	navbarIntersectionObserver
) {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) {
			navbarBrand.classList.add('scrolled');
			navbarLogo.classList.add('scrolled');
			navbarMenu.classList.add('scrolled');
		} else {
			navbarBrand.classList.remove('scrolled');
			navbarLogo.classList.remove('scrolled');
			navbarMenu.classList.remove('scrolled');
		}
	});
},
navbarIntersectionOptions);

navbarIntersectionObserver.observe(navbarIntersection);

// HIGHLIGHT CURRENT PAGE IN NAVBAR

// =============================
// CAROUSEL SLIDER FOR SHOW PAGE
// =============================
try {
	// get images with the class name 'thumbnail'
	const thumbnails = document.getElementsByClassName('thumbnail');
	// get the image image with the class name 'active'
	const activeImage = document.getElementsByClassName('active');

	// loop through the images in the thumbnail array
	for (let i = 0; i < thumbnails.length; i++) {
		thumbnails[i].addEventListener('mouseover', function () {
			// on mouseover remove the 'active' class from the current image
			if (activeImage.length > 0) {
				activeImage[0].classList.remove('active');
			}
			// add the active class to the image being hovered
			this.classList.add('active');

			// change the src source of the image being displayed
			// to the image being hovered over
			document.querySelector('.img__selected').src = this.src;
		});
	}

	const btnRight = document.querySelector('.arrow-right');
	const btnLeft = document.querySelector('.arrow-left');

	btnLeft.addEventListener('click', function () {
		document.querySelector('.img-slider__container').scrollLeft -= 300;
	});

	btnRight.addEventListener('click', function () {
		document.querySelector('.img-slider__container').scrollLeft += 300;
	});
} catch (err) {
	console.log(err);
}
