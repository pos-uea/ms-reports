
export interface INotification {
    
    sensor: string;
    type: string;
    value_limite: Number;
    value: Number;
    emails: Array<string>;

}