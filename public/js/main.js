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

// a try catch block for when you are on a different page
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
	// get the arrow images that will be used for the scroll
	const btnRight = document.querySelector('.arrow-right');
	const btnLeft = document.querySelector('.arrow-left');

	// scroll left when the left arrow is clicked
	btnLeft.addEventListener('click', function () {
		document.querySelector('.img-slider__container').scrollLeft -= 300;
	});

	// scroll right when the right arrow is clicked
	btnRight.addEventListener('click', function () {
		document.querySelector('.img-slider__container').scrollLeft += 300;
	});
} catch (err) {
	console.log(err);
}

// =============================
// ===== CUSTOM FILE INPUT =====
// =============================

// if internet explorer support is not needed use below
// querySelector('.new-form__image-btn').forEach()
// call the forEach method on the Array prototype for each one of the elements selected
try {
	Array.prototype.forEach.call(
		document.querySelectorAll('.new-form__image-button'),
		function (button) {
			// get the parent element of the button and select the input from the element
			const hiddenInput = button.parentElement.querySelector(
				'.new-form__image-input'
			);
			// get the parent element of the button and select the input from the element
			const label = button.parentElement.querySelector(
				'.new-form__image-label'
			);
			// default text for label
			const defaultLabelText = 'No file(s) selected';
			// set default text and title of label
			label.innerHTML = defaultLabelText;
			label.title = defaultLabelText;

			// when the button is clicked click the hidden input
			button.addEventListener('click', function () {
				hiddenInput.click();
			});

			// when the input changes run the function
			hiddenInput.addEventListener('change', function () {
				// if internet explorer support is not needed use below
				// Array.from(hiddenInput.files).map(function (file) {});
				const filenameList = Array.prototype.map.call(
					hiddenInput.files,
					function (file) {
						return file.name;
					}
				);

				// join the file names with a comma and space
				// and if no files are selected use defaultLabelText
				label.textContent = filenameList.join(', ') || defaultLabelText;
				label.title = label.textContent;
			});
		}
	);
} catch (err) {
	console.log(err);
}

// const imgSelected = document.querySelector('.img__selected');
// imgSelected.addEventListener('click', function () {
// 	this.classList.add('fullscreen');
// });
