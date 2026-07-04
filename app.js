/* ============================================================
   NUMERIA — motore numerologico (sistema pitagorico)
   Tutti i testi interpretativi sono originali e volutamente
   sintetici: spunti di riflessione, non verità assolute.
   ============================================================ */
"use strict";

/* ---------- utilità numeriche ---------- */
const sommaCifre = n => String(n).split("").reduce((a, c) => a + (+c || 0), 0);

function riduci(n) {                 // riduzione semplice a una cifra
  while (n > 9) n = sommaCifre(n);
  return n;
}
function riduciTieni(n, tieni) {     // riduce ma conserva i valori indicati
  while (n > 9 && !tieni.includes(n)) n = sommaCifre(n);
  return n;
}

/* ---------- Numero del Destino (dalla data completa) ----------
   Somma di tutte le cifre di giorno, mese e anno.
   Totale 22  -> resta 22/4 (numero maestro doppio).
   Riduzione che arriva a 11 -> resta 11.
   Riduzione che arriva a 1  -> diventa 10 (l'1 puro non esiste
   in questo sistema: totali 19, 28, 37, 46 danno 10).            */
function numeroDestino(g, m, a) {
  const totale = sommaCifre(g) + sommaCifre(m) + sommaCifre(a);
  if (totale === 22) return { chiave: "22/4", valore: 4, totale };
  let n = totale;
  while (n > 9 && n !== 11) n = sommaCifre(n);
  if (n === 11) return { chiave: "11", valore: 11, totale };
  if (n === 1)  return { chiave: "10", valore: 10, totale };
  return { chiave: String(n), valore: n, totale };
}

/* ---------- Numero del Giorno ---------- */
function numeroGiorno(g) {
  if (g === 22) return "22/4";
  if (g === 11 || g === 29) return "11";
  if (g === 10 || g === 19 || g === 28) return "10";
  return String(riduci(g));
}

/* ---------- Griglia della Nascita ----------
   Disposizione (righe = piani):
     3 6 9   Piano mentale
     2 5 8   Piano dell'anima
     1 4 7   Piano fisico
   Si contano le occorrenze delle cifre 1-9 nella data;
   gli zeri non occupano caselle.                                  */
function grigliaNascita(g, m, a) {
  const conti = Array(10).fill(0);
  (String(g) + String(m) + String(a)).split("").forEach(c => { if (+c > 0) conti[+c]++; });
  return conti;
}

/* ---------- Frecce ----------
   Linea completa (tutte e tre le cifre presenti) = tratto di forza.
   Linea del tutto vuota = tratto da coltivare.                    */
const LINEE = [
  { cifre: [1, 2, 3], piena: "Freccia del Pianificatore",     vuota: null },
  { cifre: [4, 5, 6], piena: "Freccia della Volontà",         vuota: "Freccia della Frustrazione" },
  { cifre: [7, 8, 9], piena: "Freccia dell'Azione",           vuota: "Freccia della Passività" },
  { cifre: [3, 6, 9], piena: "Freccia dell'Intelletto",       vuota: "Freccia della Scarsa Memoria" },
  { cifre: [2, 5, 8], piena: "Freccia dell'Equilibrio Emotivo", vuota: "Freccia dell'Ipersensibilità" },
  { cifre: [1, 4, 7], piena: "Freccia del Senso Pratico",     vuota: "Freccia del Disordine" },
  { cifre: [1, 5, 9], piena: "Freccia della Determinazione",  vuota: "Freccia della Procrastinazione" },
  { cifre: [3, 5, 7], piena: "Freccia della Spiritualità",    vuota: "Freccia dell'Indagine" },
];

