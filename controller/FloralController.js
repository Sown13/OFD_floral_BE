// controller.js
const express = require('express');
const { Floral } = require('../database/db-config');
const floralController = express.Router();
const floralControllerRoute = "/florals";


//** Get all florals */
floralController.get('', async (req, res) => {
    try {
        // Retrieve query parameters
        const { page = 1, limit = 10, search = '', color, status, price, ...filters } = req.query;

        // Convert page and limit to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Build the filter object based on the search term and other filters
        const filterConditions = {
            ...filters, // Add any other filters directly from query parameters
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }),
            ...(color && { color }), // Filter by color
            ...(status && { status }), // Filter by status
            ...(price && { price: { $lte: parseFloat(price) } }) // Filter by price (less than or equal to)
        };

        // Get the total count of items that match the filter
        const totalItems = await Floral.countDocuments(filterConditions);

        // Fetch the paginated results
        const florals = await Floral.find(filterConditions)
            .limit(limitNumber)
            .skip((pageNumber - 1) * limitNumber);

        // Prepare the response with metaData
        res.json({
            metaData: {
                totalItems,
                totalPages: Math.ceil(totalItems / limitNumber),
                currentPage: pageNumber,
                pageSize: limitNumber
            },
            data: florals
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách hoa', error });
    }
});


/** Find floral by ID */
floralController.get('/:id', async (req, res) => {
    try {
        const floral = await Floral.findById(req.params.id);
        if (!floral) return res.status(404).json({
            message: 'Hoa không tồn tại'
        });
        res.json(floral);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm hoa', error });
    }
});

/** Create new floral */
floralController.post('', async (req, res) => {
    try {
        const newFloral = new Floral(req.body);
        await newFloral.save();
        res.status(201).json(newFloral);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo hoa', error });
    }
});

/** Edit floral */
floralController.put('/:id', async (req, res) => {
    try {
        const updatedFloral = await Floral.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFloral) return res.status(404).json({ message: 'Hoa không tồn tại' });
        res.json(updatedFloral);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật hoa', error });
    }
});

/** Delete floral */
floralController.delete('/:id', async (req, res) => {
    try {
        const deletedFloral = await Floral.findByIdAndDelete(req.params.id);
        if (!deletedFloral) return res.status(404).json({ message: 'Hoa không tồn tại' });
        res.json({ message: 'Hoa đã bị xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa hoa', error });
    }
});


module.exports = {
    floralController,
    floralControllerRoute
};