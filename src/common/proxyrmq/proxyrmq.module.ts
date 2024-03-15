import { Module } from '@nestjs/common';
import { ClientProxyRadioFrequency } from './client-proxy'

@Module({
    providers: [ClientProxyRadioFrequency],
    exports: [ClientProxyRadioFrequency]
})
export class ProxyRMQModule {}