const TESTI_FRECCE = {
  "Freccia del Pianificatore": "Talento naturale per ordinare idee e progetti: la mente vede il percorso prima ancora di partire. Attenzione a non perdersi nel piano e dimenticare i dettagli pratici dell'esecuzione.",
  "Freccia della Volontà": "Una spina dorsale interiore: tenacia, costanza e capacità di reggere la pressione. Il rischio è la testardaggine, che va distinta dalla vera determinazione.",
  "Freccia dell'Azione": "Energia che chiede di essere messa in movimento: chi la possiede vive facendo. Serve equilibrio, perché l'iperattività può consumare corpo e nervi.",
  "Freccia dell'Intelletto": "Memoria vivace, pensiero lucido, gusto per l'analisi. Il lato in ombra può essere una certa impazienza verso chi ragiona più lentamente.",
  "Freccia dell'Equilibrio Emotivo": "Sensibilità ben temperata: emozioni profonde vissute senza esserne travolti. Una risorsa preziosa nelle relazioni e nei momenti di crisi.",
  "Freccia del Senso Pratico": "Manualità, concretezza, amore per ciò che si può toccare e costruire. Occorre solo evitare che il materiale metta in ombra il resto.",
  "Freccia della Determinazione": "Perseveranza fuori dal comune, soprattutto davanti agli ostacoli. Va dosata: la stessa forza può trasformarsi in ostinazione.",
  "Freccia della Spiritualità": "Una quiete interiore che dà fiducia nella vita e scarsa dipendenza dal giudizio altrui. A volte, però, rende restii ad accettare consigli.",
  "Freccia della Frustrazione": "Le aspettative — proprie e altrui — pesano più del dovuto: delusioni e distacchi vanno accolti come maestri, non come sconfitte.",
  "Freccia della Passività": "L'inerzia è la tentazione: la motivazione va costruita a piccoli passi, celebrando ogni traguardo raggiunto.",
  "Freccia della Scarsa Memoria": "Non indica mancanza d'intelligenza: la mente va semplicemente allenata con curiosità, letture e stimoli, soprattutto negli anni maturi.",
  "Freccia dell'Ipersensibilità": "Sensibilità a fior di pelle e bisogno profondo di sentirsi accettati. Imparare a non prendere tutto sul personale è la vera palestra.",
  "Freccia del Disordine": "L'ordine esteriore e interiore non è innato: si conquista con abitudini semplici e con esperienze pratiche che diano struttura.",
  "Freccia della Procrastinazione": "Il rimandare nasce spesso dall'attesa del momento perfetto. Decidere in piccolo, subito, è l'antidoto migliore.",
  "Freccia dell'Indagine": "Nulla viene accettato senza prove: uno spirito critico prezioso, purché lo scetticismo non chiuda la porta alla meraviglia.",
};

function frecce(conti) {
  const piene = [], vuote = [];
  LINEE.forEach(l => {
    const presenti = l.cifre.filter(c => conti[c] > 0).length;
    if (presenti === 3 && l.piena) piene.push({ nome: l.piena, cifre: l.cifre });
    if (presenti === 0 && l.vuota) vuote.push({ nome: l.vuota, cifre: l.cifre });
  });
  return { piene, vuote };
}

/* ---------- Piramidi e Picchi ----------
   Base: mese, giorno e anno ridotti a una cifra (in quest'ordine).
   Picco 1 = mese + giorno (ridotto)
   Picco 2 = giorno + anno (ridotto)
   Picco 3 = picco 1 + picco 2 (10 e 11 restano tali)
   Picco 4 = mese + anno (10 e 11 restano tali)
   Età al primo picco = 36 − Numero del Destino (per 22/4 si usa 4);
   i picchi successivi arrivano ogni 9 anni.                        */
function piramidi(g, m, a, destino) {
  const mB = riduci(m), gB = riduci(g), aB = riduci(sommaCifre(a));
  const p1 = riduci(mB + gB);
  const p2 = riduci(gB + aB);
  const p3 = riduciTieni(p1 + p2, [10, 11]);
  const p4 = riduciTieni(mB + aB, [10, 11]);
  const etaPrimo = 36 - destino.valore;
  const picchi = [p1, p2, p3, p4].map((n, i) => ({
    valore: n,
    chiave: String(n),
    eta: etaPrimo + i * 9,
    anno: a + etaPrimo + i * 9,
  }));
  return { base: [mB, gB, aB], picchi, etaPrimo };
}

/* ---------- Anni Personali ----------
   Anno Universale = somma delle cifre dell'anno di calendario,
   ridotta (il totale 22 si annota come 22/4 ma vale 4 nel calcolo).
   Anno Personale = Anno Universale + cifre di giorno e mese di
   nascita, il tutto ridotto a una cifra (1-9).                     */
function annoUniversale(anno) {
  const t = sommaCifre(anno);
  return { valore: riduci(t), maestro: t === 22 };
}
function annoPersonale(g, m, anno) {
  const au = annoUniversale(anno);
  return riduci(au.valore + sommaCifre(g) + sommaCifre(m));
}

/* ---------- Numeri del nome ----------
   Tabella pitagorica: A=1 … I=9, J=1 … R=9, S=1 … Z=8.
   Vocali  -> Numero dell'Anima (il mondo interiore)
   Consonanti -> Numero della Persona (l'immagine esteriore)
   Totale -> Numero dell'Espressione                               */
