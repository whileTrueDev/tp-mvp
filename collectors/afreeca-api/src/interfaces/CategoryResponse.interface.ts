export interface BroadCategory {
  'cate_name': string; // 카테고리 명입니다.
  'cate_no': string; // 카테고리 번호입니다.
  child: BroadCategory[]; // array 자식 카테고리입니다.
}

export interface BroadCategoryResponse {
  'broad_category': Array<BroadCategory> // 카테고리 정보 리스트입니다.
}
