const themeMap = {
    dark: "light",
    light: "solar",
    solar: "dark"
  };
  
  const theme = localStorage.getItem('theme')
    || (tmp = Object.keys(themeMap)[0],
        localStorage.setItem('theme', tmp),
        tmp);
  const bodyClass = document.body.classList;
  bodyClass.add(theme);
  
  function toggleTheme() {
    const current = localStorage.getItem('theme');
    const next = themeMap[current];
  
    bodyClass.replace(current, next);
    localStorage.setItem('theme', next);
  }
  
  document.getElementById('themeButton').onclick = toggleTheme;
//Change the contents based on the user navbar clicks 
  var $content = $('.menu-content');

  function showContent(type) {
    $content.hide().filter('.' + type).show();
  }
  
  $('.navbar').on('click', '.nav-link', function(e) {
    showContent(e.currentTarget.hash.slice(1));
    e.preventDefault();
  }); 
  
  // show 'about' content only on page load (if you want)
  showContent('Zombies');