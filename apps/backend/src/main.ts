import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: (origin, callback) => {
            // Allow all origins for dev/testing
            callback(null, true);
        },
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('B.Tech Freelancing API')
        .setDescription('Managed career ecosystem for engineering graduates')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Root route for health check
    const server = app.getHttpAdapter();
    server.get('/', (req, res) => {
        res.json({
            status: 'TechBridge Backend is running',
            docs: '/api/docs',
            timestamp: new Date().toISOString()
        });
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
