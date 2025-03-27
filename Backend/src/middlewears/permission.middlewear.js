import { Permission } from '../models/permission.models.js';
import { User } from '../models/user.models.js';

export const checkPermission = (action, resource) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).exec();

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userPermissions = await Permission.find({
        role: { $in: user.roles },
        resource,
      }).exec();

      const hasPermission = userPermissions.some(permission =>
        permission.actions.includes(action)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden: You don't have the required permissions" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};
