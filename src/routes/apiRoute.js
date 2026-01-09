import express from 'express';
import osmRelsByCntr from '../data/rels_index_api_by_cntr.json' with { type: 'json' };
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.get('/countries/:countryId', authenticateJWT, async function (req, res, next) {
  const { countryId } = req.params;
  const levels = req.query.levels?.split(',') ?? null;
  
  if (!(countryId in osmRelsByCntr)) {
    return res.status(200).json({ status: 'FAILURE', message: 'Country not found' });
  }
  let resultRels = osmRelsByCntr[countryId];

  if (levels) {
    resultRels = resultRels.filter(rel => levels.includes(rel.admin_level));
  }
  return res.status(200).json({ status: 'OK', data: resultRels })
});

export default router;