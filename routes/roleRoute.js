const router = require('express').Router();
const forRootAdmin = require('../middlewares/forRootAdmin');
const authenticated = require('../middlewares/authenticated');
const {
  createRole,
  findRoleById,
  getRole,
  getRoles,
  editRole,
  modifyPermissions,
  deleteRole,
} = require('../controllers/roleController');

router.get('/get-role/:_id', authenticated, getRole);
router.get('/get-roles', authenticated, forRootAdmin, getRoles);
router.post('/create-role', authenticated, forRootAdmin, createRole);
router.put('/edit-role/:_id', authenticated, forRootAdmin, editRole);
router.put('/modify-permissions/:_id', authenticated, forRootAdmin, modifyPermissions);
router.delete('/delete-role/:_id', authenticated, forRootAdmin, deleteRole);

router.param('_id', findRoleById);

module.exports = router;
