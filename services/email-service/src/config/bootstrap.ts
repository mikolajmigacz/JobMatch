import dotenv from 'dotenv';
import { loadEnvConfig, EnvConfig } from './env.config';

dotenv.config();

export const config: EnvConfig = loadEnvConfig();

export default config;
