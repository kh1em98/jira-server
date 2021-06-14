declare namespace NodeJS {
  interface ProcessEnv {
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_TEST_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    DB_PORT: string;
    DOCKER_DEV_REDIS_HOST: string;
    DOCKER_DEV_DB_HOST: string;
    BUCKET: string;
    REGION: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET_KEY: string;
    SECRET: string;
  }
}
