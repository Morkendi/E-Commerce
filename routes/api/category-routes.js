const router = require('express').Router();
const { Category, Product } = require('../../models');

// `/api/categories` endpoint

// Find all categories
router.get('/', async (req, res) => {
  try {
    const CategoryData = await Category.findAll({
      // Include its associated Products
      include: { 
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      },
    });
    CategoryData ? res.status(200).json(CategoryData) : res.status(404).json({ message: 'No categories found!' });

  } catch (err){
    res.status(500).json(err)
  }});

// Find one category by its `id` value
router.get('/:id', async (req, res) => {
  try {
    const SingleCategory = await Category.findByPk(req.params.id, {
    // Include its associated Products
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    })
    SingleCategory ? res.status(200).json(SingleCategory) : res.status(404).json({ message: 'Category not found!' });

  } catch (err){
    res.status(500).json(err);
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const NewCategory = await Category.create({
      category_name: req.body.category_name
    });
    res.status(200).json(NewCategory);
  } catch (err){
    res.status(500).json(err);
  } 
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const UpdateCategory = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    UpdateCategory ? res.status(200).json(UpdateCategory) : res.status(404).json({ message: 'No category found with this id!' }) 

  } catch (err){
    res.status(500).json(err);
  }
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try{
    const DeleteCategory = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    DeleteCategory ? res.status(200).json(DeleteCategory) : res.status(404).json({ message: 'No category found with this id!' });

  } catch (err){
    res.status(500).json(err);
  }
});

module.exports = router;
