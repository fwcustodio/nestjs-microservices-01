import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Order, OrderDocument } from './schemas/order.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async addToCart(addToCartDto: AddToCartDto): Promise<Cart> {
    const { customerId, productId, quantity } = addToCartDto;
    
    let cart = await this.cartModel.findOne({ customerId });
    
    if (!cart) {
      cart = new this.cartModel({ customerId, items: [] });
    }
    
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    
    return cart.save();
  }

  async getCart(customerId: string): Promise<Cart> {
    return this.cartModel.findOne({ customerId });
  }

  async updateCartItem(updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    const { customerId, productId, quantity } = updateCartItemDto;
    
    const cart = await this.cartModel.findOne({ customerId });
    if (!cart) return null;
    
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    }
    
    return cart.save();
  }

  async removeFromCart(customerId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ customerId });
    if (!cart) return null;
    
    cart.items = cart.items.filter(item => item.productId !== productId);
    return cart.save();
  }

  async clearCart(customerId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ customerId });
    if (!cart) return null;
    
    cart.items = [];
    return cart.save();
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel({
      ...createOrderDto,
      status: 'pending',
      total: createOrderDto.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    });
    
    const savedOrder = await order.save();
    
    // Clear cart after creating order
    await this.clearCart(createOrderDto.customerId);
    
    return savedOrder;
  }

  async getOrders(customerId: string): Promise<Order[]> {
    return this.orderModel.find({ customerId }).sort({ createdAt: -1 });
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.orderModel.findById(orderId);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
  }

  async cancelOrder(orderId: string): Promise<Order> {
    return this.orderModel.findByIdAndUpdate(orderId, { status: 'cancelled' }, { new: true });
  }
}