const Category = require('../models/categoryModel');

const getCategoryByIdService = async (id) => {
  const category = await Category.findById(id);
  return category;
};

const getCategoriesService = async (query, projection, option) => {
  const categories = await Category.find(query, projection, option);
  return categories;
};

const setCategoriesService = async (categoryname, categorytype, categorydesc, color, id) => {
  const category = await Category.create({
    category_name: categoryname,
    category_type: categorytype,
    category_desc: categorydesc,
    color,
    user: id
  });
  return category;
};

const updateCategoryByIdService = async (id, categoryname, categorytype, categorydesc, color) => {
  const category = await Category.findByIdAndUpdate(
    id,
    {
      category_name: categoryname,
      category_type: categorytype,
      category_desc: categorydesc,
      color
    },
    {
      new: true
    }
  );
  return category;
};

const deleteCategoryService = async (dataobject) => {
  await dataobject.remove();
};

module.exports = {
  getCategoryByIdService,
  getCategoriesService,
  setCategoriesService,
  updateCategoryByIdService,
  deleteCategoryService
};
