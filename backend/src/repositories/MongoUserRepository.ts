import { BaseRepository } from './BaseRepository';
import { IUserRepository } from './interfaces';
import { User, IUser } from '../models/User';

export class MongoUserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  public async save(user: IUser): Promise<IUser> {
    return user.save();
  }
}
