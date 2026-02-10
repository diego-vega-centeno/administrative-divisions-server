import express from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/:countryId/children', async function (req, res) {
  const { countryId } = req.params;
  const filePath = path.join(__dirname, '..', 'data', 'add_flat_country_chunks', `${countryId}.json`);
  const data = await fs.promises.readFile(filePath, 'utf-8');
  const children = JSON.parse(data);

  res.json(children);
});

export default router;