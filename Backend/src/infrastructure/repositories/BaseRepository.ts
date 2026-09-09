import {
  AnyKeys,
  Document,
  Model,
  QueryFilter,
  UpdateQuery
} from "mongoose";

export abstract class BaseRepository<TDocument extends Document> {
  protected constructor(
    protected readonly model: Model<TDocument>
  ) {}

  protected async createDocument(data: AnyKeys<TDocument>): Promise<TDocument> {
    return this.model.create(data);
  }

  protected async findByIdDocument(id: string): Promise<TDocument | null> {
    return this.model.findById(id).exec();
  }

  protected async findOneDocument(
    filter: QueryFilter<TDocument>
  ): Promise<TDocument | null> {
    return this.model.findOne(filter).exec();
  }

  protected async findManyDocuments(
    filter: QueryFilter<TDocument> = {}
  ): Promise<TDocument[]> {
    return this.model.find(filter).exec();
  }

  protected async updateByIdDocument(
    id: string,
    update: UpdateQuery<TDocument>
  ): Promise<TDocument | null> {
    return this.model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true
      })
      .exec();
  }

  protected async deleteByIdDocument(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  protected async deleteManyDocuments(
    filter: QueryFilter<TDocument>
  ): Promise<number> {
    const result = await this.model.deleteMany(filter).exec();
    return result.deletedCount;
  }

  protected async updateManyDocuments(
    filter: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>
  ): Promise<number> {
    const result = await this.model.updateMany(filter, update).exec();
    return result.modifiedCount;
  }

  protected async existsDocument(
    filter: QueryFilter<TDocument>
  ): Promise<boolean> {
    return (await this.model.exists(filter)) !== null;
  }

  protected async countDocuments(
    filter: QueryFilter<TDocument> = {}
  ): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}