/* ===== OSTERIA DEL BORGO ANTICO · main.js ===== */
(function(){
  'use strict';

  /* ---------- INTRO ---------- */
  var intro=document.getElementById('intro'),skip=document.getElementById('intro-skip');
  function closeIntro(){if(intro){intro.classList.add('done');}try{sessionStorage.setItem('oba_seen','1');}catch(e){}}
  var seen=false;try{seen=sessionStorage.getItem('oba_seen')==='1';}catch(e){}
  if(seen&&intro){intro.parentNode.removeChild(intro);}
  else if(intro){setTimeout(closeIntro,2100);if(skip)skip.addEventListener('click',closeIntro);}

  /* ---------- HEADER SCROLL ---------- */
  var header=document.getElementById('site-header');
  function onScroll(){if(header)header.classList.toggle('scrolled',window.scrollY>12);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* ---------- BURGER / NAV ---------- */
  var burger=document.getElementById('burger'),nav=document.querySelector('.nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');});});
  }

  /* ---------- ORARI DINAMICI ---------- */
  // getDay() 0=Dom..6=Sab. Lun–Sab pranzo 12:30–14:30 + cena 19:30–24:00 · Dom chiuso
  var LS=[[12.5,14.5],[19.5,24]];
  var TABLE={0:[],1:LS,2:LS,3:LS,4:LS,5:LS,6:LS};
  var DAYS_IT=['dom','lun','mar','mer','gio','ven','sab'];
  var DAYS_EN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function fmt(h){h=h%24;var H=Math.floor(h),M=Math.round((h-H)*60);return H+':'+(M<10?'0'+M:''+M);}
  function nowRome(){var s=new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'});return new Date(s);}
  function computeLive(){
    var d=nowRome(),day=d.getDay(),hour=d.getHours()+d.getMinutes()/60;
    var wins=TABLE[day]||[],openNow=false,closeAt=null;
    for(var i=0;i<wins.length;i++){if(hour>=wins[i][0]&&hour<wins[i][1]){openNow=true;closeAt=wins[i][1];break;}}
    var nextOpen=null,nextDay=null;
    if(!openNow){
      for(var j=0;j<wins.length;j++){if(wins[j][0]>hour){nextOpen=wins[j][0];nextDay=day;break;}}
      if(nextOpen===null){for(var k=1;k<=7;k++){var dd=(day+k)%7,w2=TABLE[dd];if(w2&&w2.length){nextOpen=w2[0][0];nextDay=dd;break;}}}
    }
    return {openNow:openNow,closeAt:closeAt,nextOpen:nextOpen,nextDay:nextDay,day:day};
  }
  function renderLive(){
    var dot=document.getElementById('live-dot'),txt=document.getElementById('live-text');
    if(!dot||!txt)return;
    var L=computeLive(),en=document.documentElement.lang==='en',DAYS=en?DAYS_EN:DAYS_IT;
    dot.className='';
    if(L.openNow){
      dot.classList.add('open');
      txt.textContent=en?('Open now · until '+fmt(L.closeAt)):('Aperto ora · fino alle '+fmt(L.closeAt));
    }else{
      dot.classList.add('closed');
      if(L.nextOpen!==null){
        var sameDay=L.nextDay===L.day;
        var dl=DAYS[L.nextDay];
        if(en)txt.textContent='Closed · opens '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
        else txt.textContent='Chiuso · apre '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
      }else{txt.textContent=en?'Closed':'Chiuso';}
    }
  }

  /* ---------- I18N ---------- */
  var EN={
    'intro.skip':'Enter →',
    'brand.sub':'Mediterranean cuisine · Sempione',
    'nav.storia':'The borgo','nav.carta':'The food','nav.pareti':'On the walls','nav.dove':'Find us',
    'cta.book':'Book',
    'hero.eyebrow':'Via Piero della Francesca · Sempione',
    'hero.tag':'by candlelight',
    'hero.sub':'An <b>intimate, warm-toned space</b>, where Mediterranean cooking is served among the <b>black-and-white photographs</b> and the candles. Octopus, tagliolini with truffle, the fish of the day and desserts made in-house. <em>As in an old borgo.</em>',
    'hero.cta1':'Book a table','hero.cta2':'The food',
    'hero.live':'Checking hours…','hero.f2':'★ 4.5 · 550+ reviews',
    'storia.kicker':'The borgo',
    'storia.h2':'An intimate space,<br>in warm tones.',
    'storia.p1':'Osteria del Borgo Antico is a little world of its own, a few steps from Corso Sempione. A few small rooms, low lights, <b>walls covered in black-and-white photographs</b> and candles on the tables.',
    'storia.p2':'In the kitchen, essential Mediterranean flavours: <em>creativity, originality and simplicity</em> that meet, between tradition and a little flair. Attentive, courteous service, with a value-for-money the guests love.',
    'storia.s1':'550+ reviews','storia.s2b':'Mediterranean','storia.s2':'from the sea and the land','storia.s3b':'Sempione','storia.s3':'by candlelight',
    'carta.kicker':'The food','carta.h2':'From the sea, from the land,<br>from tradition.',
    'carta.sub':'A menu that changes with the seasons. Here are some of the dishes that tell our story.',
    'carta.antipasti':'Starters','carta.primi':'First courses','carta.secondi':'Main courses','carta.dolci':'House desserts',
    'c.a1':'Tender octopus','c.a1p':'well-dressed, above expectations','c.a2':'Beef tartare','c.a2p':'knife-cut, with its contrasts','c.a3':'Welcome bruschetta','c.a3p':'to begin',
    'c.p1':'Tagliolini with truffle','c.p1p':'with speck and cream','c.p2':'Linguine, pistachio pesto &amp; red prawn','c.p2p':'balanced and full of flavour','c.p3':'Tagliolini with scampi &amp; king prawns','c.p3p':'the sea on the plate',
    'c.s1':'Fish of the day','c.s1p':'with vegetables and olives','c.s2':'Tagliata on the pan','c.s2p':'«done to perfection»','c.s3':'Seafood soup','c.s3p':'mussels, squid and shellfish',
    'c.d1':'House tiramisù','c.d1p':'served à la minute','c.d2':'Ricotta &amp; chocolate','c.d2p':'with cream gelato','c.d3':'«Spectacular» desserts','c.d3p':'the guests’ own words',
    'carta.note':'The dishes change with the market and the season: ask us for the evening’s suggestions.',
    'pareti.kicker':'On the walls','pareti.h2':'The black-and-white photographs',
    'pareti.sub':'Our walls tell stories. Let your eye rest on them — and they light up in colour.',
    'rev.kicker':'Voices','rev.h2':'“A truly lovely dinner”','rev.g1':'Google review · <span>★★★★★</span>','rev.g2':'Google review · <span>★★★★★</span>','rev.g3':'Google review · <span>★★★★★</span>',
    'dove.kicker':'Find us','dove.h2':'On Via Piero della Francesca,<br>steps from the Sempione.',
    'dove.addr':'Address','dove.addr2':'— Sempione','dove.hours':'Hours','dove.hoursv':'Mon–Sat · lunch 12:30–14:30 · dinner 19:30–24:00 · Sun closed',
    'dove.phone':'Phone','dove.book':'Reservations','dove.bookv':'Best to book: the space is small and much loved.',
    'dove.book2':'Book on TheFork','dove.route':'Get directions',
    'faq.h2':'Frequently asked questions',
    'faq.q1':'Where is Osteria del Borgo Antico?','faq.a1':'On Via Piero della Francesca 40, a few steps from Corso Sempione, in Milan. It’s an intimate space, so it’s best to book.',
    'faq.q2':'What kind of cooking do you do?','faq.a2':'Mediterranean cuisine, with a particular love of fish: octopus, tartare, tagliolini with truffle, linguine with red prawn, the fish of the day and desserts made in-house.',
    'faq.q3':'How do I book?','faq.a3':'You can book online on TheFork or call the restaurant. The space is intimate and much in demand, so booking is recommended.',
    'faq.q4':'When are you open?','faq.a4':'Monday to Saturday, for lunch 12:30–14:30 and dinner 19:30–24:00. Closed Sunday.',
    'foot.sub':'Mediterranean cuisine · by candlelight · Sempione, Milan',
    'foot.where':'Where','foot.hours':'Hours','foot.hours2':'Mon–Sat 12:30–14:30','foot.hours3':'19:30–24:00 · Sun closed','foot.contact':'Contact',
    'foot.disclaimer':'Demonstration site. Content and photos gathered from public sources (Google Maps); hours, dishes and details are indicative, to be confirmed with the osteria.',
    'ab.book':'Book','ab.carta':'The food','ab.route':'Directions'
  };
  var IT={};
  function snapshotIT(){document.querySelectorAll('[data-i18n]').forEach(function(el){IT[el.getAttribute('data-i18n')]=el.innerHTML;});}
  function applyLang(lang){
    var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(dict[k]!==undefined)el.innerHTML=dict[k];
      else if(IT[k]!==undefined)el.innerHTML=IT[k];
    });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-lang')===lang);});
    try{sessionStorage.setItem('oba_lang',lang);}catch(e){}
    renderLive();
  }
  snapshotIT();
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){applyLang(b.getAttribute('data-lang'));});});
  var savedLang='it';try{savedLang=sessionStorage.getItem('oba_lang')||'it';}catch(e){}
  if(savedLang==='en')applyLang('en');else renderLive();

  /* ---------- REVEAL ---------- */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{threshold:0.1,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---------- LIGHTBOX ---------- */
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),lbClose=document.getElementById('lb-close');
  document.querySelectorAll('.pw-item').forEach(function(fig){
    fig.addEventListener('click',function(){
      var full=fig.getAttribute('data-full');if(!full)return;
      lbImg.src=full;var im=fig.querySelector('img');lbImg.alt=im?im.alt:'';
      lb.classList.add('open');lb.setAttribute('aria-hidden','false');
    });
  });
  function closeLb(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');setTimeout(function(){lbImg.src='';},300);}
  if(lbClose)lbClose.addEventListener('click',closeLb);
  if(lb)lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb();});

  /* ---------- LIVE tick ---------- */
  setInterval(renderLive,60000);
})();
