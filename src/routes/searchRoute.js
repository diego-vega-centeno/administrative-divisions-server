import express from "express";
import fs from 'fs';

class RelationSearch {
  constructor() {
    this.data = [];
    this.index = {};
    this.loadData('./src/data/add_flat.json');
  }

  loadData(path) {
    const rawData = fs.readFileSync(path, 'utf-8');
    this.data = JSON.parse(rawData);

    // index for fast lookup
    this.data.forEach(rel => {
      this.index[rel.id] = rel;
    })
  }

  search(query, limit = 50) {
    const queryLower = query.toLowerCase();
    const result = [];

    // naive search approach
    for (const rel of this.data) {
      if (rel.text.toLowerCase().includes(queryLower)) {
        const path = this.buildPath(rel.id);
        result.push({
          id: rel.id,
          text: rel.text,
          admin_level: rel.admin_level,
          path: path
        });

        if (result.length >= limit) break;
      }
    }

    return result;
  }

  buildPath(id) {
    const path = [];
    let currId = id;

    while (currId != '#') {
      const curr = this.index[currId];
      if (!curr) break;

      path.unshift({
        id: curr.id,
        text: curr.text,
        admin_level: curr.admin_level,
      });

      currId = curr.parent;
    }

    return path;
  }

}

const searchService = new RelationSearch();

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const query = (req.query.q || '').trim();

    if (query.length < 2) {
      return res.json({ data: [] });
    }

    // query with a limit of 100 results
    const results = searchService.search(query, 100);
    res.json({ data: results });
  } catch (error) {
    next(error);
  }
})

export default router;