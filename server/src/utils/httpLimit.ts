import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 30,
    handler: (req, res) => {
        res.status(429).send("Too many messages sent, please try again later.");
    },
});
