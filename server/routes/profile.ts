import express, { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const router: Router = express.Router();

// Middleware to verify JWT token
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user profile
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user profile
router.put('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, location, bio } = req.body;
    
    // Find user
    const user = await User.findById(req.userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Update user fields
    user.name = fullName || user.name;
    user.email = email || user.email;
    
    // Add new fields to the user model
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bio: user.bio
      }
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }
    
    res.status(500).json({ 
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update password
router.put('/password', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current password and new password are required' });
      return;
    }
    
    // Find user
    const user = await User.findById(req.userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Password update error:', error);
    res.status(500).json({ 
      message: 'Error updating password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router; 