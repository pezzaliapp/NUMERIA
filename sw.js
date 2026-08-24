/* Numeria — service worker con aggiornamento automatico.
   Strategia:
   - File dell'app (HTML, JS, manifest): NETWORK-FIRST.
     Ogni apertura scarica la versione più recente dal server e la
     salva in cache; la cache serve solo da riserva quando si è offline.
   - Risorse statiche (icone, font): CACHE-FIRST, perché non cambiano.
   Così ogni push sulla repo arriva agli utenti alla prima riapertura,
   senza dover rinominare la cache a mano. */

const CACHE = "numeria-auto";

const APP_SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

/* file che devono sempre cercare prima la rete */
const SEMPRE_FRESCHI = /(\.html?$|\.js$|\.webmanifest$|\/$)/;

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(APP_SHELL))
      .then(() => self.skipWaiting())      // la nuova versione entra subito
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(chiavi => Promise.all(chiavi.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())    // prende il controllo delle schede aperte
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const eNavigazione = e.request.mode === "navigate";
  const vuoleFresco = eNavigazione || (url.origin === location.origin && SEMPRE_FRESCHI.test(url.pathname));

  if (vuoleFresco) {
    /* rete prima: versione aggiornata quando c'è connessione,
       cache come rete di sicurezza offline */
    e.respondWith(
      fetch(e.request, { cache: "no-store" })
        .then(risp => {
          const copia = risp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
          return risp;
        })
        .catch(() =>
          caches.match(e.request).then(hit => hit || caches.match("./index.html"))
        )
    );
  } else {
    /* cache prima per icone, font e risorse esterne */
    e.respondWith(
      caches.match(e.request).then(hit => {
        if (hit) return hit;
        return fetch(e.request).then(risp => {
          const copia = risp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
          return risp;
        }).catch(() => hit);
      })
    );
  }
});

/* consente alla pagina di forzare l'attivazione immediata */
self.addEventListener("message", e => {
  if (e.data === "attiva-subito") self.skipWaiting();
});
