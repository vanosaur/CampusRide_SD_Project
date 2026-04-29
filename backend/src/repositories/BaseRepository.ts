import mongoose, { Document, Model } from 'mongoose';
import { IBaseRepository } from './interfaces';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async findById(id: string | mongoose.Types.ObjectId): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  public async findAll(filter: object = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  public async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  public async delete(id: string | mongoose.Types.ObjectId): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
