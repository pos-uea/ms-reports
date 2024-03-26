import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ReportsService } from './reports.service';

const ackErrors = ['E11000'];

@Controller('reports')
export class ReportsController {

    constructor(
        private readonly appService: ReportsService
        ) { }

    logger = new Logger(ReportsController.name);

    @MessagePattern('get-reports')
    async reportsSensors(@Payload() empty: string, @Ctx() context: RmqContext) {
        
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            return await this.appService.reportsSensors();
            
        } finally {
            await channel.ack(originalMsg);
        }
    }

    @MessagePattern('get-analytics-by-type')
    async getAnalyticsByType(@Payload() type: string, @Ctx() context: RmqContext) {
        
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            switch (type) {
                case 'day':
                    return await this.appService.getAnalyticsByDay();
                case 'week':
                    return await this.appService.getAnalyticsByWeek();
                case 'month':
                    return await this.appService.getAnalyticsByMonth();
                default:
                    break;
            }
            
        } finally {
            await channel.ack(originalMsg);
        }
    }


}
