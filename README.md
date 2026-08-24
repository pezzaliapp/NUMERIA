# Numeria — PWA numerologica

App web progressiva (PWA) che calcola un profilo numerologico completo a partire
dalla data di nascita e, facoltativamente, dal nome usato ogni giorno.

## Cosa calcola
- **Numero del Destino** — somma di tutte le cifre della data, con i casi
  speciali 10, 11 e 22/4.
- **Griglia della Nascita** — schema 3×3 (piani di mente, anima e corpo) con il
  conteggio di ogni cifra.
- **Frecce** — linee complete (tratti di forza) e linee vuote (tratti da
  coltivare), disegnate direttamente sulla griglia.
- **Numero del Giorno** — il "secondo io" ricavato dal solo giorno del mese.
- **Piramidi e Picchi** — i quattro cicli di nove anni della maturità, con età
  e anno di ogni picco (primo picco a 36 − Numero del Destino).
- **Anni Personali** — il ciclo di nove anni con grafico dell'onda e l'anno in
  corso evidenziato.
- **Numeri del nome** — Anima (vocali), Persona (consonanti) ed Espressione
  (totale) con la tabella pitagorica A=1 … Z=8.

## Novità v2
- La data di nascita si sceglie con tre menu a tendina (giorno / mese / anno):
  niente più calendario nativo, selezione immediata di qualunque anno dal 1900.
- Tipografia fluida: testi più leggibili su smartphone e pieghevoli.

## Come usarla
La cartella è già pronta: basta servirla da un qualunque hosting statico
(GitHub Pages, Netlify, Vercel, un server qualsiasi). Per provarla in locale:

```bash
cd numerologia-app
python3 -m http.server 8080
# poi apri http://localhost:8080
```

Nota: il service worker (offline + installazione) richiede HTTPS o localhost.

## Privacy
Tutti i calcoli avvengono nel browser. Nessun dato viene inviato a server:
data e nome restano solo sul dispositivo (localStorage), e possono essere
cancellati con il pulsante "Ricomincia".

## Avvertenza
Contenuti a solo scopo di intrattenimento e riflessione personale. La
numerologia non ha validità scientifica e nulla di ciò che l'app mostra
costituisce consulenza medica, psicologica, legale o finanziaria.