const VALORE_LETTERA = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((l, i) => VALORE_LETTERA[l] = (i % 9) + 1);
const VOCALI = new Set(["A", "E", "I", "O", "U"]);

function normalizzaNome(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
}
function numeriNome(nomeGrezzo) {
  const nome = normalizzaNome(nomeGrezzo);
  if (!nome) return null;
  let anima = 0, persona = 0;
  const lettere = nome.split("").map(l => {
    const v = VALORE_LETTERA[l], voc = VOCALI.has(l);
    if (voc) anima += v; else persona += v;
    return { l, v, voc };
  });
  const rid = n => riduciTieni(n, [11, 22]);
  return {
    lettere,
    anima: rid(anima), animaTot: anima,
    persona: rid(persona), personaTot: persona,
    espressione: rid(anima + persona), espressioneTot: anima + persona,
  };
}

/* ============================================================
   TESTI INTERPRETATIVI (originali, brevi)
   ============================================================ */
const TESTI_DESTINO = {
  "2": "Sensibilità e intuito guidano il percorso: il 2 lavora al meglio come sostegno, mediatore e collante dei gruppi. La sfida è credere nel proprio valore senza cercare conferme continue.",
  "3": "La mente è il regno del 3: umorismo, parola pronta, pensiero brillante. La crescita passa dall'usare l'intelletto per creare, non per criticare.",
  "4": "Concretezza, metodo, amore per il lavoro ben fatto. Il 4 costruisce, letteralmente e simbolicamente; deve solo ricordarsi di alzare ogni tanto lo sguardo dal cantiere.",
  "5": "Cuore del piano dei sentimenti, il 5 vive di libertà ed esperienze. Il compito è trasformare l'irrequietezza in curiosità che nutre, non che disperde.",
  "6": "Creatività e cura degli altri, con la casa e gli affetti al centro. L'insidia è l'ansia per chi si ama: la protezione non deve diventare controllo.",
  "7": "Il numero delle lezioni di vita: il 7 impara soprattutto dall'esperienza diretta, spesso attraverso prove, e diventa un maestro naturale per gli altri.",
  "8": "Indipendenza e affidabilità: l'8 sa amministrare, dirigere, dare sicurezza. La sua evoluzione sta nell'esprimere anche i sentimenti, non solo la competenza.",
  "9": "Idealismo, ambizione, senso di responsabilità verso qualcosa di più grande. Il 9 ispira gli altri, purché accetti che l'umanità reale è imperfetta.",
  "10": "Versatilità e carisma: il 10 sa adattarsi quasi a tutto e piace con naturalezza. Deve scegliere una direzione, altrimenti la facilità diventa dispersione.",
  "11": "Il più spirituale dei numeri: sensibilità elevata, ideali alti, forte senso etico. Vive bene quando mette questa profondità al servizio degli altri.",
  "22/4": "Numero maestro: la visione dell'11 unita alla concretezza del 4. Un potenziale fuori misura che chiede maturità, altrimenti si ripiega sul solo lato pratico.",
};

const TESTI_GIORNO = {
  "1": "Spirito d'iniziativa e bisogno di autonomia: si rende al meglio lavorando a modo proprio.",
  "2": "Intuito spiccato e piacere della collaborazione, con un debole per la leggerezza e l'umorismo.",
  "3": "Vivacità mentale e gusto per l'espressione: idee, parole e immaginazione in primo piano.",
  "4": "Praticità e precisione: il dettaglio ben curato è una firma personale.",
  "5": "Sentimento e desiderio di libertà: la routine stretta non fa per questo altro io.",
  "6": "Cura, creatività domestica e senso di responsabilità verso le persone vicine.",
  "7": "Bisogno di capire in prima persona: l'esperienza vale più di mille spiegazioni.",
  "8": "Senso pratico negli affari e una certa riservatezza nell'esprimere ciò che si prova.",
  "9": "Slancio ideale e serietà: si tende a prendere a cuore le cause in cui si crede.",
  "10": "Adattabilità e simpatia naturale: si entra facilmente in sintonia con ambienti diversi.",
  "11": "Sensibilità fine e attrazione per la dimensione interiore delle cose.",
  "22/4": "Visione ampia unita a mani capaci: quando maturo, questo altro io sa realizzare progetti importanti.",
};

