import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('shopping')
@UseGuards(JwtAuthGuard)
export class ShoppingController {
  constructor(
    @Inject('SHOPPING_SERVICE') private shoppingService: ClientProxy,
  ) {}

  // Cart endpoints
  @Post('cart')
  addToCart(@Body() addToCartDto: any) {
    return this.shoppingService.send({ cmd: 'add_to_cart' }, addToCartDto);
  }

  @Get('cart/:customerId')
  getCart(@Param('customerId') customerId: string) {
    return this.shoppingService.send({ cmd: 'get_cart' }, customerId);
  }

  @Patch('cart')
  updateCartItem(@Body() updateCartItemDto: any) {
    return this.shoppingService.send({ cmd: 'update_cart_item' }, updateCartItemDto);
  }

  @Delete('cart/:customerId/:productId')
  removeFromCart(@Param('customerId') customerId: string, @Param('productId') productId: string) {
    return this.shoppingService.send({ cmd: 'remove_from_cart' }, { customerId, productId });
  }

  @Delete('cart/:customerId')
  clearCart(@Param('customerId') customerId: string) {
    return this.shoppingService.send({ cmd: 'clear_cart' }, customerId);
  }

  // Order endpoints
  @Post('orders')
  createOrder(@Body() createOrderDto: any) {
    return this.shoppingService.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get('orders/:customerId')
  getOrders(@Param('customerId') customerId: string) {
    return this.shoppingService.send({ cmd: 'get_orders' }, customerId);
  }

  @Get('order/:orderId')
  getOrder(@Param('orderId') orderId: string) {
    return this.shoppingService.send({ cmd: 'get_order' }, orderId);
  }

  @Patch('order/:orderId/status')
  updateOrderStatus(@Param('orderId') orderId: string, @Body('status') status: string) {
    return this.shoppingService.send({ cmd: 'update_order_status' }, { orderId, status });
  }

  @Delete('order/:orderId')
  cancelOrder(@Param('orderId') orderId: string) {
    return this.shoppingService.send({ cmd: 'cancel_order' }, orderId);
  }
}