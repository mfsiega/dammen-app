# Dammen!
Dit is het bordspel Dammen, als React App. De app is gemaakt als opdracht.

# Gebruikerswijzing
Ga naar https://mfsiega.github.io/dammen-app/.

Om een stuk te verplaatsen, click op je stuk, en dan de bestemming.
Het is verplicht om te slaan wanneer dit mogelijk is.

Als je deze app zelf wilt opzetten, moet je eerst:
- NodeJS en npm installeren.
- De code downloaden.
- `npm start` van de directory waar je de code hebt opgeslagen.

# Toelichting van de code
Dit project is gemaakt door `npx create-react-app dammen-app`.

De belangrijke files zijn:
- `src/App.js`
- `src/components/*`
- `src/common/*`

De structuur is als volgt.

## Structuur
App.js is het toegangspunt. Het heeft de basis structuur:
- Een bord, dat de UI tekent en user input doorgeeft.
- Een game engine, die de zetten regelt.
- De game state. Die is iets bijzonders van React - als de game state verandert,
  wordt de UI opnieuw getekent.

### Het bord
Het bord component heeft twee functies:
- De UI tekenen. Een visueel beeld van de game state, dus.
- Een callback gebruiken als een player een zet maakt.

De callback geeft informatie door aan de game engine.

### Game engine
Hier hebben we de centrale logica van de app. Het heeft drie belangrijke functies:
- `isLegalMove` die bepaalt of en zet mag of niet.
- `executeMove` die een zet uitvoert.
- `getState` die de game state geeft, om het spel door te brengen.

De game engine maakt gebruikt van de `MoveValidator` class. Die heeft handige functies,
maar is vooral een abstraction om de complexiteit van de regels in te houden.

### Game state
In App.js gebruiken we bjv `setSquares`. Dit is belangrijk in de React lifecycle.
Als de state verandert, wordt de component opnieuw rendered.

# Volgende stappen
Deze app is nog niet klaar! De volgende stappen zijn:
- Een simpel AI maken.
- Algemene UI verbeteringen.
- Testing!