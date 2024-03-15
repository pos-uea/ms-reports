import * as mongoose from 'mongoose';

export const SensorDataSchema = new mongoose.Schema({
    sensor_code: { type: String, required: true},
    value: { type: Number, required: true},
    sensor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'sensor',
    }
}, { timestamps: true , collection: 'sensor_data'});

