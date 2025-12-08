export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Admin access denied" });
    }

    next();

  } catch (error) {
    return res.status(500).json({ success: false, message: "Admin check failed" });
  }
};