const TESTI_CIFRE = {
  1: ["Un solo 1: l'espressione di sé è ancora in via di sviluppo; parlare dei propri sentimenti richiede un piccolo sforzo in più.",
      "Due 1: equilibrio raro nell'esprimersi — si sa raccontare ciò che si vive con naturalezza.",
      "Tre 1: la parola abbonda, il rischio è la loquacità o, al contrario, chiusure improvvise.",
      "Quattro o più 1: un ego intenso da governare — l'espressione oscilla tra troppo e troppo poco."],
  2: ["Un 2: intuito e sensibilità presenti e ben integrati, una dote silenziosa.",
      "Due 2: intuizione forte e capacità di percepire gli altri con finezza.",
      "Tre 2: la sensibilità tende a esondare — servono confini emotivi chiari.",
      "Quattro o più 2: percezione acutissima ma facile a ferirsi; la pazienza verso se stessi è essenziale."],
  3: ["Un 3: memoria affidabile e mente sveglia.",
      "Due 3: immaginazione viva, gusto per la scrittura e le idee.",
      "Tre 3: la fantasia può staccarsi dalla realtà — ancorarla a progetti concreti aiuta.",
      "Quattro o più 3: mente iperattiva: la calma va coltivata come una disciplina."],
  4: ["Un 4: praticità, ordine, amore per ciò che funziona.",
      "Due 4: grande abilità con le mani e con l'organizzazione materiale.",
      "Tre 4: il lavoro fisico e i dettagli rischiano di assorbire tutto lo spazio.",
      "Quattro o più 4: la materia domina — serve alleggerire e delegare."],
  5: ["Un 5: cuore vivo e desiderio di libertà ben bilanciati.",
      "Due 5: sentimenti intensi e bisogno di movimento; la costanza è la sfida.",
      "Tre 5: emozioni forti e impulsività da incanalare.",
      "Quattro o più 5: la libertà diventa urgenza: le radici, però, non sono catene."],
  6: ["Un 6: creatività e attaccamento alla casa e agli affetti.",
      "Due 6: la cura degli altri può scivolare nell'apprensione.",
      "Tre 6: l'ansia protettiva chiede di essere trasformata in fiducia.",
      "Quattro o più 6: creatività potente ma preoccupazione costante: respiro e prospettiva."],
  7: ["Un 7: si impara attraverso l'esperienza diretta, a volte attraverso qualche perdita.",
      "Due 7: le prove della vita forgiano una saggezza concreta e profonda.",
      "Tre 7: lezioni ripetute e intense; la resilienza è il dono nascosto.",
      "Quattro o più 7: un percorso esigente che può fare di questa persona una guida per altri."],
  8: ["Un 8: ordine, metodo e senso del dovere.",
      "Due 8: precisione e affidabilità notevoli, con una vena di inquietudine.",
      "Tre 8: il bisogno di controllo va ammorbidito con fiducia.",
      "Quattro o più 8: energia organizzativa enorme, da non trasformare in rigidità."],
  9: ["Un 9: idealismo e senso di responsabilità.",
      "Due 9: ambizione e giudizio acuto — attenzione alla severità verso gli altri.",
      "Tre 9: gli ideali diventano fuoco: servono sbocchi concreti.",
      "Quattro o più 9: un'intensità idealista che chiede pazienza e gentilezza verso il mondo reale."],
};

const TESTI_PICCHI = {
  "1": "Un ciclo che premia l'iniziativa personale: si semina in prima persona.",
  "2": "Fase di collaborazione e vita interiore: contano le relazioni e l'intuito.",
  "3": "Anni mentali e creativi: studio, scrittura, idee che prendono forma.",
  "4": "Periodo di costruzione paziente: lavoro, ordine, fondamenta solide.",
  "5": "Fase di libertà ed espansione emotiva: viaggi, cambiamenti, nuove esperienze.",
  "6": "Il baricentro si sposta su casa, famiglia e creatività: cura di ciò che si ama.",
  "7": "Ciclo di apprendimento profondo, spesso attraverso prove: si condivide ciò che si è capito.",
  "8": "Anni di indipendenza e consolidamento materiale: si raccoglie ciò che si amministra bene.",
  "9": "Periodo di responsabilità ampie e ideali: si è chiamati a servire qualcosa di più grande.",
  "10": "Fase di adattabilità e fortuna mutevole: la flessibilità è la chiave.",
  "11": "Ciclo ad alta intensità spirituale: ispirazione, etica, profondità.",
};

