const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    shipping: {
      type: Schema.Types.ObjectId,
      ref: 'Shipment',
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    subTotal: Number,
    discount: Number,
    shippingCharge: Number,
    payableAmount: Number,
    orderStatus: String,
    shippingAddress: {
      type: Object,
      trim: true,
    },
    shippingType: String,
    orderTracking: [Object],
    paymentMethod: String,
    paymentStatus: String,
    handledBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    openForPayment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = model('Order', orderSchema);

module.exports = Order;
