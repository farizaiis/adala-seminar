/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SeminarModule } from './seminar/seminar.module';
import { ParticipantModule } from './participant/participant.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl: {
        rejectUnauthorized: false,
      },
      host: process.env.DB_PROD_HOST || process.env.DB_LOCAL_HOST,
      port: 5432,
      username: process.env.DB_PROD_USERNAME || process.env.DB_LOCAL_USERNAME,
      password: process.env.DB_PROD_PASSWORD || process.env.DB_LOCAL_PASSWORD,
      database: process.env.DB_PROD_NAME || process.env.DB_LOCAL_NAME,
      entities: ['dist/**/*.entity{.ts,.js'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    SeminarModule,
    ParticipantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
