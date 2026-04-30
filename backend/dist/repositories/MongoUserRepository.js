"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUserRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const User_1 = require("../models/User");
class MongoUserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_1.User);
    }
    async findByEmail(email) {
        return User_1.User.findOne({ email }).exec();
    }
    async save(user) {
        return user.save();
    }
}
exports.MongoUserRepository = MongoUserRepository;
