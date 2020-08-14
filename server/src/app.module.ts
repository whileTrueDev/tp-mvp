import { Module } from '@nestjs/common';
import { CatsModule } from './resources/cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {}
