# poliklinika
Web portal za privatne poliklinike


## Project requirements

U sistemu treba razlikovati cetiri grupe korisnika (korisnike, Lekare, Pomocno osoblje, Administratora sistema).

1. Potrebno je razviti deo za unos radnog vremena lekara kao i dostupne termine za zakazivanje pregleda.
Treba obezbediti da se postavlja dužina termina u kojima bi se zakazivali pregledi.
Dužina termina treba biti konfigurabilna (može da zavisi od bolesti, lekara koji radi, tipa pregleda itd ...)

2. Vođenje evidencije o zaposlenim radnicima (pomoćno osoblje, lekari, ...).

3. Vođenje evidencije o medicinskim uslugama koje se mogu pružiti pacijentima
prilikom njihove posete lekaru zajedno sa pracenjem promene njihove cene.

4. Vođenje evidencije o utrosenim medikamentima.

5. Izdavanje završnog računa pacijentima (lista pruženih usluga, utrošeni medikamenti) sa cenom u RSD.

6. Pri zakazivanju pregleda, pacijent bira datum, bira tip pregleda,
dostupnog lekara i slobodan termin. Zauzeti termin se odmah vidi kao zauzeti kod
lekara ali i ostali pacijenti dobijaju informaciju o tome da je taj termin zazuzet,
ali bez detaljnih infomracija. Obezbediti da pacijenti mogu imati svoj nalog na sistemu.
Pacijenti mogu da otkazuju pregled i uz to unose razlog odjave termina.

7. Kada pacijent dodje na pregled, pretrazuje se u sistemu.
Ukoliko je potrebno dodaju se u sistem svi podaci iz eKnjizice i licne karte pacijenta.
Ukoliko takav pacijnt ne postoji dodaje se novi pacijent u bazi.

8. Za svakog pacijenta evidentira se anamneza (slobodan tekst), jedna ili vise dijagnoza
MKB10 sifarnik, Pise se izvestaj, selektuju pruzene medicinske usluge i utroseni medikamenti.
Ukoliko dodatno pomocno osoblje unosi medikamente treba i to podrzati kroz sistem, s tim da
pomocno osoblje ne sme da menja prethodne unose lekara. Od mogucih polja za pregled ostaviti
mogucnost za unos donjeg i gornjeg krvnog pritiska, pusla, telesne tezine, visine,
BMI (koji se može preračunavati).

9.Omogućiti lekaru pregled istorije lecenja pacijenta

10. Omogućiti lekaru pregled svih zakazanih pacijenata i pacijenata koji se trenutno nalaze u cekaonici.

11. Omogućiti štampanje i eksportovanje svih izveštaja u pdf format.

12. Prilikom zakazivanja pregleda pacijent bi trebao da popuni kratku akentu o svom stanju:
(temperatura, glavobolja, dijareja koliko puta, krvni pritisak donji, gornji, puls,
jak bol u grudima, jak bol u trbuhu, ...). Nije lose da sva ova pitanja budu
konfigurabilna tako da lekari po specijalizaciji mogu praviti grupu tih pitanja.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!