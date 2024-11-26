import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3333',
  ]

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Origem não permitida pelo CORS'))
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('Agendamento Reunião')
    .setDescription('Agendamento Reunião')
    .setVersion('1.0')
    .addTag('Agendamento Reunião')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(port)
}
bootstrap()
