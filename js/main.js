// Function for triggering hamburger menu animation
function burgerClick(x) {
  x.classList.toggle('change');
  console.log(x.classList, x.classList.contains('change'));
  if (x.classList.contains('change')) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function disableScroll() {
  // Get the current page scroll position
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  (scrollLeft = window.pageXOffset || document.documentElement.scrollLeft),
    // if any scroll is attempted, set this to the previous value
    (window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    });
}

function enableScroll() {
  window.onscroll = function () {};
}
