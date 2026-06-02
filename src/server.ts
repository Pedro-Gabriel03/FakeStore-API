import app from './app';

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor de Catálogo a correr em http://localhost:${PORT}`);
});