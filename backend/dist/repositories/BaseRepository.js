"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async findAll(filter = {}) {
        return this.model.find(filter).exec();
    }
    async create(data) {
        return this.model.create(data);
    }
    async delete(id) {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}
exports.BaseRepository = BaseRepository;
