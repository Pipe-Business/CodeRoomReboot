export interface UserBankAccountEntity {
    id?: number;
    user_token: string;
    name: string;
    bank: string;
    account_number: string;
    copy_of_bank_statement_img_url: string;
    created_at?: number;
}