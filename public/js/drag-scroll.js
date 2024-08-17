document.addEventListener('DOMContentLoaded', () => {
  const reviewsContainer = document.querySelector('.reviews');
  let isDown = false;
  let startX;
  let scrollLeft;

  reviewsContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    reviewsContainer.classList.add('active');
    startX = e.pageX - reviewsContainer.offsetLeft;
    scrollLeft = reviewsContainer.scrollLeft;
  });

  reviewsContainer.addEventListener('mouseleave', () => {
    isDown = false;
    reviewsContainer.classList.remove('active');
  });

  reviewsContainer.addEventListener('mouseup', () => {
    isDown = false;
    reviewsContainer.classList.remove('active');
  });

  reviewsContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - reviewsContainer.offsetLeft;
    const walk = (x - startX) * 0.75; // Scroll-fast speed multiplier
    reviewsContainer.scrollLeft = scrollLeft - walk;
  });
});
