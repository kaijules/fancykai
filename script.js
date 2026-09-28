(() => {
  const KEYS = ["spotify", "youtube", "contact", "back", "facebook", "language"];
  const LANGS = {
    vi: ["Tiếng Việt", "Playlist Spotify Của Mình", "Playlist Youtube Của Mình", "Liên Hệ Công Việc", "Quay lại trang chính", "Facebook Của Mình", "Ngôn ngữ"],
    en: ["English", "My Spotify Playlist", "My YouTube Playlist", "Work Inquiries", "Back to home", "My Facebook", "Language"],
    "zh-CN": ["简体中文", "我的 Spotify 歌单", "我的 YouTube 播放列表", "工作联系", "返回首页", "我的 Facebook", "语言"],
    "zh-TW": ["繁體中文", "我的 Spotify 播放清單", "我的 YouTube 播放清單", "工作聯絡", "返回首頁", "我的 Facebook", "語言"],
    ja: ["日本語", "私の Spotify プレイリスト", "私の YouTube プレイリスト", "お仕事のご連絡", "ホームに戻る", "私の Facebook", "言語"],
    ko: ["한국어", "내 Spotify 플레이리스트", "내 YouTube 플레이리스트", "업무 문의", "홈으로 돌아가기", "내 Facebook", "언어"],
    th: ["ไทย", "เพลย์ลิสต์ Spotify ของฉัน", "เพลย์ลิสต์ YouTube ของฉัน", "ติดต่องาน", "กลับหน้าหลัก", "Facebook ของฉัน", "ภาษา"],
    id: ["Bahasa Indonesia", "Playlist Spotify Saya", "Playlist YouTube Saya", "Kontak Pekerjaan", "Kembali ke beranda", "Facebook Saya", "Bahasa"],
    ms: ["Bahasa Melayu", "Senarai Main Spotify Saya", "Senarai Main YouTube Saya", "Hubungan Kerja", "Kembali ke laman utama", "Facebook Saya", "Bahasa"],
    hi: ["हिन्दी", "मेरी Spotify प्लेलिस्ट", "मेरी YouTube प्लेलिस्ट", "काम के लिए संपर्क", "होम पर वापस जाएँ", "मेरा Facebook", "भाषा"],
    ar: ["العربية", "قائمة تشغيل Spotify الخاصة بي", "قائمة تشغيل YouTube الخاصة بي", "التواصل للعمل", "العودة إلى الرئيسية", "حسابي على Facebook", "اللغة"],
    tr: ["Türkçe", "Spotify Çalma Listem", "YouTube Çalma Listem", "İş İletişimi", "Ana sayfaya dön", "Facebook'um", "Dil"],
    ru: ["Русский", "Мой плейлист в Spotify", "Мой плейлист на YouTube", "Связь по работе", "На главную", "Мой Facebook", "Язык"],
    de: ["Deutsch", "Meine Spotify-Playlist", "Meine YouTube-Playlist", "Geschäftliche Anfragen", "Zurück zur Startseite", "Mein Facebook", "Sprache"],
    fr: ["Français", "Ma playlist Spotify", "Ma playlist YouTube", "Contact professionnel", "Retour à l’accueil", "Mon Facebook", "Langue"],
    es: ["Español", "Mi lista de Spotify", "Mi lista de YouTube", "Contacto de trabajo", "Volver al inicio", "Mi Facebook", "Idioma"],
    pt: ["Português", "Minha playlist do Spotify", "Minha playlist do YouTube", "Contato profissional", "Voltar ao início", "Meu Facebook", "Idioma"],
    it: ["Italiano", "La mia playlist Spotify", "La mia playlist YouTube", "Contatti di lavoro", "Torna alla home", "Il mio Facebook", "Lingua"],
    pl: ["Polski", "Moja playlista na Spotify", "Moja playlista na YouTube", "Kontakt w sprawach zawodowych", "Wróć do strony głównej", "Mój Facebook", "Język"],
    nl: ["Nederlands", "Mijn Spotify-playlist", "Mijn YouTube-playlist", "Zakelijk contact", "Terug naar home", "Mijn Facebook", "Taal"],
  };
  const RTL = ["ar"];
  const DEFAULT = "en";
  const STORE = "ewiges-lang";
  const page = document.body.dataset.page;

  const save = (v) => { try { localStorage.setItem(STORE, v); } catch {} };
  const saved = () => { try { return localStorage.getItem(STORE); } catch { return null; } };

  function detect() {
    if (LANGS[saved()]) return saved();
    for (const raw of navigator.languages || [navigator.language]) {
      const tag = String(raw).toLowerCase();
      const base = tag.split("-")[0];
      if (base === "zh") return /hant|tw|hk|mo/.test(tag) ? "zh-TW" : "zh-CN";
      if (LANGS[base]) return base;
    }
    return DEFAULT;
  }

  const btn = document.createElement("button");
  btn.className = "lang-btn glass";
  btn.setAttribute("aria-haspopup", "dialog");
  btn.innerHTML = '<i class="ph ph-globe"></i><span></span>';

  const overlay = document.createElement("div");
  overlay.className = "lang-overlay";
  overlay.innerHTML = '<div class="sheet glass" role="dialog" aria-modal="true" tabindex="-1"><div class="grabber"></div><h2></h2><ul class="lang-list"></ul></div>';
  document.body.append(btn, overlay);

  const sheet = overlay.firstChild;
  const list = overlay.querySelector("ul");
  let current = DEFAULT;

  function render() {
    list.innerHTML = "";
    for (const [code, v] of Object.entries(LANGS)) {
      const li = document.createElement("li");
      li.innerHTML = '<button class="lang-item"><span></span><i class="ph ph-check"></i></button>';
      const b = li.firstChild;
      b.firstChild.textContent = v[0];
      b.firstChild.lang = code;
      b.dataset.code = code;
      if (code === current) b.setAttribute("aria-current", "true");
      list.append(li);
    }
  }

  function apply(code) {
    current = code;
    const t = LANGS[code];
    document.documentElement.lang = code;
    document.documentElement.dir = RTL.includes(code) ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t[KEYS.indexOf(el.dataset.i18n) + 1];
    });
    document.title = page === "contact" ? "Ewiges · " + t[3] : "Ewiges · @loveisubtw";
    btn.lastChild.textContent = code.toUpperCase();
    btn.setAttribute("aria-label", t[6]);
    sheet.querySelector("h2").textContent = t[6];
  }

  const open = () => {
    render();
    overlay.classList.add("open");
    document.documentElement.classList.add("no-scroll");
    const sel = list.querySelector("[aria-current]");
    if (sel) list.scrollTop = sel.offsetTop - list.clientHeight / 2 + sel.offsetHeight / 2;
    sheet.focus({ preventScroll: true });
  };
  const close = () => {
    overlay.classList.remove("open");
    document.documentElement.classList.remove("no-scroll");
    btn.focus({ preventScroll: true });
  };

  btn.addEventListener("click", open);
  overlay.addEventListener("pointerdown", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("open")) close(); });
  list.addEventListener("click", (e) => {
    const b = e.target.closest(".lang-item");
    if (!b) return;
    apply(b.dataset.code);
    save(b.dataset.code);
    close();
  });

  document.addEventListener("pointermove", (e) => {
    const g = e.target.closest && e.target.closest(".glass");
    if (!g) return;
    const r = g.getBoundingClientRect();
    g.style.setProperty("--mx", e.clientX - r.left + "px");
    g.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });

  const img = document.querySelector(".avatar");
  const noPhoto = () => {
    const box = img.parentElement;
    img.remove();
    box.textContent = document.querySelector(".name").textContent.trim().charAt(0);
  };
  img.addEventListener("error", noPhoto, { once: true });
  if (img.complete && img.naturalWidth === 0) noPhoto();

  apply(detect());
})();
