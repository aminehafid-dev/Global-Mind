module.exports = {
  apps: [
    {
      name: 'ecole-node-api',
      script: 'server/src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        DB_TYPE: 'sqlite'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        DB_TYPE: 'mysql',
        DB_HOST: '127.0.0.1',
        DB_PORT: 3306,
        DB_NAME: 'ecole_esprit_global',
        DB_USER: 'root',
        DB_PASSWORD: ''
      }
    }
  ]
};
