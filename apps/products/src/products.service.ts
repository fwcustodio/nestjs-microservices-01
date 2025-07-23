import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(query?: any): Promise<Product[]> {
    const filter = {};
    if (query?.category) filter['category'] = query.category;
    if (query?.minPrice) filter['price'] = { $gte: query.minPrice };
    if (query?.maxPrice) {
      if (filter['price']) {
        filter['price']['$lte'] = query.maxPrice;
      } else {
        filter['price'] = { $lte: query.maxPrice };
      }
    }
    
    return this.productModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async search(searchTerm: string): Promise<Product[]> {
    return this.productModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
      ],
    }).exec();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel.find({ category }).exec();
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    return this.productModel.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true }
    ).exec();
  }
}