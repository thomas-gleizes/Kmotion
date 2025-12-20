import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConverterHttpService } from 'src/core/converter/converter-http.service';
import { environment } from 'src/core/config/environment';

@Module({
  imports: [
    HttpModule.register({
      baseURL: environment.CONVERTER_URL,
      headers: {
        'Content-Type': 'application/json',
        API_KEY: environment.CONVERTER_KEY,
      },
    }),
  ],
  providers: [ConverterHttpService],
  exports: [ConverterHttpService],
})
export class ConverterModule {}
