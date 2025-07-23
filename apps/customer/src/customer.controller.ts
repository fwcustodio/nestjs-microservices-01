import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern({ cmd: 'create_customer' })
  create(@Payload() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @MessagePattern({ cmd: 'get_all_customers' })
  findAll() {
    return this.customerService.findAll();
  }

  @MessagePattern({ cmd: 'get_customer' })
  findOne(@Payload() id: string) {
    return this.customerService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_customer' })
  update(@Payload() payload: { id: string; updateCustomerDto: UpdateCustomerDto }) {
    return this.customerService.update(payload.id, payload.updateCustomerDto);
  }

  @MessagePattern({ cmd: 'delete_customer' })
  remove(@Payload() id: string) {
    return this.customerService.remove(id);
  }

  @MessagePattern({ cmd: 'get_customer_by_email' })
  findByEmail(@Payload() email: string) {
    return this.customerService.findByEmail(email);
  }
}