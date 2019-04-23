var mainNav = document.querySelector('.main-nav');
var userNav = document.querySelector('.user-nav');
var navToggle = document.querySelector('.main-nav__toggle');

mainNav.classList.remove('main-nav--nojs');
userNav.classList.remove('user-nav--nojs');

navToggle.addEventListener('click', function () {
  if (mainNav.classList.contains('main-nav--closed') || userNav.classList.contains('user-nav--closed')) {
    mainNav.classList.remove('main-nav--closed');
    mainNav.classList.add('main-nav--opened');
    userNav.classList.remove('user-nav--closed');
    userNav.classList.add('user-nav--opened');
  } else {
    mainNav.classList.add('main-nav--closed');
    mainNav.classList.remove('main-nav--opened');
    userNav.classList.add('user-nav--closed');
    userNav.classList.remove('user-nav--opened');
  }
});
