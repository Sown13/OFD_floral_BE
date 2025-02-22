const express = require('express');
const { Category } = require('../database/db-config'); // Adjust the path as needed
const categoryController = express.Router();
const categoryControllerRoute = "/categories";

/** Middleware to trim and validate slug */
const validateSlug = async (req, res, next) => {
    if (req.body.slug) {
        req.body.slug = req.body.slug.trim(); // Trim whitespace
        const existingCategory = await Category.findOne({ slug: req.body.slug });
        if (existingCategory) {
            return res.status(400).json({ message: 'Slug must be unique' });
        }
    }
    next();
};

/** Get all categories */
categoryController.get('', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});

/** Find a category by ID */
categoryController.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
});

/** Create a new category */
categoryController.post('', validateSlug, async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error creating category', error });
    }
});

/** Update a category */
categoryController.put('/:id', validateSlug, async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error updating category', error });
    }
});

/** Delete a category */
categoryController.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
});

module.exports = {
    categoryController,
    categoryControllerRoute
};