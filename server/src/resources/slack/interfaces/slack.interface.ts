export interface SlackMessageParam {
  title: string; text: string; fields: SlackMessageField[]
}

export interface SlackMessageField {
  title: string; value: string; short: boolean ;
}
