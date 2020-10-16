require('dotenv').config()

module.exports = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    dbName: process.env.DB_NAME || 'pingtree',
    dbHost: process.env.DB_HOST || 'mongodb://127.0.0.1',
    dbPort: process.env.DB_PORT || '27017',
    password: process.env.REDIS_PASSWORD,
    ...(process.env.NODE_ENV === 'test' ? { fast: true } : {})
  }
}
