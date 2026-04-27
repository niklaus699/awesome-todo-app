import express from "express";

const router = express.Router();
// Simple health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Todo app Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;