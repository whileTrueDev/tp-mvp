export interface Broad {
  'broad_title': string,
  'visit_broad_type': string;
  'is_password': string;
  'broad_cate_no': string;
  'broad_no': string;
  'user_id': string;
  'user_nick': string;
  'profile_img': string;
  'broad_thumb': string;
  'broad_start': string;
  'broad_grade': string;
  'broad_bps': string;
  'broad_resolution': string;
  'total_view_cnt': string;
}
export interface BroadResponse {
  'total_cnt': number;
  'page_no': number;
  'page_block': number;
  broad: Broad[];
  'time': number;
}

// total_cnt integer 전체 방송 개수입니다.
// page_no integer 현재 페이지 번호입니다.
// page_block integer 페이지당 제공하는 방송 갯수입니다.
// broad array 방송 정보 리스트입니다.
// - time integer 방송 리스트 생성된 시간입니다.(유닉스 타임 스탬프)
// - broad_title string 방송 제목입니다.
// - visit_broad_type string 방송 시, 탐방사절 안내 표시 여부입니다.(0:허용, 1:사절) *탐방사절이란, 방송이 사전 동의 없이 무단으로 재송출됨을 거절하는 의사 표현 UI입니다.
// - is_password string 비밀번호 방송 여부입니다.(1:비밀번호 설정 방송, 0:미설정 방송) *비밀번호는 영문+숫자의 조합이며, 6자이상으로 설정해야 합니다.
// - broad_cate_no string 방송 카테고리 번호입니다. *카테고리 리스트는 본 개발 가이드 항목의 최하단 ‘카테고리 리스트’를 참고 부탁 드립니다.
// - broad_no string 방송 번호입니다.
// - user_id string BJ 아이디입니다.
// - user_nick string BJ 닉네임입니다.
// - profile_img string BJ 프로필 이미지입니다.
// - broad_thumb string 방송 썸네일입니다. *방송 썸네일은 480x270 사이즈이며, 확장자는 jpg입니다. 썸네일이 포함되는 UI 구성 시 함께 고려되어야 합니다.
// - broad_start string 방송 시작 시간입니다.
// - broad_grade string 방송 등급입니다.(19:연령 제한 방송, 0:일반 방송) *연령 제한 방송은 19세 미만 시청 불가입니다.
// - broad_bps string 방송 화질입니다. *단위는 kbps이며, 최대 8000kbps까지 설정 가능합니다.
// - broad_resolution string 방송 해상도입니다. *1280x720/1920x1080등의 해상도가 있습니다.
// - total_view_cnt string 총 시청자 수입니다.
