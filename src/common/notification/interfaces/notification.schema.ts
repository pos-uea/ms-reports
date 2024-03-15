import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
    sensor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'sensor',
    },
    type: {type: String, required: true},
    value_limite:{ type: Number, required: true},
    value: { type: Number, required: true},
    emails: Array<{type: string }>

}, { timestamps: true , collection: 'notification'});

