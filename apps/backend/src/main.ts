import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    // Enable CORS
    app.enableCors({
        origin: [
            process.env.FRONTEND_URL,
            'https://tech-bridge-frontend.vercel.app',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ].filter((origin): origin is string => !!origin),
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

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
