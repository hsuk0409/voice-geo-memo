export interface SummaryPort {
  summarize(text: string): Promise<string>;
}
