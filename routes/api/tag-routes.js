const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// `/api/tags` endpoint

// Find all tags
router.get('/', async (req, res) => {
  try {
    const TagData = await Tag.findAll({
    // Include its associated Product data
      include: {
        model: Product,
        attributes: ['product_name', 'price', 'stock', 'category_id']
      }
    });
    TagData ? res.status(200).json(TagData) : res.status(404).json({ message: 'No tags found!' });

  } catch (err){
    res.status(500).json(err);
  }
});

// Find a single tag by its `id`
router.get('/:id', async (req, res) => {
  try {
    const SingleTag = await Tag.findByPk(req.params.id, {
    // Include its associated Product data
      include: {
        model: Product,
        attributes: ['product_name', 'price', 'stock', 'category_id']
      }
    })
    SingleTag ? res.status(200).json(SingleTag) : res.status(404).json({ message: 'No tag found with this id!' });

  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const NewTag = await Tag.create({
      tag_name: req.body.tag_name
    });
    res.status(200).json(NewTag);

  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const UpdateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    UpdateTag ? res.status(200).json(UpdateTag) : res.status(404).json({ message: 'No tag found with this id!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const DeleteTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    DeleteTag ? res.status(200).json(DeleteTag) : res.status(404).json({ message: 'No tag found with this id!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
