
"use strict";
var openMenu = document.getElementById('open_menu');
var closeMenu = document.getElementById('close_menu');
var menu = document.getElementById('menu');

openMenu.addEventListener('click', function() {
  menu.classList.add('shown');
});
closeMenu.addEventListener('click', function() {
  menu.classList.remove('shown');
});
