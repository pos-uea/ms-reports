import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { IGateway } from 'src/common/gateway/interfaces/gateway.interface';
import { INotification } from 'src/common/notification/interfaces/notification.interface';
import { ISensorData } from 'src/common/sensor-data/interfaces/sensor-data.interface';
import { ISensor } from 'src/common/sensor/interfaces/sensor.interface';
import * as moment from "moment";
import * as mtz from 'moment-timezone';



@Injectable()
export class ReportsService {



  constructor(
    @InjectModel('Sensor') private readonly appModelSensor: Model<ISensor>,
    @InjectModel('Sensor_Data') private readonly appModelSensorData: Model<ISensorData>,
    @InjectModel('Gateway') private readonly appModelGateway: Model<IGateway>,
    @InjectModel('notification', 'notifications') private readonly appModelNotification: Model<INotification>
  ) { }

  private readonly logger = new Logger(ReportsService.name);

  async reportsSensors(): Promise<any> {
    this.logger.log(this.reportsSensors.name);

    const report = {
      totalSensor: 0,
      totalSensorData: 0,
      totalGateway: 0,
      totalNotification: 0,
      totalNotificationDay: 0,
      totalSensorDataDay: 0,
      totalSensorDataWeek: 0,
      totalSensorDataMonth: 0,
      Sensordata: { Data: [] },
      SensorDataGroupByWeek: { Data: [] },
      NotificationGroupByWeek: { Data: [] },
      SensorDataSinteticValuesWeek: { Data: [] },
      SensorDataSinteticValuesMonth: { Data: [] },
    }

    try {
      const totalSensor = await this.appModelSensor.collection.countDocuments();
      const totalSensorData = await this.appModelSensorData.collection.countDocuments();
      const totalGateway = await this.appModelGateway.collection.countDocuments();
      const totalNotification = await this.appModelNotification.collection.countDocuments();

      const dataToday = new Date(new Date().toISOString().split('T')[0]);

      const totalNotificationDay = await this.appModelNotification.collection.countDocuments(
        {
          createdAt: {
            $gte: new Date(new Date(dataToday).setHours(0, 0, 0)),
            $lte: new Date(new Date(dataToday).setHours(23, 59, 59))
          }
        }
      );

      const totalSensorDataDay = await this.appModelSensorData.collection.countDocuments(
        {
          createdAt: {
            $gte: new Date(new Date(dataToday).setHours(0, 0, 0)),
            $lte: new Date(new Date(dataToday).setHours(23, 59, 59))
          }
        }
      );

      const totalSensorDataWeek = await this.appModelSensorData.collection.countDocuments(
        {
          $and: [
            {
              week: {
                $eq: moment().isoWeek()
              }
            },
            {
              year: {
                $eq: moment().year()
              }
            }
          ]
        }
      );

      const totalSensorDataMonth = await this.appModelSensorData.collection.countDocuments(
        {
          $and: [
            {
              month: {
                $eq: moment().month() + 1
              }
            },
            {
              year: {
                $eq: moment().year()
              }
            }
          ]
        }
      );

      const sensorData = await this.appModelSensorData.aggregate(
        [
          {
            $project: {
              _id: 0,
              value: 1,
              createdAt: 1,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $limit: 1000,
          },
        ]
      );

      const SensorDataGroupByWeek = await this.appModelSensorData.aggregate(
        [
          {
            $match: {
              $and: [
                {
                  week: {
                    $eq: moment().isoWeek()
                  }
                },
                {
                  year: {
                    $eq: moment().year()
                  }
                }
              ]
            }
          }, {
            $group: {
              _id: {
                $dayOfWeek: '$createdAt'
              },
              qtd: {
                $count: {}
              }
            }
          },
          {
            $sort: {
              _id: 1
            }
          }
        ]
      );

      const NotificationGroupByWeek = await this.appModelNotification.aggregate(
        [
          {
            $match: {
              $and: [
                {
                  week: {
                    $eq: moment().isoWeek()
                  }
                },
                {
                  year: {
                    $eq: moment().year()
                  }
                }
              ]
            }
          }, {
            $group: {
              _id: {
                $dayOfWeek: '$createdAt'
              },
              qtd: {
                $count: {}
              }
            }
          },
          {
            $sort: {
              _id: 1
            }
          }
        ]
      );

      const SensorDataSinteticValuesWeek = await this.appModelSensorData.aggregate(
        [
          {
            $match: {
              $and: [{ week: { $eq: moment().isoWeek() } },
              { year: { $eq: moment().year() } }]
            }
          },
          {
            $group: {
              _id: 0,
              qtd: { $count: {} },
              max: { $max: "$value" },
              min: { $min: "$value" },
              avg: { $avg: "$value" },
            }
          },
          { $sort: { _id: 1 } }
        ]
      );

      const SensorDataSinteticValuesMonth = await this.appModelSensorData.aggregate(
        [ 
          {
            $match: {
              $and: [{ month: { $eq: moment().month() + 1 } },
              { year: { $eq: moment().year() } }]
            }
          },
          {
            $group: {
              _id: 0,
              qtd: { $count: {} },
              max: { $max: "$value" },
              min: { $min: "$value" },
              avg: { $avg: "$value" },
            }
          },
          {
            $project: {
               _id:0,
                qtd:1,
                max:1,
                min:1,
                avg:1,
                texts: ["qtd","max","min","avg"],
                values:["$qtd","$max","$min","$avg"],

            }
         },
          { $sort: { _id: 1 } }
        ]
      );


      report.totalSensor = totalSensor;
      report.totalSensorData = totalSensorData;
      report.totalGateway = totalGateway;
      report.totalNotification = totalNotification;

      report.totalNotificationDay = totalNotificationDay;
      report.totalSensorDataDay = totalSensorDataDay;
      report.totalSensorDataWeek = totalSensorDataWeek;
      report.totalSensorDataMonth = totalSensorDataMonth;
      report.Sensordata.Data = sensorData;

      report.SensorDataGroupByWeek.Data = SensorDataGroupByWeek;
      report.NotificationGroupByWeek.Data = NotificationGroupByWeek;
      report.SensorDataSinteticValuesWeek.Data = SensorDataSinteticValuesWeek;
      report.SensorDataSinteticValuesMonth.Data = SensorDataSinteticValuesMonth;


      return report

    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getAnalyticsByDay(): Promise<any> {

    this.logger.log(this.getAnalyticsByDay.name);

    const report = {
      SensordataDay: { Data: [] }
    }

    try {

      const dataToday = new Date(mtz.tz("America/Manaus").format("YYYY-MM-DD"));

      const SensorDataDay = await this.appModelSensorData.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date(dataToday).setHours(0, 0, 0)),
              $lte: new Date(new Date(dataToday).setHours(23, 59, 59))
            }
          }
        },
        {
          $project: {
            _id: 0,
            value: 1,
            createdAt: 1
          }
        }]
      );

      report.SensordataDay.Data = SensorDataDay;

      return report

    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getAnalyticsByWeek(): Promise<any> {

    this.logger.log(this.getAnalyticsByDay.name);

    const report = {
      SensordataWeek: { Data: [] }
    }

    try {

      const dataToday = new Date(mtz.tz("America/Manaus").format("YYYY-MM-DD"));

      const SensorDataWeek = await this.appModelSensorData.aggregate([
        {
          $match: {
            $and: [
              {
                week: {
                  $eq: moment().isoWeek()
                }
              },
              {
                year: {
                  $eq: moment().year()
                }
              }
            ]
          }
        },
        {
          $project: {
            _id: 0,
            value: 1,
            createdAt: 1
          }
        }]
      );

      report.SensordataWeek.Data = SensorDataWeek;

      return report

    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getAnalyticsByMonth(): Promise<any> {

    this.logger.log(this.getAnalyticsByDay.name);

    const report = {
      SensordataMonth: { Data: [] }
    }

    try {

      const dataToday = new Date(mtz.tz("America/Manaus").format("YYYY-MM-DD"));

      const SensorDataMonth = await this.appModelSensorData.aggregate([
        {
          $match: {
            $and: [
              {
                month: {
                  $eq: moment().month() + 1
                }
              },
              {
                year: {
                  $eq: moment().year()
                }
              }
            ]
          }
        },
        {
          $project: {
            _id: 0,
            value: 1,
            createdAt: 1
          }
        }]
      );

      report.SensordataMonth.Data = SensorDataMonth;

      return report

    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  private addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }


}