const TESTI_ANNO_PERSONALE = {
  1: "Anno di nuovi inizi: si pianta il seme del ciclo che verrà. Ottimo per avviare, meno per raccogliere.",
  2: "Anno di sviluppo silenzioso: relazioni, pazienza, intuito. Le cose crescono sotto la superficie.",
  3: "Anno mentale e sociale: idee, studio, contatti. La mente è particolarmente lucida.",
  4: "Anno di consolidamento: organizzare, sistemare, rafforzare. Non forzare grandi svolte.",
  5: "Anno di libertà ed emozioni: cambiamenti, viaggi, nuove esperienze del cuore.",
  6: "Anno della casa e della creatività: famiglia, affetti e progetti creativi in primo piano — un picco minore del ciclo.",
  7: "Anno di interiorizzazione: bilanci, studio, salute. Un rallentamento fisiologico, non un anno negativo.",
  8: "Anno di autonomia e questioni materiali: finanze, carriera, indipendenza si muovono.",
  9: "Il picco del ciclo: un anno di cambiamento e chiusure che aprono. Ciò che finisce fa spazio.",
};

/* ============================================================
   RENDERING
   ============================================================ */
const $ = sel => document.querySelector(sel);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* posizioni delle cifre nella griglia 3x3 (righe: 3-6-9 / 2-5-8 / 1-4-7) */
const POSIZIONI = { 3:[0,0],6:[1,0],9:[2,0], 2:[0,1],5:[1,1],8:[2,1], 1:[0,2],4:[1,2],7:[2,2] };

function svgGriglia(conti, fr) {
  const S = 320, M = 46, cella = (S - 2 * M) / 3;
  const cx = (col) => M + cella * col + cella / 2;
  const cy = (rig) => M + cella * rig + cella / 2;
  let out = `<svg class="griglia-svg" viewBox="0 0 ${S} ${S}" role="img" aria-label="Griglia della nascita">`;
  // linee della griglia (tris)
  for (let i = 1; i <= 2; i++) {
    const p = M + cella * i;
    out += `<line class="filo-griglia" x1="${p}" y1="${M-8}" x2="${p}" y2="${S-M+8}"/>`;
    out += `<line class="filo-griglia" x1="${M-8}" y1="${p}" x2="${S-M+8}" y2="${p}"/>`;
  }
  // frecce piene (linee luminose) e vuote (tratteggiate)
  const linea = (cifre, cls, delay) => {
    const [a,,c] = cifre;
    const [ca, ra] = POSIZIONI[a], [cc, rc] = POSIZIONI[c];
    return `<line class="${cls}" style="animation-delay:${delay}s" x1="${cx(ca)}" y1="${cy(ra)}" x2="${cx(cc)}" y2="${cy(rc)}"/>`;
  };
  fr.vuote.forEach(f => out += linea(f.cifre, "freccia-vuota", 0));
  fr.piene.forEach((f, i) => out += linea(f.cifre, "freccia-linea", .3 + i * .35));
  // numeri
  for (let n = 1; n <= 9; n++) {
    const [col, rig] = POSIZIONI[n];
    const q = conti[n];
    const testo = q > 0 ? String(n).repeat(Math.min(q, 4)) : String(n);
    const size = q > 0 ? (q >= 3 ? 20 : q === 2 ? 26 : 32) : 26;
    out += `<text x="${cx(col)}" y="${cy(rig)}" text-anchor="middle" dominant-baseline="central" font-size="${size}" class="${q ? "" : "vuoto"}">${testo}</text>`;
  }
  // etichette dei piani
  const piani = ["Mente", "Anima", "Corpo"];
  piani.forEach((p, i) => out += `<text class="piano" x="${S-4}" y="${cy(i)}" text-anchor="end" dominant-baseline="central" font-size="9" transform="rotate(90 ${S-10} ${cy(i)})">${p}</text>`);
  return out + "</svg>";
}

