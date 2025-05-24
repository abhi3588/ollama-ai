export interface Payment {
    paymentId: string;
    paymentDate: string;
    paymentAmount: number;
    currency: string;
    paymentStatus: string;
    companyId: string;
    userId: string;
    originatingAccount: string;
    recipientName: string;
    recipientAccount: string;
    recipientBankId: string;
}