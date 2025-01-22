import { isAdmin } from "../middleware/isAdmin.js";



router.get("/update-role", isAdmin, updateUserRole)
// router.route('/auth/refresh-token').post(refereshAccessToken)