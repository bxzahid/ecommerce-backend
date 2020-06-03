const dotNotationTool = require('mongo-dot-notation-tool');
const Category = require('../models/Category');
const AppError = require('../utils/errors/AppError');

const getCategory = async ({ title, slug, _id }) => {
  let category = null;
  if (title) {
    category = await Category.findOne({ title });

    return category;
  }
  if (slug) {
    category = await Category.findOne({ slug });
    return category;
  }
  if (_id) {
    category = await Category.findById(_id);
    return category;
  }

  return category;
};

/* ======================================================================================
/* =============================== Find category by id (middleware)======================
/* ====================================================================================== */
exports.findCategoryById = async (req, res, next, _id) => {
  try {
    const category = await getCategory({ _id });

    if (!category) throw new AppError('Category not found', 404);

    req.category = category;
    return next();
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Create category ======================================
/* ====================================================================================== */
exports.createCategory = async (req, res, next) => {
  try {
    const { title, thumbnail, heroImage, bannerImage, seo, parent } = req.body;

    // If title is not provide
    if (!title) throw new AppError('Invalid credential', 400, { title: 'Title is required' });

    // If title is exist
    if (await getCategory({ title })) throw new AppError('Title is exist', 400);

    const category = new Category({
      title,
      heroImage,
      bannerImage,
      thumbnail,
      seo,
    });

    // If this is a sub category then add id into parent child's category
    if (parent) {
      const parentCategory = await Category.findById(parent);
      parentCategory.subcats.push(category._id);
      await parentCategory.save();
    }

    // If parent is null then it'll be a root category
    if (!parent) {
      category.isRoot = true;

      category.order = (await Category.find({ isRoot: true })).length + 1;
    }

    await category.save();

    return res.status(201).json({
      message: 'Category created successfully',
    });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Get categories ===========================================
/* ====================================================================================== */
exports.getRootCategories = async (req, res, next) => {
  try {
    const allCategory = await Category.find({ isRoot: true }).sort({ order: 'asc' });
    // If no category found
    if (allCategory.length < 1) throw new AppError('There is no category', 404);

    return res.status(200).json(allCategory);
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Get categories ===========================================
/* ====================================================================================== */
exports.getAllCategories = async (req, res, next) => {
  try {
    const allCategories = await Category.find();
    // If no category found
    if (allCategories.length < 1) throw new AppError('There is no category', 404);

    return res.status(200).json(allCategories);
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Edit Category ===========================================
/* ====================================================================================== */
exports.editCategory = async (req, res, next) => {
  try {
    req.category.set(dotNotationTool.encode(req.body));

    await req.category.save();
    return res.status(200).json(req.category);
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Delete Category ===========================================
/* ====================================================================================== */
exports.deleteCategory = async (req, res, next) => {
  try {
    const { category } = req;

    // If category doesn't have any sub category then  delete it
    if (category.subcats.length === 0) {
      await category.remove();
    }

    // If category has sub category then also  remove the sub categories
    const stack = [];
    if (category.subcats.length > 0) {
      stack.push(category);
      while (stack.length > 0) {
        const currentCategory = stack.pop();

        // Go through all sub category of current category if current category has sub category the add it to the stack for next cycle
        currentCategory.subcats.map(async subcat => {
          if (subcat.subcats.length === 0) {
            await subcat.remove();
            return false;
          }

          return stack.push(subcat);
        });

        currentCategory.remove();
      }
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
/* ======================================================================================
/* =============================== get Category ===========================================
/* ====================================================================================== */
exports.getCategory = async (req, res) => res.status(200).json(req.category);
