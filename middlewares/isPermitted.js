const roleHasPermission = async (role, permission) => {
  let permitted = false;

  if (!role) return permitted;

  role.permissions.map(adminPermission => {
    if (adminPermission.type === permission.type) {
      permitted = true;
    }
    return false;
  });

  return permitted;
};

module.exports = permission => async (req, res, next) => {
  try {
    const { adminType, role } = req.user;
    if (adminType === 'ROOT_ADMIN') return next();

    if (adminType === 'SUB_ADMIN' && (await roleHasPermission(role, permission))) return next();

    // eslint-disable-next-line quotes
    return res.status(401).json({ message: "You aren't permitted for doing this action" });
  } catch (error) {
    return next(error);
  }
};
