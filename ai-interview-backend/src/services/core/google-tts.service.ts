import { AppException } from '../../exceptions';

export class GoogleTtsService {
  private readonly apiKey = process.env.GOOGLE_TTS_API_KEY;

  async synthesizeSpeech(text: string): Promise<Buffer> {
    if (!this.apiKey) {
      throw new AppException('Chưa cấu hình GOOGLE_TTS_API_KEY', 500);
    }

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`;

    // Sử dụng giọng đọc WaveNet/Neural2 tiếng Việt chuẩn
    const requestBody = {
      input: { text },
      voice: { languageCode: 'vi-VN', name: 'vi-VN-Neural2-A' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lỗi Google TTS:', errorText);
      throw new AppException('Không thể tạo giọng nói từ AI', 500);
    }

    const data = await response.json();
    // data.audioContent là chuỗi mã hóa base64
    return Buffer.from(data.audioContent, 'base64');
  }
}

export const googleTtsService = new GoogleTtsService();
