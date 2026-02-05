export const authorizePermissions = (permissions: string[]) => {
  return (req, res, next) => {
    if (!req.user?.permissions) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const allowed = permissions.every(p =>
      req.user.permissions.includes(p)
    );

    if (!allowed) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};
