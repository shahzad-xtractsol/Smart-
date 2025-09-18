import { User } from './../../smart-frontend/src/app/models/user.model';
export type UserTypeValue =
    | '1'
    | '2'
    | '3'
    | '4'
    | '6'
    | '7'
    | '8';

export const userTypes: { value: UserTypeValue; label: string }[] = [
    { value: '1', label: 'Buyer' },
    { value: '2', label: 'Seller' },
    { value: '3', label: 'Investor' },
    { value: '4', label: 'Agent' },
    { value: '6', label: 'Title Admin' },
    { value: '7', label: 'Title User' },
    { value: '8', label: 'Title Abstractor' }
];

export const UserTypeLabels= [
    { value: 'buyer', label: 'Buyer' },
    { value: 'seller', label: 'Seller' },
    { value: 'invest', label: 'Investor' },
    { value: 'agent', label: 'Agent' },
    { value: 'titleAdmin', label: 'Title Admin' },
    { value: 'titleuser', label: 'Title User' },
    { value: 'titleAbstractor', label: 'Title Abstractor' }
];