const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// `/api/products` endpoint

// Get all products
router.get('/', async (req, res) => {
  // Find all products
  try {
    const ProductData = await Product.findAll({
      attributes: ['id', 'product_name', 'price', 'stock'],
    // Include its associated Category and Tag data
      include: [{
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Tag,
        attributes: ['tag_name']
      }]
    });
    ProductData ? res.status(200).json(ProductData) : res.status(404).json({ message: 'No products found!' });

  } catch (err){
    res.status(500).json(err);
  }
});

// Get one product
router.get('/:id', async (req, res) => {
  // Find a single product by its `id`
  try {
    const SingleProduct = await Product.findByPk(req.params.id, {
      attributes: ['id', 'product_name', 'price', 'stock'],
    // Include its associated Category and Tag data
      include: [{
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Tag,
        attributes: ['tag_name']
      }]
    });
    SingleProduct ? res.status(200).json(SingleProduct) : res.status(404).json({ message: 'No product found!' });

  } catch (err){
    res.status(500).json(err);
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const NewProduct = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      tagIds: req.body.tagIds
    });

    // If there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: Product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // If no product tags, just respond
    res.status(200).json(productTagIds)
    res.status(200).json(NewProduct);

  } catch (err){
    res.status(400).json(err);
  }
});

// Update product
// Refactor to use async & await
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.update(req.body, {
      where: {
      id: req.params.id,
      },
  });
  
  if (req.body.tagIds && req.body.tagIds.length) {
    const productTags = await ProductTag.findAll({
      where: { 
        product_id: req.params.id 
      }
    });
    
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
    
    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
  }
  return res.json(product);
  
} catch (err){
  res.status(400).json(err);
  }
  });

// Delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const DeleteProduct = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    DeleteProduct ? res.status(200).json(DeleteProduct) : res.status(404).json({ message: 'No product found!' });

  } catch (err){
    res.status(500).json(err);
  }
});

module.exports = router;
