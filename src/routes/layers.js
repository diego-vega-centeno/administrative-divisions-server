import express from 'express';
import { saveLayer, getLayerRelations } from '../models/layerWrites.js';
import { getUserLayersRelations } from '../models/layerReads.js';
import { authenticateJWT } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { layerSchema } from '../schemas/validation.js';

const router = express.Router();

// PUT /layer - Create a new layer with relations
// Has a unique title constraint
router.put('/', authenticateJWT, validate(layerSchema), async (req, res, next) => {
  try {
    const { title, relations } = req.body;
    // relations : [{relId:String, relName: String},...]
    const layerId = await saveLayer(req.user.id, title, relations);
    return res.status(201).json({
      message: 'Layer saved',
      data: { layerId }
    });
  } catch (error) {
    next(error);
  }
});

// GET /layer/:id - Get relation from layer
router.get('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const relations = await getLayerRelations(req.params?.id);
    return res.status(200).json({ data: relations });
  } catch (error) {
    next(error)
  }
});

// GET /layer- Get all realtions from layer
router.get('/', authenticateJWT, async (req, res, next) => {
  try {
    const layersRelations = await getUserLayersRelations(req.user.id);
    return res.status(200).json({ data: layersRelations });
  } catch (error) {
    next(error)
  }
});

export default router;


