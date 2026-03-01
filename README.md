# Administrative Divisions API

Backend for [OSM administrative divisions](https://github.com/CopaCabana21/administrative-divisions).

## Features
- OAuth authentication (Google, OpenStreetMap) with JWT
- Save users and favorites to Supabase
- Search administrative division and make parent name path
- RESTful API to query hierarchy per country

# Public REST API to get hierarchy:

REST API serving administrative division hierarchies from OpenStreetMap.

## Endpoints

### Get Country Hierarchy
```
GET /api/v1/countries/:countryId?levels=4,6
```

**Parameters:**
- `countryId` (required) - OSM relation ID
- `levels` (optional) - Comma-separated admin levels to include
