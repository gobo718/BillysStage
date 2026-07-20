(()=>{
  if(document.querySelector('.billy-bottom-nav')) return;
  if(location.pathname.endsWith('/explorer.html')||location.pathname.endsWith('/explorer')){document.body.dataset.page='archive';}
  const style=document.createElement('style');
  style.textContent=`
    body{padding-bottom:92px!important}
    body[data-page='archive'] .billy-bottom-nav{display:none!important}
    .billy-bottom-nav{position:fixed;z-index:9999;left:50%;bottom:max(10px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(620px,calc(100% - 18px));display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:3px;padding:7px;border:1px solid rgba(255,255,255,.16);border-radius:22px;background:rgba(10,9,25,.94);box-shadow:0 18px 55px rgba(0,0,0,.55);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
    .billy-bottom-nav a{min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:7px 1px;border-radius:14px;color:#eee8ff;text-decoration:none;font:800 10px/1.1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:0}
    .billy-bottom-nav a:hover,.billy-bottom-nav a:focus-visible{background:rgba(255,255,255,.09);outline:none}
    .billy-bottom-nav a[aria-current="page"]{background:linear-gradient(135deg,rgba(139,92,255,.34),rgba(255,104,170,.22));color:#fff}
    .billy-bottom-nav .nav-icon{font-size:1.35rem;line-height:1;transition:transform .18s ease}
    .billy-bottom-nav a[aria-current="page"] .nav-icon{transform:scale(1.13)}
    @media(max-width:420px){
      body{padding-bottom:86px!important}
      .billy-bottom-nav{width:calc(100% - 12px);gap:1px;padding:5px;border-radius:19px}
      .billy-bottom-nav a{font-size:8.5px;padding:7px 0;border-radius:12px}
      .billy-bottom-nav .nav-icon{font-size:1.2rem}
    }
  `;
  document.head.append(style);
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const items=[
    ['index.html','🏠','Home'],
    ['studio.html','🎨','Studio'],
    ['blurblets.html','🖼️','Gallery'],
    ['profile.html','👤','Profile'],
    ['trophy-room.html','🏆','Trophies']
  ];
  const nav=document.createElement('nav');
  nav.className='billy-bottom-nav';
  nav.setAttribute('aria-label','Main navigation');
  nav.innerHTML=items.map(([href,icon,label])=>`<a href="${href}"${current===href?' aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`).join('');
  document.body.append(nav);
})();
