import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Sse,
  MessageEvent,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TokenPayload } from '../../common/types/jwt.type';
import { InterviewAiService } from './interview-ai.service';
import { AudioChatService } from './audio-chat.service';
import { SetupInterviewDto, TtsDto } from './dto/interview.dto';

@Controller('interview-ai')
export class InterviewController {
  constructor(
    private readonly interviewAiService: InterviewAiService,
    private readonly audioChatService: AudioChatService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * POST /interview-ai/setup
   * Setup a new interview session with credit check and AI question generation.
   */
  @Post('setup')
  @Throttle({ default: { limit: 3, ttl: 10000 } })
  async setupInterview(
    @CurrentUser() user: TokenPayload,
    @Body() dto: SetupInterviewDto,
  ) {
    const session = await this.interviewAiService.setupInterview(user.id, dto);
    return session;
  }

  /**
   * GET /interview-ai/:id
   * Get interview session details.
   */
  @Get(':id')
  async getInterview(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
  ) {
    return this.interviewAiService.getInterview(id, user.id);
  }

  /**
   * GET /interview-ai/:id/messages
   * Get interview message history.
   */
  @Get(':id/messages')
  async getMessages(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
  ) {
    return this.interviewAiService.getInterviewMessages(id, user.id);
  }

  /**
   * GET /interview-ai/:id/stream
   * SSE streaming endpoint for real-time AI response chunks and session updates.
   * Supports token in query parameter for SSE authentication.
   */
  @Get(':id/stream')
  @Sse()
  streamInterviewEvents(
    @CurrentUser() user: TokenPayload,
    @Param('id') sessionId: string,
  ): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      const eventName = `chat_updated_${user.id}_${sessionId}`;
      const streamEventName = `chat_stream_${user.id}_${sessionId}`;

      // Emit SYNC_SESSION event when new messages arrive
      const onSync = () => {
        subscriber.next({
          data: { type: 'SYNC_SESSION', sessionId },
        });
      };

      // Emit STREAM_CHUNK events for AI streaming text
      const onStream = (text: string) => {
        subscriber.next({
          data: { type: 'STREAM_CHUNK', sessionId, text },
        });
      };

      this.eventEmitter.on(eventName, onSync);
      this.eventEmitter.on(streamEventName, onStream);

      // 30-second keepalive ping to maintain connection
      const keepAlive = setInterval(() => {
        subscriber.next({
          data: { type: 'ping' },
        });
      }, 30000);

      // Cleanup on client disconnect
      return () => {
        clearInterval(keepAlive);
        this.eventEmitter.off(eventName, onSync);
        this.eventEmitter.off(streamEventName, onStream);
      };
    });
  }

  /**
   * POST /interview-ai/:id/start
   * Start the interview — generates greeting + first question via AI.
   * Idempotent: returns existing messages if already started.
   */
  @Post(':id/start')
  async startInterview(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
  ) {
    return this.interviewAiService.startInterview(id, user.id);
  }

  /**
   * POST /interview-ai/:id/chat-audio
   * Nhận file audio ghi âm trọn lượt nói, transcribe qua OpenRouter Whisper
   * rồi trả về phản hồi AI.
   */
  @Post(':id/chat-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async chatAudio(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^(audio\/|video\/)/ }),
        ],
      }),
    )
    audio: Express.Multer.File,
  ) {
    return this.audioChatService.processAudio(
      id,
      user.id,
      audio.buffer,
      audio.mimetype,
    );
  }

  /**
   * POST /interview-ai/:id/tts
   * Synthesize TTS audio for given text.
   */
  @Post(':id/tts')
  async synthesizeTTS(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
    @Body() dto: TtsDto,
  ) {
    return this.interviewAiService.synthesizeTTS(id, dto.text);
  }

  /**
   * POST /interview-ai/:id/submit
   * Submit interview for evaluation.
   */
  @Post(':id/submit')
  async submitInterview(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
  ) {
    return this.interviewAiService.submitInterview(id, user.id);
  }

  /**
   * GET /interview-ai/:id/result
   * Get interview evaluation result.
   */
  @Get(':id/result')
  async getInterviewResult(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
  ) {
    return this.interviewAiService.getInterviewResult(id, user.id);
  }
}
