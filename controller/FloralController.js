// controller.js
const express = require('express');
const { Floral } = require('../database/db-config');
const floralController = express.Router();
const floralControllerRoute = "/florals";


/** Get all florals */
floralController.get('', async (req, res) => {
    try {
        const florals = await Floral.find();
        res.json(florals);
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