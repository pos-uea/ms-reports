import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ReportsModule } from './reports/reports.module';
import { SensorSchema } from './common/sensor/interfaces/sensor.schema';
import { SensorDataSchema } from './common/sensor-data/interfaces/sensor-data.schema';
import { GatewaySchema } from './common/gateway/interfaces/gateway.schema';
import { NotificationSchema } from './common/notification/interfaces/notification.schema';

const password = encodeURIComponent("Jujutsu@2024");

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production':'.env.development',
      isGlobal: true
    }),
    MongooseModule.forRoot(`mongodb+srv://salomaocalheiros:${password}@cluster0.qpzlosd.mongodb.net/sensors?retryWrites=true&w=majority`),
    MongooseModule.forRoot(`mongodb+srv://salomaocalheiros:${password}@cluster0.qpzlosd.mongodb.net/notifications?retryWrites=true&w=majority`,{
      connectionName: 'notifications'
    }),
    MongooseModule.forFeature([{ name: 'Sensor', schema: SensorSchema }]),
    MongooseModule.forFeature([{ name: 'Sensor_Data', schema: SensorDataSchema }]),
    MongooseModule.forFeature([{ name: 'Gateway', schema: GatewaySchema }]),
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }], 'notifications'),
    ReportsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
