export class StreamReplyExtractor {
  public fullText = '';
  private lastExtractedReply = '';

  constructor(private onStream?: (text: string) => void) {}

  process(newText: string) {
    this.fullText += newText;
    if (this.onStream) {
      const match = this.fullText.match(/"reply"\s*:\s*"((?:\\.|[^"\\])*)"?/);
      if (match && match[1]) {
        const currentReply = match[1]
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
        if (currentReply !== this.lastExtractedReply) {
          this.lastExtractedReply = currentReply;
          this.onStream(currentReply);
        }
      }
    }
  }
}
