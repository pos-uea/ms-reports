import * as mongoose from 'mongoose';

export const GatewaySchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    active: { type: Boolean }

}, { timestamps: true , collection: 'gateway'});
