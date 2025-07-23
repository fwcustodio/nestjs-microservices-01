import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'get_all_products' })
  findAll(@Payload() query?: any) {
    return this.productsService.findAll(query);
  }

  @MessagePattern({ cmd: 'get_product' })
  findOne(@Payload() id: string) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() payload: { id: string; updateProductDto: UpdateProductDto }) {
    return this.productsService.update(payload.id, payload.updateProductDto);
  }

  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload() id: string) {
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: 'search_products' })
  search(@Payload() searchTerm: string) {
    return this.productsService.search(searchTerm);
  }

  @MessagePattern({ cmd: 'get_products_by_category' })
  findByCategory(@Payload() category: string) {
    return this.productsService.findByCategory(category);
  }

  @MessagePattern({ cmd: 'update_stock' })
  updateStock(@Payload() payload: { id: string; quantity: number }) {
    return this.productsService.updateStock(payload.id, payload.quantity);
  }
}