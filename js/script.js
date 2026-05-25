const barMenu = document.getElementById('bar-menu');
const nav = document.querySelector('header nav');

barMenu.addEventListener('click', (e) => {
  e.stopPropagation();

  nav.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !barMenu.contains(e.target)) {
    nav.classList.remove('active');
  }
});
