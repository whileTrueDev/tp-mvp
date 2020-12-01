export interface SlackMessageField {
  title: string; value: string; short: boolean ;
}
export interface SlackMessageParam {
  title: string; text: string; fields: SlackMessageField[];
}
