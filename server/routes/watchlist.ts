import express, { Request, Response } from 'express';
import Watchlist from '../models/Watchlist';
import { authMiddleware } from './auth'; // We'll need to export this from auth.ts

const router = express.Router();

// Get user's watchlist
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.userId });
    res.json(watchlist?.items || []);
  } catch (error: any) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({
      message: 'Error fetching watchlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add stock to watchlist
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { symbol, companyName } = req.body;

    if (!symbol || !companyName) {
      return res.status(400).json({ message: 'Symbol and company name are required' });
    }

    let watchlist = await Watchlist.findOne({ userId: req.userId });

    if (!watchlist) {
      // Create new watchlist if it doesn't exist
      watchlist = new Watchlist({
        userId: req.userId,
        items: [{
          symbol,
          companyName,
          addedAt: new Date()
        }]
      });
    } else {
      // Check if stock already exists in watchlist
      const stockExists = watchlist.items.some(item => item.symbol === symbol);
      if (stockExists) {
        return res.status(400).json({ message: 'Stock already in watchlist' });
      }

      // Add new stock to watchlist
      watchlist.items.push({
        symbol,
        companyName,
        addedAt: new Date()
      });
    }

    await watchlist.save();
    res.json(watchlist.items);
  } catch (error: any) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({
      message: 'Error adding to watchlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Remove stock from watchlist
router.delete('/:symbol', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const watchlist = await Watchlist.findOne({ userId: req.userId });

    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    // Remove stock from items array
    watchlist.items = watchlist.items.filter(item => item.symbol !== symbol);
    await watchlist.save();

    res.json(watchlist.items);
  } catch (error: any) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({
      message: 'Error removing from watchlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router; 