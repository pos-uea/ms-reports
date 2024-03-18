const tracer = require('./tracer')
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import * as moment from "moment"; 

const logger = new Logger('Main');

const user = process.env.RMQ_USER
const password = encodeURIComponent(process.env.RMQ_PASSWORD)
const host = process.env.RMQ_URL
const protocol = process.env.RMQ_PROTOCOLO

async function bootstrap() {

  await tracer;
  
  const app = await NestFactory.createMicroservice(AppModule,
    {
    transport: Transport.RMQ,
    options: {
      urls: [`${protocol}://${user}:${password}@${host}`],
      noAck: false,
      queue: 'reports'
    },
  }
  );

 
 
  console.log('DATA', moment().isoWeek());  

  await app.listen().then(() => {
    logger.log('Microservice is listening.',process.env.NODE_ENV,process.env.RMQ_URL);
  });

}
bootstrap();
