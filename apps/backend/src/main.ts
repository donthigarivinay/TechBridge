import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    // Enable CORS
    app.enableCors({
        origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
    });

    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('B.Tech Freelancing API')
        .setDescription('Managed career ecosystem for engineering graduates')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3001);
}
bootstrap();
