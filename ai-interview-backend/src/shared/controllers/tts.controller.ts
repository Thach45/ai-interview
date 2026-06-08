import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { googleTtsService, GoogleTtsService } from '../../services/core/google-tts.service';
import { sendResponse } from '../../utils/apiResponse';

export class TtsController {
  constructor(private readonly ttsService: GoogleTtsService) {}

  synthesizeSpeech = asyncHandler(async (req: Request, res: Response) => {
    // Ưu tiên lấy text từ body, nếu không có thì lấy từ params hoặc query
    const text = req.body.text || req.params.text || req.query.text;

    if (!text) {
      return sendResponse(res, 400, 'Vui lòng cung cấp text để chuyển đổi', null);
    }

    const audioBuffer = await this.ttsService.synthesizeSpeech(text);

    // Trả về chuỗi base64 để frontend có thể nhúng trực tiếp vào thẻ <audio src="data:audio/mp3;base64,...">
    const audioBase64 = audioBuffer.toString('base64');

    sendResponse(res, 200, 'Tổng hợp giọng nói thành công', { audioBase64 });
  });
}

export const ttsController = new TtsController(googleTtsService);
