import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// Rota 1: Status da API e Metadados
app.get('/', (req: Request, res: Response) => {
    res.json({ 
        status: 'online', 
        projeto: 'E-commerce API',
        descricao: 'Microsserviço de gestão de catálogo e retalho'
    });
});

app.get('/produtos', async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products?limit=5');
        
        // Mapeando e limpando os dados brutos para o nosso padrão
        const produtos = response.data.map((p: any) => ({
            id: p.id,
            referencia: `REF-${p.id.toString().padStart(4, '0')}`,
            titulo: p.title,
            preco_eur: p.price,
            categoria: p.category,
            imagem_url: p.image
        }));

        return res.json({
            total_listado: produtos.length,
            produtos: produtos
        });
        
    } catch (error) {
        return res.status(502).json({ 
            erro: 'Falha de comunicação com a base de dados de fornecedores.' 
        });
    }
});

app.get('/produtos/:id', async (req: Request, res: Response): Promise<any> => {
    const produtoId = req.params.id;

    if (isNaN(Number(produtoId))) {
        return res.status(400).json({ erro: 'O ID do produto deve ser numérico.' });
    }

    try {
        const response = await axios.get(`https://fakestoreapi.com/products/${produtoId}`);
        
        if (!response.data) {
            return res.status(404).json({ erro: 'Produto não encontrado no sistema.' });
        }
        
        return res.json(response.data);

    } catch (error) {
        return res.status(502).json({ erro: 'Serviço temporariamente indisponível.' });
    }
});

export default app;