function svgPiramidi(pir, annoNascita) {
  const W = 640, H = 300, baseY = 236;
  const bx = [140, 320, 500];                       // basi: mese, giorno, anno
  const apice = (x1, x2, h) => [ (x1 + x2) / 2, baseY - h ];
  const [a1x, a1y] = apice(bx[0], bx[1], 96);
  const [a2x, a2y] = apice(bx[1], bx[2], 96);
  const [a3x, a3y] = [(a1x + a2x) / 2, baseY - 176];
  const [a4x, a4y] = [(bx[0] + bx[2]) / 2, baseY - 226];
  const p = pir.picchi;
  let s = `<svg class="piramide-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Schema delle quattro piramidi">`;
  s += `<path class="lato" d="M ${bx[0]} ${baseY} L ${a1x} ${a1y} L ${bx[1]} ${baseY}"/>`;
  s += `<path class="lato" d="M ${bx[1]} ${baseY} L ${a2x} ${a2y} L ${bx[2]} ${baseY}"/>`;
  s += `<path class="lato" d="M ${a1x} ${a1y} L ${a3x} ${a3y} L ${a2x} ${a2y}"/>`;
  s += `<path class="lato esterna" d="M ${bx[0]} ${baseY} L ${a4x} ${a4y} L ${bx[2]} ${baseY}"/>`;
  // numeri base
  const etBase = ["mese", "giorno", "anno"];
  pir.base.forEach((n, i) => {
    s += `<text x="${bx[i]}" y="${baseY + 26}" text-anchor="middle" font-size="26">${n}</text>`;
    s += `<text class="eta" x="${bx[i]}" y="${baseY + 46}" text-anchor="middle" font-size="11">${etBase[i]}</text>`;
  });
  // picchi con età e anno
  const pos = [[a1x, a1y], [a2x, a2y], [a3x, a3y], [a4x, a4y]];
  pos.forEach(([x, y], i) => {
    s += `<text class="picco-n" x="${x}" y="${y - 8}" text-anchor="middle" font-size="26">${p[i].chiave}</text>`;
    s += `<text class="eta" x="${x}" y="${y - 34}" text-anchor="middle" font-size="12">${p[i].eta} anni · ${p[i].anno}</text>`;
  });
  return s + "</svg>";
}

function svgCiclo(g, m, annoCorrente) {
  const anni = [];
  for (let i = -4; i <= 4; i++) anni.push(annoCorrente + i);
  const W = 640, H = 190, pad = 40;
  const px = i => pad + (W - 2 * pad) * i / (anni.length - 1);
  const py = np => H - 34 - (np - 1) * (H - 88) / 8;
  const punti = anni.map((a, i) => ({ a, np: annoPersonale(g, m, a), x: px(i) }));
  let d = "";
  punti.forEach((p, i) => { d += (i ? " L " : "M ") + p.x + " " + py(p.np); });
  let s = `<svg class="ciclo-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Ciclo degli anni personali">`;
  s += `<path class="onda" d="${d}"/>`;
  punti.forEach(p => {
    const corrente = p.a === annoCorrente;
    s += `<circle class="punto${corrente ? " corrente" : ""}" cx="${p.x}" cy="${py(p.np)}" r="${corrente ? 8 : 5}"/>`;
    s += `<text class="np" x="${p.x}" y="${py(p.np) - 12}" text-anchor="middle" font-size="15">${p.np}</text>`;
    s += `<text x="${p.x}" y="${H - 8}" text-anchor="middle" font-size="11"${corrente ? ' fill="#e2c479"' : ""}>${p.a}</text>`;
  });
  return s + "</svg>";
}

/* ---------- blocchi HTML ---------- */
function bloccoDestino(dest) {
  return `<section class="sezione">
    <div class="occhiello">La direzione del cammino</div>
    <h2>Numero del Destino</h2>
    <div class="riga-numero">
      <span class="numerone">${dest.chiave}</span>
      <span class="etichetta-num">somma completa della data: ${dest.totale}</span>
    </div>
    <p>${TESTI_DESTINO[dest.chiave]}</p>
    <p class="nota">Si ottiene sommando tutte le cifre della data di nascita e riducendo il totale. In questo sistema l'1 puro non compare come Destino: al suo posto vive il 10, mentre 11 e 22/4 restano interi come numeri maestri.</p>
  </section>`;
}

