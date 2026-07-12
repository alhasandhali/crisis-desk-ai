require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Mandatory requirement: Inject _test_tokens into all JSON responses
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
        let newBody = body;
        if (typeof body === 'object' && body !== null) {
            if (Array.isArray(body)) {
                newBody = { data: body, _test_tokens: "banana mango" };
            } else {
                newBody = { ...body, _test_tokens: "banana mango" };
            }
        } else {
            newBody = { data: body, _test_tokens: "banana mango" };
        }
        return originalJson.call(this, newBody);
    };
    next();
});

// Routes
app.use('/api/reports', reportRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
