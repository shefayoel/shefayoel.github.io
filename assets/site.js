// גרסה 2 - 2026-10-25 - משימה יג: כפתור הצטרפות גדול ובולט "הצטרפו לקבלת המסר היומי מענינא דיומא" (בדף יום - גם למעלה בקטן). (1: דפי השפות וההצטרפות, רק הודעות שפורסמו)
(function () {
  var app = document.getElementById('app');
  var kind = app.getAttribute('data-kind'), l = app.getAttribute('data-lang'), ddmm = app.getAttribute('data-ddmm');
  // הכתובת עצמה קובעת את היום (גם אם נפתח /y/2610 בלי .html)
  var m = location.pathname.match(/\/([ye])\/(\d{4})(?:\.html)?\/?$/);
  if (m) { l = m[1]; ddmm = m[2]; }
  // לפי המילון (גרסה 6). היידיש והאנגלית - חדשים, לאישור דבורה
  var JOIN = { h: 'הצטרפו לקבלת המסר היומי מענינא דיומא', y: 'שליסט אייך אן צו באקומען דעם טעגליכן מסר פון ענינא דיומא', e: "Join to receive the daily message of Inyana D'Yoma" };
  var WAIT = { h: 'טוען...', y: 'טוען...', e: 'Loading...' };
  var NONE = { y: 'עוד לא פורסם.', e: 'Not published yet.' };
  var NOCH = { h: 'הערוץ עוד לא הוגדר.', y: 'הערוץ עוד לא הוגדר.', e: 'The channel is not set up yet.' };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function jsonp(params, cb) {
    var name = 'sy' + Math.random().toString(36).slice(2), s = document.createElement('script'), done = false;
    window[name] = function (d) { done = true; cb(d); delete window[name]; s.remove(); };
    s.src = window.SHEFA.api + '?' + params + '&callback=' + name;
    s.onerror = function () { if (!done) cb(null); };
    document.body.appendChild(s);
    setTimeout(function () { if (!done) cb(null); }, 15000);
  }
  function load(params, cb) {
    // fetch, ואם הדפדפן חוסם - JSONP (אותו מקור נתונים)
    if (!window.fetch) return jsonp(params, cb);
    fetch(window.SHEFA.api + '?' + params).then(function (r) { return r.json(); }).then(cb, function () { jsonp(params, cb); });
  }
  function linkify(s) {
    return s.replace(/((?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<]*)?)/gi, function (u) {
      if (/^\d/.test(u)) return u;
      return '<a href="' + (/^https?:/i.test(u) ? u : 'https://' + u) + '">' + u + '</a>';
    });
  }
  // *מודגש*, _נטוי_, > ציטוט, "· · ·" מפריד
  function render(text) {
    return String(text).split('\n').map(function (raw, i) {
      if (!raw.trim()) return '<div class="gap"></div>';
      if (raw.trim() === '· · ·') return '<p class="sep">· · ·</p>';
      var q = /^>\s?/.test(raw);
      var h = linkify(esc(raw.replace(/^>\s?/, '')))
        .replace(/\*([^*\n]+)\*/g, '<b>$1</b>')
        .replace(/(^|\s)_([^_\n]+)_(?=\s|$)/g, '$1<i>$2</i>');
      if (q) return '<blockquote>' + h + '</blockquote>';
      // חוקה גרסה 2: דברי הרבי - שורות מודגשות כולן, במרכז
      var bq = i > 0 && /^\*[^*\n]+\*$/.test(raw.trim()) && !/^\*[("]/.test(raw.trim());
      return '<p dir="auto"' + (i === 0 ? ' class="ctx"' : bq ? ' class="q"' : '') + '>' + h + '</p>';
    }).join('');
  }
  // הקישור לערוץ נקרא פעם אחת (גיליון "הגדרות", "קישור הערוץ"). big - הכפתור הגדול, אחרת הקטן שלמעלה
  var cfgWait = null;
  function channel(cb) {
    if (!cfgWait) cfgWait = new Promise(function (res) { load('api=cfg', function (d) { res(d && d.channel ? d.channel : ''); }); });
    cfgWait.then(cb);
  }
  function joinBtn(key, cb, small) {
    channel(function (ch) {
      cb(ch ? '<a class="btn join' + (small ? ' small' : '') + '" href="' + esc(ch) + '" rel="noopener">' + JOIN[key] + '</a>'
        : (small ? '' : '<p class="wait">' + NOCH[key] + '</p>'));
    });
  }

  if (kind === 'join') {
    var slot = document.getElementById('join');
    slot.innerHTML = '<p class="wait">' + WAIT.h + '</p>';
    joinBtn('h', function (h) { slot.innerHTML = h; });
    return;
  }
  if (kind === 'day') {
    var box = document.getElementById('msg'), jb = document.getElementById('join');
    box.innerHTML = '<p class="wait">' + WAIT[l] + '</p>';
    // למעלה - כפתור קטן (בלי לבנות מחדש את 732 דפי הימים)
    var top = document.createElement('div'); top.id = 'joinTop';
    box.parentNode.insertBefore(top, box);
    joinBtn(l, function (h) { top.innerHTML = h; }, true);
    load('api=pub&l=' + l + '&d=' + ddmm, function (d) {
      box.innerHTML = d && d.ok ? '<div class="card">' + render(d.text) + '</div>' : '<p class="wait">' + NONE[l] + '</p>';
    });
    joinBtn(l, function (h) { jb.innerHTML = h; });
  }
})();
