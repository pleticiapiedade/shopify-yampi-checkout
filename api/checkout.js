export default async function handler(req, res) {
  console.log('[Yampi] recebendo requisição:', req.method, req.body?.products?.length);

  res.setHeader('Access-Control-Allow-Origin', 'https://vossavontade.com.br');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { products } = req.body;
  if (!products || !Array.isArray(products)) {
    console.error('[Yampi] payload inválido:', req.body);
    return res.status(400).json({ error: 'Produtos inválidos' });
  }

  try {
    console.log('[Yampi] enviando para API da Yampi:', products);
    const response = await fetch('https://api.yampi.com.br/v1/cart/create', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer lnmhxaUiW4uXFhxOFladZFWoaxNOT7NjK0c9hrZU',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ products })
    });

    const data = await response.json();
    console.log('[Yampi] resposta da API:', response.status, data);

    if (!response.ok) {
      return res.status(500).json({ error: data.message || 'Erro na API da Yampi', details: data });
    }

    return res.status(200).json({ checkout_url: data.checkout_url });
  } catch (err) {
    console.error('[Yampi] erro interno:', err);
    return res.status(500).json({ error: 'Erro ao conectar com a Yampi', details: err.message });
  }
}
