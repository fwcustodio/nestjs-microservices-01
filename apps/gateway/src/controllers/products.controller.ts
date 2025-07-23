import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCTS_SERVICE') private productsService: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: any) {
    return this.productsService.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.send({ cmd: 'get_all_products' }, query);
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.productsService.send({ cmd: 'search_products' }, searchTerm);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.productsService.send({ cmd: 'get_products_by_category' }, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.send({ cmd: 'get_product' }, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.send({ cmd: 'update_product' }, { id, updateProductDto });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/stock')
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.send({ cmd: 'update_stock' }, { id, quantity });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.send({ cmd: 'delete_product' }, id);
  }
}