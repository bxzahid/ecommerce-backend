const router = require('express').Router();
const authenticated = require('../middlewares/authenticated');
const forRootAdmin = require('../middlewares/forRootAdmin');
const {
  createRootAdmin,
  createAdmin,
  getAllAdmins,
  changeRole,
  disableAdmin,
  enableAdmin,
} = require('../controllers/adminController');

router.post('/create-root-admin', createRootAdmin);
router.post('/create-admin', authenticated, forRootAdmin, createAdmin);
router.put('/change-role/:_id', authenticated, forRootAdmin, changeRole);
router.get('/get-all-admins', authenticated, forRootAdmin, getAllAdmins);
router.get('/disable-admin/:_id', authenticated, forRootAdmin, disableAdmin);
router.get('/enable-admin/:_id', authenticated, forRootAdmin, enableAdmin);

module.exports = router;
