import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './snake-naming.strategy';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          url: configService.getOrThrow('DATABASE_URL'),
          autoLoadEntities: true,
          logging: configService.get<boolean>('DATABASE_LOGGING', true),
          synchronize: configService.get<boolean>(
            'DATABASE_SYNCHRONIZE_MAIN',
            true
          ),
          type: configService.get('DATABASE_TYPE', 'postgres'),
          namingStrategy: new SnakeNamingStrategy(),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: ['dist/migrations/*{.ts,.js}'],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
