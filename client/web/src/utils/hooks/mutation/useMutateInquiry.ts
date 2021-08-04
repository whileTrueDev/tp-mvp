import { CreateInquiryDto } from '@truepoint/shared/dist/dto/inquiry/createInquiry.dto';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

async function createInquiry(createInquiryDto: CreateInquiryDto) {
  const { data } = await axios.post('/inquiry', createInquiryDto);
  return data;
}

export function useCreateInquiry(): UseMutationResult<any, AxiosError, CreateInquiryDto> {
  return useMutation(
    createInquiry,
  );
}
