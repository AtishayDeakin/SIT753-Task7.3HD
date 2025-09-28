const express = require('express');
const client = require('prom-client');
const app = express();
app.use(express.json());

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const register = client.register;

let items = [
  { id: 1, name: 'item-one' },
  { id: 2, name: 'item-two' }
];

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/items', (req, res) => res.json(items));
app.get('/items/:id', (req, res) => {
  const it = items.find(i => i.id === parseInt(req.params.id));
  if (!it) return res.status(404).json({ error: 'not found' });
  res.json(it);
});
app.post('/items', (req, res) => {
  const id = items.length ? items[items.length-1].id + 1 : 1;
  const item = { id, name: req.body.name || `item-${id}` };
  items.push(item);
  res.status(201).json(item);
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => console.log(`Server running on ${port}`));
}
module.exports = app;
