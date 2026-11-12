/* =========================================================
   Komalashes — script.js (Vanilla JS)
   ========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     KONFIGURACJA — tu zmieniasz dane kontaktowe i wysyłkę formularza
     --------------------------------------------------------- */
  const CONFIG = {
    // Dane demonstracyjne — zamień na prawdziwe.
    instagramUrl: 'https://www.instagram.com/komalashes/',
    instagramHandle: '@komalashes',
    phone: '+48 000 000 000',
    email: 'kontakt@example.com',
    addressLine1: 'ul. Marszałkowska 10',
    addressLine2: '00-590 Warszawa',

    // Wysyłka zgłoszeń. Puste = TRYB DEMONSTRACYJNY (nic nie jest wysyłane,
    // a strona NIE pokazuje fałszywego potwierdzenia).
    // Wpisz adres swojego endpointu (POST, JSON), np. '/api/lead'.
    // Telegram: NIE wkładaj tokena bota do tego pliku (jest publiczny).
    // Wyślij dane do własnej funkcji serwerowej (Netlify/Vercel/Cloudflare Worker),
    // a ona wywoła https://api.telegram.org/bot<TOKEN>/sendMessage.
    submitEndpoint: ''
  };


  /* ---------------------------------------------------------
     OPINIE — UWAGA: poniższe opinie, imiona i oceny są DEMONSTRACYJNE (wymyślone na potrzeby makiety).
     Przed publikacją strony zastąp je prawdziwymi opiniami klientek za ich zgodą.
     Pola: name (imię), service (usługa, opcjonalnie), rating (1–5), text (treść), tone (1–4, kolor awatara, opcjonalnie).
     Długą opinię karta skraca automatycznie i pokazuje przycisk „Czytaj całość”.
     Pusta tablica [] = cała sekcja „Opinie” jest ukryta.
     --------------------------------------------------------- */
  const REVIEWS = [
    {
      name: 'Karolina M.',
      service: 'Przedłużanie rzęs',
      rating: 5,
      text: 'Rzęsy wyglądają bardzo naturalnie, dokładnie tak, jak chciałam. W gabinecie panuje spokojna atmosfera i od początku czułam się komfortowo.'
    },
    {
      name: 'Natalia K.',
      service: 'Mokry efekt (Wet Look)',
      rating: 5,
      text: 'Od dawna chciałam wypróbować mokry efekt i zupełnie nie wiedziałam, czy będzie pasował do kształtu moich oczu. Przed wizytą dostałam od Juli szczerą radę i dobrała długość oraz skręt właśnie pod mnie. Efekt jest wyrazisty, a jednocześnie wygodny w noszeniu.\n\nZ ceny dla modelek skorzystałam z przyjemnością, a z wizyty wyszłam bardzo zadowolona. Na pewno wrócę na uzupełnienie.'
    },
    {
      name: 'Marta W.',
      service: 'Stylizacja rzęs',
      rating: 5,
      text: 'Bardzo dokładna praca i miła rozmowa o tym, jaki efekt chcę uzyskać. Spojrzenie jest wreszcie otwarte, a rzęsy nie ciążą.'
    },
    {
      name: 'Oliwia S.',
      service: 'Przedłużanie rzęs',
      rating: 5,
      text: 'Byłam trochę zestresowana, bo to moje pierwsze przedłużanie rzęs. Julia spokojnie wszystko wyjaśniła, pokazała, jak będzie wyglądał efekt, i dopasowała go do mojego stylu na co dzień. Przez całą wizytę mogłam się zrelaksować.\n\nRzęsy wyglądają lekko i elegancko, a ja nie muszę już codziennie używać tuszu. Polecam każdej, która chce zacząć bez presji.'
    },
    {
      name: 'Kamila R.',
      service: 'Mokry efekt (Wet Look)',
      rating: 4,
      text: 'Efekt robi wrażenie, dostałam sporo komplementów. Wizyta była trochę dłuższa, niż zakładałam, ale warto było poczekać.'
    },
    {
      name: 'Aleksandra P.',
      service: 'Stylizacja rzęs',
      rating: 5,
      text: 'Szukałam kogoś, kto dobierze stylizację do kształtu moich oczu, a nie zrobi „jeden efekt dla wszystkich”. Tu dostałam dokładnie to: rozmowę, propozycję kilku wariantów i spokojną, precyzyjną pracę.\n\nRzęsy wyglądają świetnie, a w gabinecie jest naprawdę przyjemnie. Chętnie umówię się ponownie.'
    }
  ];

  // Gotowy do podłączenia: zwraca { ok: true } po udanej wysyłce.
  async function submitLead(payload) {
    if (!CONFIG.submitEndpoint) return { ok: false, demo: true };
    try {
      const res = await fetch(CONFIG.submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { ok: res.ok };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  /* --------------------------------------------------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const mqMobile = window.matchMedia('(max-width: 767px)');

  /* ---------- Dane z CONFIG -> strona ---------- */
  (function applyConfig() {
    const phoneDigits = CONFIG.phone.replace(/[^\d+]/g, '');
    const hrefs = {
      instagramUrl: CONFIG.instagramUrl,
      phoneHref: 'tel:' + phoneDigits,
      emailHref: 'mailto:' + CONFIG.email,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(CONFIG.addressLine1 + ', ' + CONFIG.addressLine2)
    };
    $$('[data-href]').forEach(el => { const v = hrefs[el.dataset.href]; if (v) el.setAttribute('href', v); });
    $$('[data-text]').forEach(el => { const v = CONFIG[el.dataset.text]; if (v) el.textContent = v; });
    const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  })();

  /* ---------- Blokada scrolla ---------- */
  let lockCount = 0, savedY = 0;
  function lockScroll() {
    if (lockCount++ > 0) return;
    savedY = window.scrollY;
    document.body.style.top = `-${savedY}px`;
    document.documentElement.classList.add('is-locked');
  }
  function unlockScroll() {
    if (lockCount === 0 || --lockCount > 0) return;
    const root = document.documentElement;
    root.classList.remove('is-locked');
    document.body.style.top = '';
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, savedY);
    root.style.scrollBehavior = '';
  }

  /* ---------- Overlay: menu / modal / lightbox ---------- */
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  const openStack = [];

  class Overlay {
    constructor(el, hooks = {}) {
      this.el = el;
      this.hooks = hooks;
      this.isOpen = false;
      this.opener = null;
      this.downOnBackdrop = false;

      el.addEventListener('pointerdown', e => { this.downOnBackdrop = e.target === el; });
      el.addEventListener('click', e => {
        if ((e.target === el && this.downOnBackdrop) || e.target.closest('[data-close]')) this.close();
        this.downOnBackdrop = false;
      });
    }
    open(trigger) {
      if (this.isOpen) return;
      this.isOpen = true;
      this.opener = trigger || document.activeElement;
      this.el.removeAttribute('inert');
      this.el.setAttribute('aria-hidden', 'false');
      lockScroll();
      this.el.classList.add('is-open');
      openStack.push(this);
      const target = $('[tabindex="-1"]', this.el) || this.el;
      target.focus({ preventScroll: true });
      if (this.hooks.onOpen) this.hooks.onOpen();
    }
    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.el.classList.remove('is-open');
      this.el.setAttribute('aria-hidden', 'true');
      this.el.setAttribute('inert', '');
      const i = openStack.indexOf(this); if (i > -1) openStack.splice(i, 1);
      unlockScroll();
      if (this.opener && document.contains(this.opener) && this.opener.focus) {
        try { this.opener.focus({ preventScroll: true }); } catch (_) { /* noop */ }
      }
      if (this.hooks.onClose) this.hooks.onClose();
    }
    trap(e) {
      const items = $$(FOCUSABLE, this.el).filter(n => n.getClientRects().length);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !this.el.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !this.el.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    }
  }

  document.addEventListener('keydown', e => {
    const top = openStack[openStack.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); top.close(); }
    else if (e.key === 'Tab') top.trap(e);
  });

  /* ---------- Header ---------- */
  const header = $('#header');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { header.classList.toggle('is-scrolled', window.scrollY > 20); ticking = false; });
  }, { passive: true });

  /* ---------- Menu mobilne ---------- */
  const menu = new Overlay($('#menu'), { onClose: () => burger.setAttribute('aria-expanded', 'false') });
  const burger = $('[data-menu-toggle]');
  burger.addEventListener('click', () => { menu.open(burger); burger.setAttribute('aria-expanded', 'true'); });
  window.matchMedia('(min-width: 960px)').addEventListener('change', e => { if (e.matches) menu.close(); });

  /* ---------- Modal rezerwacji ---------- */
  const booking = new Overlay($('#bookingModal'));
  $$('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', e => {
      // Na każdym urządzeniu otwieramy popup z formularzem (href="#rezerwacja" działa tylko bez JS).
      e.preventDefault();
      booking.open(btn);
    });
  });

  /* ---------- Stała knopka (mobile) ---------- */
  (function stickyCta() {
    const cta = $('#stickyCta');
    const hero = $('#top');
    const formSection = $('#rezerwacja');
    if (!cta || !hero || !('IntersectionObserver' in window)) return;
    const btn = $('button', cta);
    let heroGone = false, formVisible = false;

    const update = () => {
      const show = mqMobile.matches && heroGone && !formVisible;
      cta.classList.toggle('is-visible', show);
      cta.setAttribute('aria-hidden', String(!show));
      btn.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(([e]) => {
      heroGone = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; update(); }, { threshold: 0 }).observe(formSection);
    mqMobile.addEventListener('change', update);
  })();

  /* ---------- Animacje przy scrollu ---------- */
  (function reveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(i => io.observe(i));
  })();

  /* ---------- Lightbox ---------- */
  (function lightbox() {
    const root = $('#lightbox');
    const imgEl = $('.lightbox__img', root);
    const titleEl = $('.lightbox__title', root);
    const countEl = $('.lightbox__count', root);
    const triggers = $$('[data-lightbox]');
    if (!triggers.length) return;
    // Odczyt w chwili otwarcia, żeby zawsze brać aktualne zdjęcie.
    const read = () => triggers.map(t => {
      const img = $('img', t);
      return { src: img.currentSrc || img.src, alt: img.alt, w: img.naturalWidth || img.getAttribute('width'), h: img.naturalHeight || img.getAttribute('height') };
    });
    let items = read();
    let index = 0;

    const overlay = new Overlay(root);

    function show(i, animate = true) {
      index = (i + items.length) % items.length;
      const it = items[index];
      const apply = () => {
        imgEl.src = it.src; imgEl.alt = it.alt;
        if (it.w && it.h) { imgEl.width = it.w; imgEl.height = it.h; }
        titleEl.textContent = it.alt;
        countEl.textContent = `${index + 1} / ${items.length}`;
        imgEl.classList.remove('is-swapping');
      };
      if (animate && overlay.isOpen) { imgEl.classList.add('is-swapping'); setTimeout(apply, 180); } else apply();
      [index - 1, index + 1].forEach(n => { new Image().src = items[(n + items.length) % items.length].src; });
    }

    triggers.forEach((t, i) => t.addEventListener('click', () => { items = read(); show(i, false); overlay.open(t); }));
    $('[data-lb-prev]', root).addEventListener('click', () => show(index - 1));
    $('[data-lb-next]', root).addEventListener('click', () => show(index + 1));
    document.addEventListener('keydown', e => {
      if (!overlay.isOpen) return;
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    // Przesunięcie palcem
    let sx = 0, sy = 0;
    root.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    root.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  })();

  /* ---------- Opinie ---------- */
  (function reviews() {
    const section = $('#opinie');
    const track = $('#reviews');
    if (!section || !track) return;
    if (!REVIEWS.length) {
      section.hidden = true;
      $$('a[href="#opinie"]').forEach(a => { a.hidden = true; });
      return;
    }

    const SVG = 'http://www.w3.org/2000/svg';
    const makeStars = n => {
      const wrap = document.createElement('div');
      wrap.className = 'stars';
      wrap.setAttribute('role', 'img');
      wrap.setAttribute('aria-label', `Ocena ${n} na 5`);
      for (let i = 1; i <= 5; i++) {
        const s = document.createElementNS(SVG, 'svg');
        s.setAttribute('aria-hidden', 'true');
        if (i > n) s.classList.add('off');
        const u = document.createElementNS(SVG, 'use');
        u.setAttribute('href', '#i-star');
        s.appendChild(u);
        wrap.appendChild(s);
      }
      return wrap;
    };
    const initial = name => ((name || '').replace(/[^\p{L}]/gu, '')[0] || '★').toUpperCase();

    const modal = new Overlay($('#reviewModal'));
    const mStars = $('#rvStars'), mText = $('#rvText'), mName = $('#rvName'), mMeta = $('#rvMeta'), mAvatar = $('#rvAvatar');

    REVIEWS.forEach((r, idx) => {
      const tone = r.tone || (idx % 4) + 1;
      const rating = Math.max(1, Math.min(5, Number(r.rating) || 5));
      const li = document.createElement('li');
      li.className = 'review';

      const text = document.createElement('p');
      text.className = 'review__text';
      text.textContent = r.text;

      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'review__more';
      more.hidden = true;
      more.textContent = 'Czytaj całość';
      more.addEventListener('click', () => {
        mStars.replaceChildren(makeStars(rating));
        mText.textContent = r.text;
        mName.textContent = r.name;
        mMeta.textContent = r.service || '';
        mAvatar.textContent = initial(r.name);
        mAvatar.dataset.tone = String(tone);
        modal.open(more);
      });

      const author = document.createElement('div');
      author.className = 'review__author';
      const avatar = document.createElement('span');
      avatar.className = 'review__avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = initial(r.name);
      avatar.dataset.tone = String(tone);
      const who = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = r.name;
      who.appendChild(strong);
      if (r.service) {
        const small = document.createElement('small');
        small.textContent = r.service;
        who.appendChild(small);
      }
      author.append(avatar, who);

      li.append(makeStars(rating), text, more, author);
      track.appendChild(li);
    });

    // Przycisk „Czytaj całość” tylko tam, gdzie tekst jest faktycznie skrócony
    const refreshClamp = () => {
      $$('.review', track).forEach(li => {
        const t = $('.review__text', li);
        $('.review__more', li).hidden = !(t.scrollHeight > t.clientHeight + 1);
      });
    };
    refreshClamp();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshClamp);
    window.addEventListener('load', refreshClamp);
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(refreshClamp, 150); });

    // Strzałki slidera
    const prev = $('[data-rv-prev]'), next = $('[data-rv-next]');
    const step = () => { const c = $('.review', track); return c ? c.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 16) : 300; };
    const updateNav = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    updateNav();
  })();

  /* ---------- Formularze: walidacja ---------- */
  const MSG = {
    nameEmpty: 'Podaj swoje imię.',
    nameShort: 'Imię powinno mieć co najmniej 2 litery.',
    nameChars: 'Imię może zawierać tylko litery, spacje i myślnik.',
    phoneEmpty: 'Podaj numer telefonu.',
    phoneBad: 'Podaj poprawny numer, np. 500 123 456 lub +48 500 123 456.',
    sending: 'Wysyłanie…',
    success: 'Dziękuję! Zgłoszenie zostało wysłane. Odezwę się wkrótce.',
    fail: 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub napisz do mnie na Instagramie.',
    demo: 'Tryb demonstracyjny: formularz nie jest jeszcze połączony z serwerem, więc zgłoszenie NIE zostało wysłane. Napisz do mnie na Instagramie.'
  };

  function validateName(raw) {
    const v = raw.trim().replace(/\s+/g, ' ');
    if (!v) return MSG.nameEmpty;
    if (!/^[\p{L}\p{M}' .’-]+$/u.test(v)) return MSG.nameChars;
    if ((v.match(/\p{L}/gu) || []).length < 2) return MSG.nameShort;
    return '';
  }
  function validatePhone(raw) {
    let v = raw.trim();
    if (!v) return MSG.phoneEmpty;
    v = v.replace(/[\s().-]/g, '');
    if (v.startsWith('00')) v = '+' + v.slice(2);
    // Krajowy (9 cyfr) lub międzynarodowy (+ i 9–15 cyfr)
    if (/^\d{9}$/.test(v) || /^\+\d{9,15}$/.test(v)) return '';
    return MSG.phoneBad;
  }
  function normalizePhone(raw) {
    let v = raw.trim().replace(/[\s().-]/g, '');
    if (v.startsWith('00')) v = '+' + v.slice(2);
    return /^\d{9}$/.test(v) ? '+48' + v : v;
  }

  function setError(input, msg) {
    const field = input.closest('.field');
    const out = $('.field__error', field);
    out.textContent = msg;
    field.classList.toggle('has-error', !!msg);
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return !msg;
  }

  function setStatus(form, type, text) {
    const s = $('.form__status', form);
    if (!text) { s.textContent = ''; s.removeAttribute('data-type'); return; }
    s.textContent = text; s.dataset.type = type;
  }

  function initForm(form) {
    const nameInput = form.elements.name;
    const phoneInput = form.elements.phone;
    const submitBtn = $('button[type="submit"]', form);
    const label = $('.btn__label', submitBtn);
    const labelText = label.textContent;
    const checks = [[nameInput, validateName], [phoneInput, validatePhone]];

    checks.forEach(([input, fn]) => {
      input.addEventListener('blur', () => { if (input.value.trim() || input.closest('.field').classList.contains('has-error')) setError(input, fn(input.value)); });
      input.addEventListener('input', () => {
        setStatus(form, '', '');
        if (input.closest('.field').classList.contains('has-error')) setError(input, fn(input.value));
      });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.elements.website && form.elements.website.value) return; // honeypot (boty)
      setStatus(form, '', '');

      let firstBad = null;
      checks.forEach(([input, fn]) => { if (!setError(input, fn(input.value)) && !firstBad) firstBad = input; });
      if (firstBad) { firstBad.focus(); return; }

      const payload = {
        name: nameInput.value.trim().replace(/\s+/g, ' '),
        phone: normalizePhone(phoneInput.value),
        source: form.dataset.leadForm,
        page: location.href,
        sentAt: new Date().toISOString()
      };

      submitBtn.disabled = true; label.textContent = MSG.sending;
      const result = await submitLead(payload);
      submitBtn.disabled = false; label.textContent = labelText;

      if (result.ok) {
        setStatus(form, 'success', MSG.success);
        form.reset();
      } else if (result.demo) {
        console.info('[Komalashes] Tryb demo — dane NIE zostały wysłane:', payload);
        setStatus(form, 'info', MSG.demo);
      } else {
        setStatus(form, 'error', MSG.fail);
      }
    });
  }
  $$('[data-lead-form]').forEach(initForm);
})();
