// גרסה 1 - 2026-10-24 - דפי השפות וההצטרפות: קורא מה-Web app רק הודעות שפורסמו, ומציג אותן כמו בווצאפ
(function () {
  var app = document.getElementById('app');
  var kind = app.getAttribute('data-kind'), l = app.getAttribute('data-lang'), ddmm = app.getAttribute('data-ddmm');
  // הכתובת עצמה קובעת את היום (גם אם נפתח /y/2610 בלי .html)
  var m = location.pathname.match(/\/([ye])\/(\d{4})(?:\.html)?\/?$/);
  if (m) { l = m[1]; ddmm = m[2]; }
  var JOIN = { h: 'הצטרפו לערוץ', y: 'זיך אנשליסן צו שפע יואל', e: 'Join Shefa Yoel' };
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
      return '<p dir="auto"' + (i === 0 ? ' class="ctx"' : '') + '>' + h + '</p>';
    }).join('');
  }
  function joinBtn(key, cb) {
    load('api=cfg', function (d) {
      cb(d && d.channel ? '<a class="btn" href="' + esc(d.channel) + '" rel="noopener">' + JOIN[key] + '</a>' : '<p class="wait">' + NOCH[key] + '</p>');
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
    load('api=pub&l=' + l + '&d=' + ddmm, function (d) {
      box.innerHTML = d && d.ok ? '<div class="card">' + render(d.text) + '</div>' : '<p class="wait">' + NONE[l] + '</p>';
    });
    joinBtn(l, function (h) { jb.innerHTML = h; });
  }
})();
