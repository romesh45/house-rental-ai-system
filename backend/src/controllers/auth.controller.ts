import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

export class AuthController {
  static validateRegister = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('role').isIn(['tenant', 'owner']).withMessage('Role must be either tenant or owner')
  ];

  static validateLogin = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ];

  static async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, full_name, phone, role } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userId = await UserModel.create({
        email,
        password: hashedPassword,
        full_name,
        phone: phone || null,
        role: role || 'tenant'
      });

      const jwtSecret = process.env.JWT_SECRET || 'secret';
      const token = jwt.sign(
        { id: userId, email, role: role || 'tenant' },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      const user = await UserModel.findById(userId);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user
      });
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const jwtSecret = process.env.JWT_SECRET || 'secret';
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  static async getProfile(req: any, res: Response) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  static async updateProfile(req: any, res: Response) {
    try {
      const { full_name, phone } = req.body;
      const updates: any = {};

      if (full_name) updates.full_name = full_name;
      if (phone) updates.phone = phone;

      const success = await UserModel.update(req.user.id, updates);
      if (!success) {
        return res.status(400).json({ message: 'Update failed' });
      }

      const user = await UserModel.findById(req.user.id);
      res.json({ message: 'Profile updated successfully', user });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }
}
