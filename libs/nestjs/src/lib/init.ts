import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function initApp(
  app: INestApplication,
  options: {
    globalPrefix?: string;
    docs: {
      title: string;
      description: string;
      tagName: string;
      endpoint?: string;
    };
  }
) {
  const { globalPrefix = 'api', docs } = options;
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix(globalPrefix);
  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle(docs.title)
    .setDescription(docs.description)
    .setVersion('1.0')
    .addTag(docs.tagName)
    .addBearerAuth()
    .addCookieAuth('Authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const docsUrl = docs.endpoint ?? 'docs';
  SwaggerModule.setup(docsUrl, app, document);

  const port = app.get(ConfigService).getOrThrow('PORT');
  await app.listen(port);
  app.get(Logger).log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}:
      📖 docs: [${docs.tagName}] is running on: http://localhost:${port}/${docsUrl}
      `
  );
}
