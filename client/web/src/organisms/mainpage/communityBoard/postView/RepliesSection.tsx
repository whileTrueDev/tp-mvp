import React from 'react';

interface SectionProps{
  className?: string,
  totalReplyCount?: number,
}
export default function RepliesSection(props: SectionProps): JSX.Element {
  const {
    className,
    totalReplyCount,
  } = props;
  return (
    <section className={className}>
      <div>
        {totalReplyCount}
        {/** 댓글부분은 별도 컴포넌트 */}
        <div>전체댓글, 댓글 등록순/최신순 필터 | 본문보기, 댓글닫기, 새로고침버튼</div>
        <div>
          작성자(ㅑ아이피)   댓글내용    시간 목록
          <button>x</button>
        </div>
        <div>댓글 페이지네이션</div>
        <div>!댓글작성폼!</div>
      </div>
    </section>
  );
}
