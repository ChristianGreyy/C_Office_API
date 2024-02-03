export const enum EUserRole {
  USER = 'user',
  STAFF = 'staff',
  ADMIN = 'admin',
}

export const enum EUserPermission {
  // users
  CREATE_USER = 'create_user',
  GET_USERS = 'get_users',
  GET_USER = 'get_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  // roles
  CREATE_ROLE = 'create_role',
  GET_ROLES = 'get_roles',
  GET_ROLE = 'get_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',
  // permissions
  CREATE_PERMISSION = 'create_permission',
  GET_PERMISSIONS = 'get_permissions',
  GET_PERMISSION = 'get_permission',
  UPDATE_PERMISSION = 'update_permission',
  DELETE_PERMISSION = 'delete_permission',
  // positions
  CREATE_POSITION = 'create_position',
  GET_POSITIONS = 'get_positions',
  GET_POSITION = 'get_position',
  UPDATE_POSITION = 'update_position',
  DELETE_POSITION = 'delete_position',
  // levels
  CREATE_LEVEL = 'create_level',
  GET_LEVELS = 'get_levels',
  GET_LEVEL = 'get_level',
  UPDATE_LEVEL = 'update_level',
  DELETE_LEVEL = 'delete_level',
  // levels
  CREATE_UNIVERSITY = 'create_university',
  GET_UNIVERSITIES = 'get_universities',
  GET_UNIVERSITY = 'get_university',
  UPDATE_UNIVERSITY = 'update_university',
  DELETE_UNIVERSITY = 'delete_university',
  // trackers
  CREATE_TRACKER = 'create_tracker',
  GET_TRACKERS = 'get_trackers',
  GET_TRACKER = 'get_tracker',
  UPDATE_TRACKER = 'update_tracker',
  DELETE_TRACKER = 'delete_tracker',
  // priorities
  CREATE_PRIORITY = 'create_priority',
  GET_PRIORITIES = 'get_priorities',
  GET_PRIORITY = 'get_priority',
  UPDATE_PRIORITY = 'update_priority',
  DELETE_PRIORITY = 'delete_priority',
}
