/**
 * Auth settings
 */
export interface IAuthConfig {
  checkAuth: boolean; // check ot skip auth
  roles: IRole[]; // role to rights mapping
  jwtSecret?: string;
  jwtAccessExpirationMinutes?: number;
  jwtAccessRefreshMinutes?: number;
}

/**
 * Role to rights mapping
 */
export interface IRole {
  roleName: string; // role name
  rights: ERoleRights[]; // what can he do
}

/**
 * Role Rights enum
 */
export enum ERoleRights {
  NONE = 0,
  ONLY_0 = 1,
  ONLY_1 = 2,
  ALL = 3,
}

// the config name environment variable
export const DEFAULT_AUTH_CONFIG_NAME = 'auth';

// default values
export const DEFAULT_AUTH_CONFIG: IAuthConfig = {
  checkAuth: false,
  roles: [{ roleName: 'admin', rights: [ERoleRights.ALL] }],
};
