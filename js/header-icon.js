'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.getElementById('menu-icon');
  const savedIcon = localStorage.getItem('setting-icon');

  if (menuIcon) {
    if (savedIcon && savedIcon.startsWith('data:image/')) {
      menuIcon.src = savedIcon;
    }
    menuIcon.addEventListener('click', () => {
      window.location.href = 'menu.html';
    });
  }
});
