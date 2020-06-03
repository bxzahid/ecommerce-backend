const router = require('express').Router();
const {
  resendActivationLink,
  activeAccount,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,

  test,
} = require('../controllers/authController');

const authenticated = require('../middlewares/authenticated');

router.get('/resend-activation-link/:_id', resendActivationLink);

router.get('/active-account', activeAccount);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticated, changePassword);
router.get('/logout', authenticated, logout);

router.get('/test', authenticated, test);
// router.get("/test", test);

module.exports = router;
