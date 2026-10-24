(async () => {
  const [rules, words] = await Promise.all(['rules.json','copy.json'].map(async file => {
    const response = await fetch(file);
    if (!response.ok) throw new Error('Content unavailable');
    return response.json();
  }));
  const languages = rules.map(item => item.code);
  const requested = new URLSearchParams(location.search).get('lang');
  const system = navigator.language || 'en';
  let language = languages.includes(requested) ? requested : system.startsWith('zh') ? (/TW|HK|Hant/i.test(system) ? 'zh-Hant' : 'zh-Hans') : languages.find(code => system.startsWith(code)) || 'en';
  const picker = document.querySelector('#language');
  for (const item of rules) { const option = document.createElement('option'); option.value = item.code; option.textContent = item.name; picker.append(option); }
  const page = document.body.dataset.page;
  const content = document.querySelector('#content');
  const node = (tag, text, className) => { const item = document.createElement(tag); if (text) item.textContent = text; if (className) item.className = className; return item; };
  const link = (text, href, className) => { const item = node('a', text, className); item.href = href; return item; };
  const internal = file => `${file}?lang=${encodeURIComponent(language)}`;
  const email = 'mailto:studio.kt@outlook.com';
  function render() {
    const w = words[language];
    const selected = rules.find(item => item.code === language);
    picker.value = language;
    document.documentElement.lang = language;
    document.title = `NumberLink · ${w[page === 'privacy' ? 16 : page === 'rules' ? 1 : 0]}`;
    document.querySelectorAll('[data-copy]').forEach(item => item.textContent = w[Number(item.dataset.copy)]);
    document.querySelectorAll('header a, footer a').forEach(item => {
      const path = item.getAttribute('href').split('?')[0];
      if (path.endsWith('.html')) { item.href = internal(path); if (path === `${page}.html`) item.setAttribute('aria-current','page'); else item.removeAttribute('aria-current'); }
    });
    content.replaceChildren();
    if (page === 'index') {
      const hero = node('section',null,'hero');
      const text = node('div'); text.append(node('div','NUMBERLINK','eyebrow'),node('h1',w[3]),node('p',w[4],'lead'));
      const actions = node('div',null,'actions'); actions.append(link(w[5],internal('rules.html'),'button'),link(w[6],email,'button secondary')); text.append(actions);
      const board = node('figure',null,'board-wrap');
      // Original completed demonstration, matching the App's 3 × 3 rules example.
      const route = [0,4,1,3,6,7,8,5,2];
      const points = route.map(cell => `${50+(cell%3)*100},${50+Math.floor(cell/3)*100}`).join(' ');
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('viewBox','0 0 300 300'); svg.setAttribute('role','img'); svg.setAttribute('aria-label',w[9]);
      const line = document.createElementNS(svg.namespaceURI,'polyline'); line.setAttribute('points',points); line.setAttribute('fill','none'); line.setAttribute('stroke','#146e64'); line.setAttribute('stroke-width','8'); line.setAttribute('stroke-linejoin','round'); svg.append(line);
      route.forEach((cell,index) => {
        const x = 50+(cell%3)*100, y = 50+Math.floor(cell/3)*100;
        const circle = document.createElementNS(svg.namespaceURI,'circle'); circle.setAttribute('cx',x); circle.setAttribute('cy',y); circle.setAttribute('r',29); circle.setAttribute('fill',index === 0 ? '#1f54c2' : index === 8 ? '#a84c08' : '#146e64');
        const digit = document.createElementNS(svg.namespaceURI,'text'); digit.setAttribute('x',x); digit.setAttribute('y',y+1); digit.setAttribute('text-anchor','middle'); digit.setAttribute('dominant-baseline','central'); digit.setAttribute('fill','white'); digit.setAttribute('font-size','25'); digit.setAttribute('font-weight','700'); digit.textContent = index+1; svg.append(circle,digit);
      });
      const legend = node('div',null,'legend'); legend.append(node('span',`1 · ${w[7]}`,'blue'),node('span',`9 · ${w[8]}`,'orange'));
      board.append(svg,legend,node('figcaption',w[9],'note')); hero.append(text,board); content.append(hero);
      const hints = node('section',null,'section'); hints.append(node('h2',w[12]),node('p',w[13]),node('h2',w[14]),node('p',w[15])); content.append(hints);
      const support = node('section',null,'section'); support.id='support'; support.append(node('h2',w[10]),node('p',w[11]),link('studio.kt@outlook.com',email,'support-email'),node('p',w[33],'note')); content.append(support);
    } else if (page === 'rules') {
      content.classList.add('reading'); content.append(node('div','NUMBERLINK','eyebrow'),node('h1',w[1]));
      const list = node('div',null,'rules-list'); for (const paragraph of selected.rules.split('\n\n')) { const rule = node('section',null,'rule'); rule.append(node('p',paragraph)); list.append(rule); } content.append(list);
    } else {
      content.classList.add('reading'); content.append(node('div','NUMBERLINK','eyebrow'),node('h1',w[16]),node('p',w[17],'note'));
      for(let index=18;index<=30;index+=2) { content.append(node('h2',w[index]),node('p',w[index+1])); if(index===24) content.append(link(w[34],'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement')); }
      content.append(node('h2',w[32]),link('studio.kt@outlook.com',email,'support-email'));
    }
  }
  picker.addEventListener('change', () => { language = picker.value; const url = new URL(location.href); url.searchParams.set('lang',language); history.replaceState(null,'',url); render(); });
  render();
})().catch(() => {
  const content = document.querySelector('#content'); content.textContent = 'Content could not load. Please contact studio.kt@outlook.com.';
});
