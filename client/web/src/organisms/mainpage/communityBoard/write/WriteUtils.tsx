import SunEditor from 'suneditor/src/lib/core';
import React from 'react';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';

// 에러메시지
export const ErrorMessages = {
  title: '제목을 입력해주세요',
  nickname: '닉네임을 입력해주세요',
  password: '비밀번호를 입력해주세요',
  content: '내용을 입력해주세요',
};

// editor 내용 가져오는 함수
export const getHtmlFromEditor = (editor: React.MutableRefObject<SunEditor | null>): string => {
  if (editor.current) {
    return editor.current.core.getContents(false);
  }
  console.error('editor.current not exist');
  throw new Error('문제가 발생했습니다. 새로고침 후 다시 시도해 주세요');
};

// 입력된 문자열에서 띄어쓰기,탭,공백 제외한 값 반환
export const trimmedContent = (content: string): string => (
  content.replace(/(<\/?[^>]+(>|$)|&nbsp;|\s)/g, ''));

export const checkCreatePostDto = (createPostDto: CreateCommunityPostDto): CreateCommunityPostDto => {
  // ['nickname', 'password', 'title', 'content'] 
  // 중 빈 값 === '' 이 있는지 확인후 없으면 에러 스낵바
  const keys = ['nickname', 'password', 'title', 'content'] as Array<keyof CreateCommunityPostDto & keyof typeof ErrorMessages>;

  keys.forEach((key: keyof CreateCommunityPostDto & keyof typeof ErrorMessages) => {
    const value = (key === 'content')
      ? trimmedContent(createPostDto[key])
      : createPostDto[key].trim();

    if (value === '') throw new Error(ErrorMessages[key]);
  });
  return createPostDto;
};

export const checkUpdatePostDto = (updatePostDto: UpdateCommunityPostDto): UpdateCommunityPostDto => {
  // ['nickname', 'password', 'title', 'content'] 
  // 중 빈 값 === '' 이 있는지 확인후 없으면 에러 스낵바
  const keys = ['title', 'content'] as Array<keyof UpdateCommunityPostDto & keyof typeof ErrorMessages>;

  keys.forEach((key: keyof UpdateCommunityPostDto & keyof typeof ErrorMessages) => {
    const value = (key === 'content')
      ? trimmedContent(updatePostDto[key])
      : updatePostDto[key].trim();

    if (value === '') throw new Error(ErrorMessages[key]);
  });
  return updatePostDto;
};

// 이미지 리소스 리스트에 대한 data 변경
export const replaceResources = (content: string): Required<Pick<CreateCommunityPostDto, 'content' | 'resources'>> => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(content, 'text/html');
  const imageList = dom.querySelectorAll('img');
  const saveImages: { signature: string, fileName: string, src: string }[] = [];
  imageList.forEach((element, i) => {
    // src는 따로 저장
    const replaceName = `*TRUEPOINT_IMG_SIG_${i}*`;
    const name: string = element.dataset.fileName || '';
    const tagSrc = element.getAttribute('src');
    if (!tagSrc || tagSrc?.slice(0, 4) === 'http') {
      return;
    }
    const obj = {
      signature: replaceName,
      fileName: name.replace(/ /gi, '+'),
      src: element.src,
    };
    element.setAttribute('src', replaceName);
    saveImages.push(obj);
  });

  return { content: dom.body.innerHTML, resources: saveImages };
};
