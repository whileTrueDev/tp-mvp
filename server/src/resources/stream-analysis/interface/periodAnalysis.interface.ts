export interface PeriodAnalysis{
  start_date: string;
  end_date: string;
  view_count: number;
  chat_count: number;
  value:
    {
      chat_count: number;
      view_count?: number;
      smile_count: number;
      date: string;
    }[];
}

// output  : {
//   start_date,
//   end_date,
//   view_count,
//   chat_count,
//   value:
//     [
//       {chat_count, view_count, smile_count, date}, 
//       {chat_count, view_count, smile_count, date}, 
//       ... 
//     ]
// }
