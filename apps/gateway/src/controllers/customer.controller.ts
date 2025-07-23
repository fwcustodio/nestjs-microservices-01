import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(
    @Inject('CUSTOMER_SERVICE') private customerService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createCustomerDto: any) {
    return this.customerService.send({ cmd: 'create_customer' }, createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customerService.send({ cmd: 'get_all_customers' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.send({ cmd: 'get_customer' }, id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.customerService.send({ cmd: 'get_customer_by_email' }, email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.customerService.send({ cmd: 'update_customer' }, { id, updateCustomerDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.send({ cmd: 'delete_customer' }, id);
  }
}