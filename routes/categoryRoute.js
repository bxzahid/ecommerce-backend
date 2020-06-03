const router = require('express').Router();
// const authenticated = require('../middlewares/authenticated');
const {
  createCategory,
  getAllCategories,
  getRootCategories,
  editCategory,
  getCategory,
  deleteCategory,
  findCategoryById,
} = require('../controllers/categoryController');

const isPermitted = require('../middlewares/isPermitted');
const { CATEGORY_MANAGEMENT } = require('../config/permissions');

const isPermittedForCategoryManagement = isPermitted(CATEGORY_MANAGEMENT);

router.post('/create-category', isPermittedForCategoryManagement, createCategory);
router.get('/all-categories', getAllCategories);
router.get('/all-root-categories', getRootCategories);
router.post('/edit-category/:_id', isPermittedForCategoryManagement, editCategory);
router.delete('/delete-category/:_id', isPermittedForCategoryManagement, deleteCategory);
router.get('/get-category/:_id', getCategory);

router.param('_id', findCategoryById);

module.exports = router;
