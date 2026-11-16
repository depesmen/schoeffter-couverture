/* Consentement cookies + Google Analytics (via Google Tag Manager)
   Google n'est chargé qu'après un clic sur "Accepter".
   Sans choix ou en cas de refus : aucun script Google, aucun cookie. */
(function () {
  var GTM_ID = 'GTM-WDBGSDMD';
  var KEY = 'schoeffter-consentement';
  var VALIDITE = 1000 * 60 * 60 * 24 * 182; // le choix est redemandé après 6 mois

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });

  var charge = false;
  function chargerGoogle() {
    if (charge) return;
    charge = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('set', { cookie_expires: 34128000 }); // 13 mois maximum (CNIL)
    gtag('js', new Date());
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }

  function lire() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && (Date.now() - v.t) < VALIDITE) return v.choix;
    } catch (e) {}
    return null;
  }
  function enregistrer(choix) {
    try { localStorage.setItem(KEY, JSON.stringify({ choix: choix, t: Date.now() })); } catch (e) {}
  }
  function supprimerCookiesGa() {
    document.cookie.split(';').forEach(function (c) {
      var nom = c.split('=')[0].trim();
      if (/^_ga/.test(nom)) {
        ['', location.hostname, '.' + location.hostname.replace(/^www\./, '')].forEach(function (d) {
          document.cookie = nom + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  /* ---------- Bandeau ---------- */
  var css = ''
    + '.cc-banner{position:fixed;left:16px;bottom:16px;z-index:9999;max-width:440px;background:#fff;color:#333;'
    + 'border:1px solid #e8e2d8;border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.18);padding:20px 20px 18px;'
    + 'font-family:Archivo,Helvetica,Arial,sans-serif;font-size:14.5px;line-height:1.55}'
    + '.cc-banner h2{margin:0 0 6px;font-size:16px;font-weight:800;color:#333;letter-spacing:-.01em}'
    + '.cc-banner p{margin:0 0 14px;color:#5a5a5a}'
    + '.cc-banner a{color:#2A46E0;font-weight:700}'
    + '.cc-actions{display:flex;gap:10px}'
    + '.cc-btn{flex:1;font:inherit;font-weight:800;font-size:15px;padding:12px 14px;border-radius:10px;cursor:pointer;border:2px solid #2A46E0}'
    + '.cc-refuse{background:#fff;color:#2A46E0}.cc-refuse:hover{background:#eef1fd}'
    + '.cc-accept{background:#2A46E0;color:#fff}.cc-accept:hover{background:#1c33ad;border-color:#1c33ad}'
    + '.cc-btn:focus-visible{outline:3px solid #333;outline-offset:2px}'
    + '@media (max-width:600px){.cc-banner{left:10px;right:10px;bottom:10px;max-width:none;padding:16px}}';

  var banniere = null;
  function afficherBandeau() {
    if (banniere) return;
    if (!document.getElementById('cc-style')) {
      var st = document.createElement('style');
      st.id = 'cc-style'; st.textContent = css; document.head.appendChild(st);
    }
    banniere = document.createElement('div');
    banniere.className = 'cc-banner';
    banniere.setAttribute('role', 'dialog');
    banniere.setAttribute('aria-labelledby', 'cc-titre');
    banniere.setAttribute('aria-describedby', 'cc-texte');
    banniere.innerHTML = ''
      + '<h2 id="cc-titre">Mesure d\'audience</h2>'
      + '<p id="cc-texte">Avec votre accord, nous utilisons Google Analytics pour savoir combien de personnes visitent le site '
      + 'et quelles pages les intéressent. Aucune publicité, aucune revente de données. '
      + '<a href="/politique-de-confidentialite#cookies">En savoir plus</a></p>'
      + '<div class="cc-actions">'
      + '<button type="button" class="cc-btn cc-refuse">Refuser</button>'
      + '<button type="button" class="cc-btn cc-accept">Accepter</button>'
      + '</div>';
    document.body.appendChild(banniere);
    banniere.querySelector('.cc-accept').addEventListener('click', function () { choisir('accepte'); });
    banniere.querySelector('.cc-refuse').addEventListener('click', function () { choisir('refuse'); });
  }
  function fermerBandeau() {
    if (!banniere) return;
    banniere.remove(); banniere = null;
  }
  function choisir(choix) {
    var avant = lire();
    enregistrer(choix);
    fermerBandeau();
    if (choix === 'accepte') { chargerGoogle(); return; }
    gtag('consent', 'update', { analytics_storage: 'denied' });
    supprimerCookiesGa();
    if (charge || avant === 'accepte') location.reload(); // décharge Google si l'accord est retiré
  }

  /* ---------- Suivi des conversions (uniquement si accepté) ---------- */
  window.schoeffterSuivi = function (evenement, params) {
    if (!charge) return;
    gtag('event', evenement, params || {});
    window.dataLayer.push(Object.assign({ event: evenement }, params || {}));
  };
  document.addEventListener('click', function (e) {
    var lien = e.target.closest && e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
    if (lien) {
      var tel = lien.getAttribute('href').indexOf('tel:') === 0;
      window.schoeffterSuivi(tel ? 'clic_telephone' : 'clic_email', { emplacement: location.pathname });
    }
    var reglages = e.target.closest && e.target.closest('[data-cookies]');
    if (reglages) { e.preventDefault(); afficherBandeau(); }
  });

  /* ---------- Démarrage ---------- */
  function demarrer() {
    var choix = lire();
    if (choix === 'accepte') chargerGoogle();
    else if (choix === null) afficherBandeau();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
