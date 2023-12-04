module.exports = (allowedRoles) => {
    return (req, res, next) => {
      try {
        // Pastikan req.user dan req.user.role terdefinisi
        if (!req.user || !req.user.role) {
          return res.status(403).json({
            status: 'failed',
            message: 'User role not defined',
          });
        }
  
        const userRole = req.user.role;
  
        if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({
            status: 'failed',
            message: ` role ${userRole} tidak punya akses`,
          });
        }
  
        next();
      } catch (error) {
        next(error);
      }
    };
  };
  