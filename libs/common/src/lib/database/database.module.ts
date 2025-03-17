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
          url: configService.getOrThrow('DATABSE_URL'),
          autoLoadEntities: false,
          logging: !!configService.get('DATABASE_LOGGING'),
          synchronize: configService.get('DATABASE_SYNCHRONIZE_MAIN', true),
          type: configService.get('DATABASE_TYPE', 'postgres'),
          namingStrategy: new SnakeNamingStrategy(),
          entities: ['dist/**/*.entity.js'],
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
