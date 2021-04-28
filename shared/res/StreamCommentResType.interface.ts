import { StreamComments } from '../interfaces/StreamComments.interface';

export interface IStreamCommentData extends StreamComments {
    likesCount?: number;
    hatesCount?: number;
    createDate: Date;
    profileImage?: string;
    childrenCount?: number;
}
export interface IStreamCommentsRes {
    comments: IStreamCommentData[];
    count: number;
}
