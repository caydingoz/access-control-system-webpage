function hasFlag(userFlags, requiredFlag) {
  return (userFlags & requiredFlag) === requiredFlag
}

function addFlag(userFlags, newFlag) {
  return userFlags | newFlag
}

function removeFlag(userFlags, flagToRemove) {
  return userFlags & ~flagToRemove
}

const FlagChecker = {
  hasFlag,
  addFlag,
  removeFlag,
}

export default FlagChecker
