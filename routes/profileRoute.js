const router = require('express').Router();
const authenticated = require('../middlewares/authenticated');
const { edit, getProfile } = require('../controllers/profileController');

router.get('/profile', authenticated, getProfile);
router.put('/edit', authenticated, edit);

module.exports = router;
