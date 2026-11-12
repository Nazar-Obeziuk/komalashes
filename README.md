# Komalashes

Jednostronicowa strona (landing page) dla stylistki rzęs — czysty HTML, CSS i JavaScript, bez frameworków.

## Struktura

- `index.html` — treść strony (po polsku)
- `style.css` — style
- `script.js` — działanie (popup, galeria, opinie, formularze); na początku pliku obiekt `CONFIG` z danymi kontaktowymi
- `images/` — zdjęcia (`about.jpg`, `portfolio-1…6.jpg`)

## Co zmienić przed publikacją

- Opinie klientek: `REVIEWS` w `script.js` (obecne są demonstracyjne)
- Telefon, e-mail, adres, godziny, Instagram: `CONFIG` w `script.js`
- Mapa: parametr `q` w `iframe` w `index.html`
- `canonical`, `og:image` i JSON-LD w `<head>` w `index.html`
- Wysyłka formularza: `submitEndpoint` w `CONFIG` (puste = tryb demonstracyjny, nic nie jest wysyłane)

## Wdrożenie

Strona statyczna — na Vercel: Framework Preset „Other”, bez Build Command.
