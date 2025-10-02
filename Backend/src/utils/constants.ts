import { env } from '~/configs/enviroment'

export const WHITELIST_DOMAINS = ['']

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === 'production'
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT
