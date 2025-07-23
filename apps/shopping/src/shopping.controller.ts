import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ShoppingService } from './shopping.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller()
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  // Cart operations
  @MessagePattern({ cmd: 'add_to_cart' })
  addToCart(@Payload() addToCartDto: AddToCartDto) {
    return this.shoppingService.addToCart(addToCartDto);
  }

  @MessagePattern({ cmd: 'get_cart' })
  getCart(@Payload() customerId: string) {
    return this.shoppingService.getCart(customerId);
  }

  @MessagePattern({ cmd: 'update_cart_item' })
  updateCartItem(@Payload() updateCartItemDto: UpdateCartItemDto) {
    return this.shoppingService.updateCartItem(updateCartItemDto);
  }

  @MessagePattern({ cmd: 'remove_from_cart' })
  removeFromCart(@Payload() payload: { customerId: string; productId: string }) {
    return this.shoppingService.removeFromCart(payload.customerId, payload.productId);
  }

  @MessagePattern({ cmd: 'clear_cart' })
  clearCart(@Payload() customerId: string) {
    return this.shoppingService.clearCart(customerId);
  }

  // Order operations
  @MessagePattern({ cmd: 'create_order' })
  createOrder(@Payload() createOrderDto: CreateOrderDto) {
    return this.shoppingService.createOrder(createOrderDto);
  }

  @MessagePattern({ cmd: 'get_orders' })
  getOrders(@Payload() customerId: string) {
    return this.shoppingService.getOrders(customerId);
  }

  @MessagePattern({ cmd: 'get_order' })
  getOrder(@Payload() orderId: string) {
    return this.shoppingService.getOrder(orderId);
  }

  @MessagePattern({ cmd: 'update_order_status' })
  updateOrderStatus(@Payload() payload: { orderId: string; status: string }) {
    return this.shoppingService.updateOrderStatus(payload.orderId, payload.status);
  }

  @MessagePattern({ cmd: 'cancel_order' })
  cancelOrder(@Payload() orderId: string) {
    return this.shoppingService.cancelOrder(orderId);
  }
}