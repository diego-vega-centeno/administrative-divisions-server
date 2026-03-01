import express from 'express';
import osmRelsByCntr from '../data/rels_index_api_by_cntr.json' with { type: 'json' };

const router = express.Router();

router.get('/countries/:countryId', async function (req, res, next) {
  const { countryId } = req.params;
  const levels = req.query.levels?.split(',') ?? null;
  
  if (!(countryId in osmRelsByCntr)) {
    return res.status(404).json({ code: 'missing_country', message: 'Country not found' });
  }
  let resultRels = osmRelsByCntr[countryId];

  if (levels) {
    resultRels = resultRels.filter(rel => levels.includes(rel.admin_level));
  }
  return res.status(200).json(resultRels)
});

export default router;