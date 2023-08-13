const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3008;
const partialJsonPath = process.env.PARTIAL_JSON_PATH;



// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// Configurar la ubicación de las vistas (plantillas)
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

// Cargar datos desde el archivo JSON en una constante TRAILERFLIX
const rawData = fs.readFileSync(partialJsonPath, 'utf-8');
const TRAILERFLIX = JSON.parse(rawData);

// Endpoint para la ruta raíz
app.get('/', (req, res) => {
  const welcomeMessage = '<h1>Bienvenido a TrailerFlix</h1>';
  res.send(welcomeMessage);
});

// Endpoint para listar el catálogo completo
app.get('/catalogo', (req, res) => {
    res.render('catalogo', { catalogo: TRAILERFLIX });
  });

// Endpoint para buscar por título
app.get('/titulo/:title', (req, res) => {
    const titleParam = req.params.title.toLowerCase();
    const filteredContent = TRAILERFLIX.filter(item => item.titulo.toLowerCase().includes(titleParam));
    res.json(filteredContent);
  });
  
  // Endpoint para buscar por categoría
  app.get('/categoria/:cat', (req, res) => {
    const categoryParam = req.params.cat.toLowerCase();
    const filteredContent = TRAILERFLIX.filter(item => item.categoria.toLowerCase() === categoryParam);
    res.json(filteredContent);
  });
  
  // Endpoint para buscar por actor/actriz en el reparto
  app.get('/reparto/:act', (req, res) => {
    const actorParam = req.params.act.toLowerCase();
    const filteredContent = TRAILERFLIX.filter(item => item.reparto.toLowerCase().includes(actorParam));
    res.json(filteredContent);
  });
  
  // Endpoint para obtener la URL del tráiler
  app.get('/trailer/:id', (req, res) => {
    const idParam = req.params.id;
    const movie = TRAILERFLIX.find(item => item.id === idParam);
    if (movie) {
      if (movie.trailer) {
        res.json({ url: movie.trailer });
      } else {
        res.json({ message: 'Tráiler no disponible para esta película/serie' });
      }
    } else {
      res.status(404).json({ error: 'Película/serie no encontrada' });
    }
  });
  

// Aquí puedes agregar los demás endpoints según las búsquedas requeridas

app.listen(port, () => {
  console.log(`Servidor web en http://localhost:${port}`);
});