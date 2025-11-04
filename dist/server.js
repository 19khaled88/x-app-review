"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const review_1 = require("./services/review");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Home route 
app.get('/', (req, res) => {
    try {
        res.json({ success: true, status: 'OK', timestamp: new Date().toISOString() });
    }
    catch (error) {
        res.json({ success: false, status: '201' });
    }
});
// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// get all reviews
app.get('/reiews/all', async (req, res) => {
    try {
        const result = await (0, review_1.getAllReviews)();
        if (result.success) {
            return res.status(201).json(result);
        }
        else {
            const statusCode = result.error === 'Error unknown' ? 400 : 500;
            return res.status(statusCode).json(result);
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});
// create review
app.post('/reviews/create', async (req, res) => {
    try {
        const result = await (0, review_1.createReviews)(req.body);
        if (result.success) {
            return res.status(201).json(result);
        }
        else {
            const statusCode = result.error === 'Validation failed' ? 400 : 500;
            return res.status(statusCode).json(result);
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map