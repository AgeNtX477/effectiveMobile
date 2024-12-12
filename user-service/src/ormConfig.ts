import { User } from './user.entity';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'your_password',
  database: 'userservice',
  entities: [User],
  synchronize: true,
});

export default AppDataSource;
