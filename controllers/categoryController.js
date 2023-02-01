const asyncHandler = require('express-async-handler');
const { checkUserDataAuthorization } = require('../services/commonServices');
const {
  getCategoriesService,
  setCategoriesService,
  getCategoryByIdService,
  updateCategoryByIdService,
  deleteCategoryService,
  deleteAlertCategoryService
} = require('../services/categoryServices');

// @desc    Get Categories
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const { id } = req.user;

  try {
    const categories = await getCategoriesService({ user: id }, null, null);
    res.status(200).json(categories);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Set Category
// @route   POST /api/categories
// @access  Private
const setCategory = asyncHandler(async (req, res) => {
  const { categoryname, categorytype, categorydesc, color } = req.body;
  const { id } = req.user;

  if (!categoryname && !categorytype) {
    res.status(400);
    throw new Error('Please fill all field');
  }

  try {
    const category = await setCategoriesService(
      categoryname,
      categorytype,
      categorydesc,
      color,
      id
    );
    res.status(200).json(category);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Update Category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const { categoryname, categorytype, categorydesc, color } = req.body;
  const { user } = req;

  try {
    const category = await getCategoryByIdService(paramid);

    // Category not found
    if (!category) {
      res.status(400);
      throw new Error('Category not found');
    }

    // Check user and make sure the logged in user matches the category user
    const Authorized = await checkUserDataAuthorization(category, user);
    if (!Authorized) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Update category by id
    const updatecategory = await updateCategoryByIdService(
      paramid,
      categoryname,
      categorytype,
      categorydesc,
      color
    );
    res.status(200).json(updatecategory);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Delete Category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const { user } = req;

  try {
    const category = await getCategoryByIdService(paramid);

    // Category not found
    if (!category) {
      res.status(400);
      throw new Error('Category not found');
    }

    // Check user and make sure the logged in user matches the category user
    const Authorized = await checkUserDataAuthorization(category, user);
    if (!Authorized) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Delete category
    await deleteCategoryService(category);
    await deleteAlertCategoryService(user, paramid);

    res.status(200).json({ id: paramid });
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Get Income Categories
// @route   GET /api/incomecategories
// @access  Private

const getCategoriesByType = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { categorytype } = req.params;

  try {
    const categories = await getCategoriesService(
      { user: id, category_type: categorytype },
      null,
      null
    );
    res.status(200).json(categories);
  } catch (e) {
    throw new Error(e.message);
  }
});

module.exports = {
  getCategories,
  setCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByType
};
