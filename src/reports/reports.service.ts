import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IGateway } from 'src/common/gateway/interfaces/gateway.interface';
import { INotification } from 'src/common/notification/interfaces/notification.interface';
import { ISensor } from 'src/common/sensor/interfaces/sensor.interface';

@Injectable()
export class ReportsService {


    constructor(
      @InjectModel('Sensor') private readonly appModelSensor: Model<ISensor>,
      @InjectModel('Gateway') private readonly appModelGateway: Model<IGateway>,
      @InjectModel('notification','notifications') private readonly appModelNotification: Model<INotification>
      ) { }

    private readonly logger = new Logger(ReportsService.name);

    async reportsSensors(): Promise<any> {
    this.logger.log(this.reportsSensors.name);

        const report = {
          totalSensor: 0,
          totalGateway: 0,
          totalNotification: 0
        }
        
        try {
          const totalSensor = await this.appModelSensor.collection.countDocuments();
          const totalGateway = await this.appModelGateway.collection.countDocuments();
          const totalNotification = await this.appModelNotification.collection.countDocuments();

          report.totalSensor = totalSensor;
          report.totalGateway = totalGateway;
          report.totalNotification = totalNotification;

          return report

        } catch (error) {
          this.logger.error(`error: ${JSON.stringify(error.message)}`);
          throw new RpcException(error.message);
        }
      }

}
