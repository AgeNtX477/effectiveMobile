import { User } from './user.entity';
import AppDataSource from './ormconfig';

const userCount = 500;

async function seed() {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);
  const users: User[] = [];

  for (let i = 0; i < userCount; i++) {
    const user = new User();
    user.firstName = `Имя${i}`;
    user.lastName = `Фамилия${i}`;
    user.age = Math.floor(Math.random() * 100);
    user.gender = Math.random() > 0.5 ? 'Мужской' : 'Женский';
    user.hasProblems = Math.random() > 0.5;

    users.push(user);

    if (users.length === 1000) {
      await userRepository.save(users);
      users.length = 0;
    }
  }

  if (users.length > 0) {
    await userRepository.save(users);
    console.log(`Добавлено ${users.length} пользователей`);
  }

  await AppDataSource.destroy();
}

seed().catch(console.error);
