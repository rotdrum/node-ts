import { User } from '../entities/home.entity';

class UserService {
  async getUsers() {
    return ['User1', 'User2', 'User3'];
  }

  async getUserById(userId: string) {
    return { id: userId, name: 'John Doe' };
  }
}
  
export default new UserService();
  