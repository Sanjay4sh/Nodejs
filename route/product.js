import express from 'express';
const router = express.Router();

import { AddProduct, GetProduct, UploadImage } from '../controller/ProductController.js';
import { AuthMid } from '../middleware/AuthMid.js';

router.post('/add', AuthMid, AddProduct);
router.get('/', AuthMid, GetProduct);
router.post('/UploadImage', UploadImage);

export default router;