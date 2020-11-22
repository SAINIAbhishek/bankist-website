'use strict';

///////////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent= document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight= document.querySelector('.slider__btn--right');
const sliderDotContainer= document.querySelector('.dots');

const openModal = function (event) {
    event.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// cookie message element
const message = document.createElement('div');
message.classList.add('cookie-message')
message.innerHTML = 'We use cookies to improve functionality and analytics. ' +
    '<button class="btn btn--close-cookie">Got it!</button>';
header.before(message);
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
document.querySelector('.btn--close-cookie').addEventListener('click', function () {
   message.remove();
});

// scroll to section
btnScrollTo.addEventListener('click', function (e) {
    // first method
    /*const s1cords = section1.getBoundingClientRect();
    window.scrollTo({
        left: s1cords.left + window.pageXOffset,
        top: s1cords.top + window.pageYOffset,
        behavior: 'smooth'
    });*/

    // another way
    section1.scrollIntoView({behavior: 'smooth'});
});

// page navigation
navLinks.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target && e.target['classList']['contains']('nav__link')) {
        const id = e.target['getAttribute']('href');
        if (id) {
            document.querySelector(id).scrollIntoView({behavior: 'smooth'});
        }
    }
});

// tabbed component
tabsContainer.addEventListener('click', function(e) {
    const btn = e.target['closest']('.operations__tab');
    if (!btn) return;

    // active tab
    tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
    btn.classList.add('operations__tab--active');

    // active content
    tabsContent.forEach((content) => content.classList.remove('operations__content--active'));
    document.querySelector(`.operations__content--${btn.dataset.tab}`).classList.add('operations__content--active');
});

// menu fade animation
const navHover = function (e) {
    if (e.target['classList'].contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach((el) => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
};

// bind will return a new function, passing "argument" into handler
nav.addEventListener('mouseover', navHover.bind(0.5));
nav.addEventListener('mouseout', navHover.bind(1));

// navigation sticky
const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(function(entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
        message.style.display = 'none';
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
        message.style.display = 'flex';
    }
}, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);

// scroll effect
const revealSection = function(entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection,{
    root: null,
    threshold: 0.15
});

allSections.forEach((section) => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

// lazy loading images
const loadImg = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0
});

imgTargets.forEach((img) => imgObserver.observe(img));

// slider
const slider = function () {
    let currentSlide = 0;
    const maxSlides = slides.length;

    const goToSlide = function (slide) {
        slides.forEach((s, index) => {
            s.style.transform = `translateX(${100 * (index - slide)}%)`;
        });
    };

    // dots
    const createDots = function () {
        slides.forEach((_, i) => {
            sliderDotContainer.insertAdjacentHTML('beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`);
        });
    };

    const activeDot = function (slide) {
        document.querySelectorAll('.dots__dot').forEach((dot) => {
            dot.classList.remove('dots__dot--active');
        });
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    };

    // initialize slider
    goToSlide(currentSlide);
    createDots();
    activeDot(currentSlide);

    // next slide
    const nextSlide = function () {
        if (currentSlide === (maxSlides - 1)) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        goToSlide(currentSlide);
        activeDot(currentSlide);
    };
    sliderBtnRight.addEventListener('click', nextSlide);

    // prev slide
    const prevSlide = function () {
        if (currentSlide === 0) {
            currentSlide = maxSlides - 1;
        } else {
            currentSlide--;
        }
        goToSlide(currentSlide);
        activeDot(currentSlide);
    };
    sliderBtnLeft.addEventListener('click', prevSlide);

    // keyboard event
    document.addEventListener('keydown', function (e) {
        e.key === 'ArrowLeft' && prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    });

    sliderDotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            const {slide} = e.target['dataset'];
            goToSlide(slide);
            activeDot(slide);
        }
    });
};
slider();


