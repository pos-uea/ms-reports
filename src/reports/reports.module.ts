import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorSchema } from 'src/common/sensor/interfaces/sensor.schema';
import { GatewaySchema } from 'src/common/gateway/interfaces/gateway.schema';
import { NotificationSchema } from 'src/common/notification/interfaces/notification.schema';
import { SensorDataSchema } from 'src/common/sensor-data/interfaces/sensor-data.schema';

const password = encodeURIComponent("Jujutsu@2024");

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Sensor', schema: SensorSchema}]),
    MongooseModule.forFeature([{ name: 'Sensor_Data', schema: SensorDataSchema }]),
    MongooseModule.forFeature([{name: 'Gateway', schema: GatewaySchema}]),
    MongooseModule.forRoot(`mongodb+srv://salomaocalheiros:${password}@cluster0.qpzlosd.mongodb.net/notifications?retryWrites=true&w=majority`,{
      connectionName: 'notifications'
    }),
    MongooseModule.forFeature([{name: 'notification', schema: NotificationSchema}], 'notifications'),
    
  ],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