function bloccoGriglia(conti, fr) {
  const chip = (f, neg) => `<div class="chip-freccia${neg ? " negativa" : ""}">
      <span class="segno">${neg ? "◌" : "➔"}</span>
      <div><b>${esc(f.nome)}</b><span>${esc(TESTI_FRECCE[f.nome] || "")}</span></div>
    </div>`;
  let legenda = "";
  fr.piene.forEach(f => legenda += chip(f, false));
  fr.vuote.forEach(f => legenda += chip(f, true));
  if (!legenda) legenda = `<p class="nota">Nessuna linea completa né completamente vuota: un profilo distribuito, senza tratti estremi.</p>`;
  let cifre = "";
  for (let n = 1; n <= 9; n++) {
    if (!conti[n]) continue;
    const idx = Math.min(conti[n], 4) - 1;
    cifre += `<div class="cifra-voce"><b>${String(n).repeat(Math.min(conti[n],4))}${conti[n]>4?"…":""}</b> — <span>${TESTI_CIFRE[n][idx]}</span></div>`;
  }
  return `<section class="sezione">
    <div class="occhiello">La mappa di partenza</div>
    <h2>Griglia della Nascita e Frecce</h2>
    <p class="nota">Ogni cifra della data occupa la sua casella; le righe raccontano i tre piani — mente, anima, corpo. Le linee complete accendono una freccia di forza, quelle vuote indicano un tratto da coltivare.</p>
    <div class="griglia-avvolgi">
      <div class="griglia-scena">${svgGriglia(conti, fr)}</div>
      <div class="legenda-frecce">${legenda}</div>
    </div>
    <details class="cifre"><summary>Le cifre presenti, una per una</summary>${cifre}</details>
  </section>`;
}

function bloccoGiorno(ng) {
  return `<section class="sezione">
    <div class="occhiello">L'altro io</div>
    <h2>Numero del Giorno</h2>
    <div class="riga-numero"><span class="numerone">${ng}</span></div>
    <p>${TESTI_GIORNO[ng]}</p>
    <p class="nota">Nasce dal solo giorno del mese ed è una voce secondaria rispetto al Numero del Destino: un colore in più della personalità, non la sua direzione.</p>
  </section>`;
}

function bloccoPiramidi(pir, eta) {
  let righe = "";
  pir.picchi.forEach((p, i) => {
    const attuale = eta >= p.eta && eta < p.eta + 9;
    righe += `<tr${attuale ? ' class="attuale"' : ""}>
      <td>${i + 1}°</td><td class="num">${p.chiave}</td>
      <td>${p.eta} anni<br><span style="color:var(--carta-dim);font-size:.85rem">${p.anno}</span></td>
      <td>${TESTI_PICCHI[p.chiave]}${attuale ? ' <b style="color:var(--ottone-chiaro)">← fase attuale</b>' : ""}</td></tr>`;
  });
  return `<section class="sezione">
    <div class="occhiello">Gli anni della maturità</div>
    <h2>Le Piramidi e i quattro Picchi</h2>
    <p class="nota">Quattro cicli di nove anni scandiscono la stagione centrale della vita. Il primo picco arriva all'età di 36 meno il Numero del Destino — sempre in un Anno Personale 9, l'anno del cambiamento — e gli altri seguono ogni nove anni.</p>
    <div class="piramide-avvolgi">${svgPiramidi(pir)}</div>
    <table class="tab-picchi">
      <thead><tr><th>Picco</th><th>Numero</th><th>Età · anno</th><th>Tema del ciclo</th></tr></thead>
      <tbody>${righe}</tbody>
    </table>
  </section>`;
}

function bloccoAnni(g, m, annoCorrente) {
  const np = annoPersonale(g, m, annoCorrente);
  const au = annoUniversale(annoCorrente);
  return `<section class="sezione">
    <div class="occhiello">Il ritmo del tempo</div>
    <h2>Il tuo ciclo di nove anni</h2>
    <p class="nota">Ogni anno di calendario porta un numero personale da 1 a 9, che si ripete in cicli. I 9 e gli 1 sono i grandi picchi, il 6 un picco minore, il 4 e il 7 anni di consolidamento — non anni negativi, ma stagioni con un passo diverso.</p>
    ${svgCiclo(g, m, annoCorrente)}
    <div class="anno-focus">
      <div><span class="etichetta-num">Anno Personale ${annoCorrente}</span><div class="numerone" style="font-size:2.8rem">${np}</div></div>
      <p style="margin:0">${TESTI_ANNO_PERSONALE[np]}<br><span style="color:var(--carta-dim);font-size:.85rem">Anno Universale del ${annoCorrente}: ${au.maestro ? "22/4" : au.valore}</span></p>
    </div>
  </section>`;
}

