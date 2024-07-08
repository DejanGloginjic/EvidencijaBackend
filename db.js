const { Pool } = require("pg");

// Connection string za Railway bazu podataka
const connectionString =
  "postgresql://postgres:aejWkNaPTrgDnOJXZKKSnUomLfOqYDyl@roundhouse.proxy.rlwy.net:18748/railway";

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
