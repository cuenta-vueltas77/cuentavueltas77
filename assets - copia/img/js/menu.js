
(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('primary-nav');
  document.querySelectorAll('.submenu-toggle').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const ul = btn.parentElement.querySelector('.submenu');
      if(!ul) return;
      const isOpen = ul.classList.contains('show');
      ul.classList.toggle('show', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      e.stopPropagation();
    });
  });
  if(navToggle && navMenu){
    navToggle.addEventListener('click', ()=>{
      const isOpen = navMenu.getAttribute('data-state') === 'open';
      navMenu.setAttribute('data-state', isOpen ? 'closed':'open');
      navToggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }
  document.addEventListener('click', (e)=>{
    if(navMenu && navMenu.getAttribute('data-state') === 'open'){
      const inside = e.target.closest('#primary-nav, .nav-toggle');
      if(!inside){
        navMenu.setAttribute('data-state','closed');
        navToggle && navToggle.setAttribute('aria-expanded','false');
      }
    }
  });
  window.addEventListener('resize', ()=>{
    if(window.innerWidth >= 1024 && navMenu){
      navMenu.setAttribute('data-state','closed');
      navToggle && navToggle.setAttribute('aria-expanded','false');
      document.querySelectorAll('.submenu').forEach(ul=>ul.classList.remove('show'));
      document.querySelectorAll('.submenu-toggle').forEach(b=>b.setAttribute('aria-expanded','false'));
    }
  });
  
})();