function bloccoNome(nn, nomeGrezzo) {
  if (!nn) return "";
  const rid = v => v === 22 ? "22/4" : String(v);
  const lettere = nn.lettere.map(x =>
    `<span class="lett${x.voc ? " vocale" : ""}"><b>${x.l}</b><span>${x.v}</span></span>`).join("");
  return `<section class="sezione">
    <div class="occhiello">Il suono che ti chiama</div>
    <h2>I numeri di «${esc(nomeGrezzo.trim())}»</h2>
    <p class="nota">Ogni lettera ha un valore da 1 a 9. Le vocali (in oro) compongono il Numero dell'Anima, le consonanti il Numero della Persona; l'insieme dà il Numero dell'Espressione. Conta il nome usato davvero ogni giorno.</p>
    <div class="lettere">${lettere}</div>
    <div class="nome-colonne">
      <div class="nome-carta"><span class="etichetta-num">Anima · vocali</span>
        <span class="numerone">${rid(nn.anima)}</span>
        <p>Il mondo interiore: ciò che nutre davvero, al di là delle apparenze. (totale vocali: ${nn.animaTot})</p></div>
      <div class="nome-carta"><span class="etichetta-num">Persona · consonanti</span>
        <span class="numerone">${rid(nn.persona)}</span>
        <p>L'immagine che gli altri incontrano per prima: lo stile con cui ci si presenta al mondo. (totale consonanti: ${nn.personaTot})</p></div>
      <div class="nome-carta"><span class="etichetta-num">Espressione · totale</span>
        <span class="numerone">${rid(nn.espressione)}</span>
        <p>La sintesi del nome: il timbro complessivo che accompagna la personalità. (totale: ${nn.espressioneTot})</p></div>
    </div>
  </section>`;
}

/* ============================================================
   FLUSSO PRINCIPALE
   ============================================================ */
function calcola(dataISO, nomeGrezzo) {
  const [a, m, g] = dataISO.split("-").map(Number);
  const oggi = new Date();
  const annoCorrente = oggi.getFullYear();
  let eta = annoCorrente - a;
  const compiuto = (oggi.getMonth() + 1 > m) || (oggi.getMonth() + 1 === m && oggi.getDate() >= g);
  if (!compiuto) eta--;

  const dest = numeroDestino(g, m, a);
  const conti = grigliaNascita(g, m, a);
  const fr = frecce(conti);
  const ng = numeroGiorno(g);
  const pir = piramidi(g, m, a, dest);
  const nn = nomeGrezzo ? numeriNome(nomeGrezzo) : null;

  $("#risultati").innerHTML =
    bloccoDestino(dest) +
    bloccoGriglia(conti, fr) +
    bloccoGiorno(ng) +
    bloccoPiramidi(pir, eta) +
    bloccoAnni(g, m, annoCorrente) +
    bloccoNome(nn, nomeGrezzo || "");
  $("#risultati").style.display = "block";
  $("#risultati").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("#modulo").addEventListener("submit", e => {
  e.preventDefault();
  const err = $("#errore");
  err.style.display = "none";
  const val = $("#data").value;
  if (!val) {
    err.textContent = "Inserisci la data di nascita per continuare.";
    err.style.display = "block";
    return;
  }
  const nome = $("#nome").value;
  if (nome && !normalizzaNome(nome)) {
    err.textContent = "Il nome deve contenere almeno una lettera (A–Z).";
    err.style.display = "block";
    return;
  }
  try { localStorage.setItem("numeria", JSON.stringify({ d: val, n: nome })); } catch (_) {}
  calcola(val, nome);
});

$("#pulisci").addEventListener("click", () => {
  $("#data").value = ""; $("#nome").value = "";
  $("#risultati").style.display = "none";
  $("#risultati").innerHTML = "";
  try { localStorage.removeItem("numeria"); } catch (_) {}
});

/* ripristino ultima consultazione */
try {
  const salvato = JSON.parse(localStorage.getItem("numeria") || "null");
  if (salvato && salvato.d) { $("#data").value = salvato.d; $("#nome").value = salvato.n || ""; }
} catch (_) {}

/* ---------- PWA: service worker + invito all'installazione ---------- */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
let promptInstalla = null;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  promptInstalla = e;
  if (!localStorage.getItem("numeria-no-banner")) $("#bannerInstalla").style.display = "flex";
});
$("#btnInstalla").addEventListener("click", async () => {
  if (!promptInstalla) return;
  promptInstalla.prompt();
  await promptInstalla.userChoice;
  promptInstalla = null;
  $("#bannerInstalla").style.display = "none";
});
$("#btnChiudiInstalla").addEventListener("click", () => {
  $("#bannerInstalla").style.display = "none";
  try { localStorage.setItem("numeria-no-banner", "1"); } catch (_) {}
});
