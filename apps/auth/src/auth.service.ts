import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    const { email, password, ...userData } = registerDto;
    
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      ...userData,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = this.jwtService.sign({ 
      sub: savedUser._id, 
      email: savedUser.email 
    });

    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    const { email, password } = loginDto;
    
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ 
      sub: user._id, 
      email: user.email 
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userModel.findById(payload.sub).select('-password');
      return { valid: true, user };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async getUserProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userModel.findById(userId).select('-password');
    return user?.toObject();
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<{ success: boolean }> {
    const { userId, currentPassword, newPassword } = changePasswordDto;
    
    const user = await this.userModel.findById(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new UnauthorizedException('Invalid current password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(userId, { password: hashedNewPassword });

    return { success: true };
  }

  async refreshToken(userId: string): Promise<{ token: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = this.jwtService.sign({ 
      sub: user._id, 
      email: user.email 
    });

    return { token };
  }

  async logout(token: string): Promise<{ success: boolean }> {
    // In a production environment, you might want to maintain a blacklist of tokens
    // For now, we'll just return success
    return { success: true };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user.toObject();
      return result;
    }
    return null;
  }
}