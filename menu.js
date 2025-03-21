const menuItems = [
  { name: '主页', link: 'index.html' },
  { name: '赌马1.0', link: './games/horse-racing/index.html' },
  { name: '赌马2.0', link: './games/horse-racing-2/index.html' }
];

function generateMenu(activePage) {
  const ul = document.createElement('ul');
  menuItems.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.link;
    a.textContent = item.name;
    if (item.link === activePage) {
      a.classList.add('active');
    }
    li.appendChild(a);
    ul.appendChild(li);
  });
  document.body.insertBefore(ul, document.body.firstChild);
}

document.addEventListener('DOMContentLoaded', () => {
  const activePage = document.body.getAttribute('data-active-page');
  generateMenu(activePage);
});