import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

import { DatabaseModule } from './database/database.module';
import { GeneralModule } from './modules/general.module';
import { CustomValidationPipe } from './pipes/CustomValidation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GeneralModule,
  ],
  controllers: [],
  providers: [{ provide: APP_PIPE, useClass: CustomValidationPipe }],
})
export class AppModule {}
