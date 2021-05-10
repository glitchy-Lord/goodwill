// for hamburger

const hamburger = document.querySelector('.hamburger');
const navbarMenu = document.querySelector('.navbar__menu');

hamburger.addEventListener('click', mobileMenu);

function mobileMenu() {
	hamburger.classList.toggle('active');
	navbarMenu.classList.toggle('active');
}

// for marquee like scrolling

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

// change navbar style on scroll

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
