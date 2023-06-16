import { SMSObject } from "capacitor-sms-inbox";

export interface ModalSmsDataDismiss {
    sms: SMSObject,
    smsIndex: number;
}