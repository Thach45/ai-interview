import { Controller, Post, Get, Body } from '@nestjs/common';
import { TtsService } from './tts.service';
import { SynthesizeDto } from './dto/tts.dto';
import { HasRole } from '../../common/decorators/has-role.decorator';
import { Role } from '@prisma/client';

@Controller('tts')
@HasRole(Role.CANDIDATE, Role.ADMIN)
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  /**
   * POST /tts -> Tong hop giong noi tu van ban
   */
  @Post()
  async synthesizeSpeech(@Body() dto: SynthesizeDto) {
    return this.ttsService.synthesizeSpeech(dto.text, dto.persona);
  }

  /**
   * GET /tts -> Danh sach giong noi/persona co san
   */
  @Get()
  async getAvailableVoices() {
    return this.ttsService.getAvailableVoices();
  }
}
