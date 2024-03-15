import * as mongoose from 'mongoose';

export const SensorSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    type: { type: String },
    fabricante: { type: String },
    modelo: { type: String  },
    version: { type: String },
    active: { type: Boolean }

}, { timestamps: true , collection: 'sensor'});

