import { KoaContextWithOIDC, Configuration } from 'oidc-provider';
import policy from './policy';

export default {
  clients: [
    {
      client_id: 'test_client_id',
      client_secret: 'test_client_secret',
      redirect_uris: ['https://www.shoes.com'],
      grant_types: ['client_credentials', 'authorization_code', 'refresh_token', 'implicit'],
      response_types: ['code', 'id_token'],
      subject_type: 'public',
      scope: 'offline_access profile openid',
      token_endpoint_auth_method: 'client_secret_post',
      introspection_endpoint_auth_method: 'client_secret_post',
      revocation_endpoint_auth_method: 'client_secret_post',
    },
  ],
  interactions: {
    policy: policy,
    url(ctx: KoaContextWithOIDC, interaction) {
      return `/auth/interactions/${interaction.uid}`;
    },
  },
  subjectTypes: ['pairwise', 'public'],
  rotateRefreshToken: true,
  tokenEndpointAuthMethods: ['client_secret_post'],
  cookies: {
    long: {
      signed: true,
      httpOnly: true,
      overwrite: true,
      sameSite: 'none',
    },
    short: {
      signed: true,
      httpOnly: true,
      overwrite: true,
      sameSite: 'lax',
    },
    keys: ['some_cookie_secret'],
    names: {
      interaction: '_interaction',
      resume: '_interaction_resume',
      session: '_session',
    },
  },
  routes: {
    authorization: '/auth/authorize',
    check_session: '/auth/session/check',
    end_session: '/auth/session/end',
    introspection: '/auth/token/introspection',
    revocation: '/auth/token/revocation',
    token: '/auth/token',
    userinfo: '/auth/me',
  },
  scopes: ['offline_access', 'profile', 'openid'],
  claims: {},
  pkce: {
    methods: ['S256'],
    required: function (ctx: KoaContextWithOIDC, client: any) {
      return false;
    },
  },
  features: {
    devInteractions: { enabled: false },

    deviceFlow: { enabled: false },
    introspection: { enabled: true },
    revocation: { enabled: false },

    clientCredentials: { enabled: true },
  },
  ttl: {
    AccessToken: 1 * 60 * 60, // 1 hour in seconds
    ClientCredentials: 1 * 60 * 60, // 1 hour in seconds
    AuthorizationCode: 10 * 60, // 10 minutes in seconds
    IdToken: 1 * 60 * 60, // 1 hour in seconds
    DeviceCode: 10 * 60, // 10 minutes in seconds
    RefreshToken: 7 * 24 * 60 * 60, // 7 day(s) in seconds,
    Interaction: 1 * 60 * 60, // 1 hour in seconds
    Session: 90 * 24 * 60 * 60, // 90 days in seconds
  },
} as Configuration;
