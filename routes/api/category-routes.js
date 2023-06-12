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
    })
    if (!CategoryData) {
      res.status(404).json({ message: 'No categories found!' });
      return;
    }
    res.status(200).json(CategoryData);
  } catch {err => 
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
    if (!SingleCategory) {
      res.status(404).json({ message: 'Category not found!' });
      return;
    }
    res.status(200).json(SingleCategory);
  } catch {
    res.status(500).json(err);
  }
});

// create a new category
router.post('/', async (req, res) => {
  try{
    const NewCategory = await Category.create({
      category_name: req.body.category_name
    });
    res.status(200).json(NewCategory);
  } catch {
    res.status(500).json(err);
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try{
    const UpdateCategory = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (!UpdateCategory) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }
    res.status(200).json(UpdateCategory);
  } catch {
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

    if (!DeleteCategory) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(DeleteCategory);

  } catch {
    res.status(500).json(err);
  }
});

module.exports = router;
