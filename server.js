require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const connectDB = require('./config/db');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply rate limiter to all API routes
app.use('/api/', apiLimiter);

// Swagger Documentation
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
