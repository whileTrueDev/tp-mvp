export interface PeriodsAnalysis{
  timeline : {
    viewer: number;
    chatCount: number;
    smileCount: number;
    date: string;
  }[],
  type?: string| null,
  metrics: {
    title: string;
    tag: string;
    key: string;
    value: {
      category: string;
      broad1: number;
      broad2: number;
    }[];
    unit: string;
  }[]
}

// { 
//   timeline : [
//     {viewer, chatCount, smileCount, date}, 
//     {viewer, chatCount, smileCount, date},
//     ...
//   ],
//   type: 'periods',
//   metrics: [  
//     {
//       title: '평균 시청자 수',
//       tag: 'viewer',
//       key: 'viewer',
//       value: [],
//       unit: '명'
//     },
//     {
//       title: '웃음 발생 수',
//       tag: 'smile',
//       key: 'smileCount',
//       value: [],
//       unit: '회'
//     },
//     {
//       title: '채팅 발생 수',
//       tag: 'chat',
//       key: 'chatCount',
//       value: [],
//       unit: '회'
//     }
//   ]
// }
