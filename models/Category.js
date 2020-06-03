const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const commonType = {
  type: String,
  trim: true,
  default: '',
};

const categorySchema = new Schema(
  {
    title: commonType,
    heroImage: commonType,
    bannerImage: commonType, // For making page banner
    thumbnail: commonType, // thumbnail for the category
    slug: commonType,
    seo: {
      pageTitle: commonType,
      metaDescription: commonType,
      metaKeywords: [commonType],
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    path: commonType,

    subcats: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// eslint-disable-next-line func-names
categorySchema.pre('save', function(next) {
  this.slug = this.title
    .split(' ')
    .join('_')
    .toLowerCase();
  this.path = `category/${this.slug}`;
  next();
});

function autoPopulateSubcats(next) {
  if (this.getQuery().isRoot || this.getQuery()._id) {
    this.populate('subcats');
  }
  next();
}

function autoPopulateSubcatsFindOne(next) {
  this.populate('subcats');

  next();
}

categorySchema.pre('findOne', autoPopulateSubcatsFindOne).pre('find', autoPopulateSubcats);

module.exports = model('Category', categorySchema);
