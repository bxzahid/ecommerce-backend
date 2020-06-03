const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [String],
    price: {
      purchasedPrice: Number,
      sellPrice: Number,
      discount: Number,
    },
    itemsInStock: Number,
    sold: {
      type: Number,
      default: 0,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    hotDeal: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProductReview',
      },
    ],
    brand: String,
    options: [Object],
    slug: String,
    buyers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
      },
    ],
    coupon: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
      },
    ],
    status: {
      type: String,
      default: 'pending',
      values: ['Open', 'Pending'],
    },
  },
  {
    timestamps: true,
  }
);

const Product = model('Product', productSchema);

module.exports = Product;
