export interface RangeSelectCaledarProps {
  perioud: Date[];
  handlePerioud: (startAt: Date, endAt: Date, base?: true) => void;
  base?: true;
}
export interface DayStreamsInfo{
  streamId : string;
  title : string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startedAt: Date;
}

export interface StreamListProps {
  termStreamsList: (DayStreamsInfo)[];
  handleTermStreamList: (newStreams: DayStreamsInfo[]) => void;
  // baseStream: DayStreamsInfo|null;
  // compareStream: DayStreamsInfo|null;
  // handleSeletedStreams: (newStreams: DayStreamsInfo|null, base?: true | undefined) => void;
  // handleFullMessage : (isSelectedListFull: boolean) => void;

}
