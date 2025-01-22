import { UserRolesEnum } from "../constant"
import { ApiError } from "../utils/ApiError"

const isAdmin = (req,res, next) => {
    if(!req.user.role !== UserRolesEnum.ADMIN){
        throw new ApiError(
            403,
            "Access denied",
        )
    }

    next()
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user?.role)) {
        throw new ApiError(403, "Access denied. Insufficient permissions");
      }
      next();
    };
  };
  


export {
    isAdmin,
    authorizeRoles
}