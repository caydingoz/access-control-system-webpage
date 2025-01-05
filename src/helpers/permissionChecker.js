export default class PermissionChecker {
  static hasPermission(userPermissions, entity, action) {
    if (!userPermissions || !userPermissions[entity]) return false
    return (userPermissions[entity] & action) === action
  }
}
