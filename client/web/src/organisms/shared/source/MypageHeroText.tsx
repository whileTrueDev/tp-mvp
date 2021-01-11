const textSource = {
  hightlightHeroSection: {
    eachCardContent: [
      {
        cardHeader: '분석 대시보드',
        cardTitle: '채팅 발생 수 분석',
        cardIcon: '/images/analyticsPage/balloon.png',
        cardText: `\0
        채팅 발생 수를 기준으로 분석합니다.
        방송에서 채팅이 가장 활발했던 구간을 확인해보세요!`,
        // 분석 결과는 자막파일로 다운로드할 수 있습니다.
      },
      {
        cardHeader: '분석 대시보드',
        cardTitle: '웃음 발생 수 분석',
        cardIcon: '/images/analyticsPage/smile.png',
        cardText: `\0
        웃음 발생 수를 기준으로 분석합니다.
        시청자들이 가장 많이 웃었던 구간을 확인해보세요!`,
      },
      {
        cardHeader: '분석 대시보드',
        cardTitle: '감정 카테고리별 분석',
        cardIcon: '/images/analyticsPage/magnify.png',
        cardText: `\0
        감정 카테고리별 하이라이트 분석을 진행해보세요!
        특정 감정의 반응이 많은 지점을 찾을 수 있어요.`,
      },
    ],
  },
  streamAnalysisSection: {
    eachCardContent: [
      {
        cardHeader: '방송 비교 분석',
        cardTitle: '방송별 비교',
        cardIcon: '/images/stream-analysis/streamsCompare.png',
        cardText: `\0
        어떤 방송을 했을 때 시청자 반응이 가장 좋았을까요? 
        여러 지표를 통해 반응을 비교하실 수 있습니다.`,
      },
      {
        cardHeader: '방송 분석',
        cardTitle: '민심을 확인',
        cardIcon: '/images/stream-analysis/periodsCompare.png',
        cardText: `\0
        내 방송의 민심은 상승세일까요 하락세일까요?
        방송별/기간별로 여러 지표를 확인해보세요.`,
      },
      {
        cardHeader: '채널 분석',
        cardTitle: '유튜브 채널 분석',
        cardIcon: '/images/stream-analysis/youtubeCompare.png',
        cardText: `\0
        \n추후 유튜브 채널 분석 기능을 업데이트할 예정입니다.`,
      },
    ],
  },
};

export default textSource;
