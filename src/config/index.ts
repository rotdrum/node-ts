
const config: Config = {
  name: 'default_templates_mongo_typescriptjs',
  version: '1.0.0',
  env: process.env.NODE_ENV || 'development',
  serverSettings: {
      port: parseInt(process.env.APP_PORT || '3000', 10),
  },
  dbSettings: {
      db: process.env.DB_NAME_FIRST,
      server: process.env.DB_SERVER_FIRST,
  },
  tokenSettings: {
      publicKey: process.env.JWT_TOKEN_SETTING_PUBLIC_KEY,
      apiSecretKey: process.env.YOU_SERVICE_API_KEY,
  }
};

export default config;

interface Config {
  name: string;
  version: string;
  env: string;
  serverSettings: {
      port: number;
  };
  dbSettings: {
      db?: string;
      server?: string;
  };
  tokenSettings: {
      publicKey?: string;
      apiSecretKey?: string;
  };
}
