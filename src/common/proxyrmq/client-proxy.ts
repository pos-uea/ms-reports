import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ClientProxyRadioFrequency {

    private user = process.env.RMQ_USER
    private password = encodeURIComponent(process.env.RMQ_PASSWORD)
    private host = process.env.RMQ_URL
    private protocol = process.env.RMQ_PROTOCOLO


    constructor(
        ) {}

    getClientProxyAdminUserInstance(): ClientProxy {

        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`${this.protocol}://${this.user}:${this.password}@${this.host}`],
                queue: 'users'
            },
        })
    }

    getClientProxyDominioSensorsInstance(): ClientProxy {
      
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`${this.protocol}://${this.user}:${this.password}@${this.host}`],
                noAck: false,
                queue: 'sensors'
            }
        })
    }

    getClientProxyDominioNotificationInstance(): ClientProxy {
      
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`${this.protocol}://${this.user}:${this.password}@${this.host}`],
                noAck: false,
                queue: 'notifications'
            }
        })
    }
}