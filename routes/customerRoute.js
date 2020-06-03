const router = require('express').Router();
const authenticated = require('../middlewares/authenticated');
const isPermitted = require('../middlewares/isPermitted');
const { CUSTOMER_MANAGEMENT } = require('../config/permissions');

const isPermittedForCustomerManagement = isPermitted(CUSTOMER_MANAGEMENT);

const {
  createCustomer,
  getAllCustomers,
  disableCustomer,
  enableCustomer,
} = require('../controllers/customerController');

router.post('/create-customer', createCustomer);
router.get('/get-all-customers', authenticated, isPermittedForCustomerManagement, getAllCustomers);
router.get('/disable-customer/:_id', authenticated, isPermittedForCustomerManagement, disableCustomer);
router.get('/enable-customer/:_id', authenticated, isPermittedForCustomerManagement, enableCustomer);

module.exports = router;
