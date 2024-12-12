import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(PORT, () => {
      console.log(`App listening PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

bootstrap();
