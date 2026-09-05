import { Injectable } from '@nestjs/common';
import { validateJsonb } from '../../common/validation/jsonb-validation.util';
import {
  CoreQuestionJsonDto,
  CoreQuestionsResponseJsonDto,
  CvDataJsonDto,
} from '../../common/validation/jsonb.dto';

@Injectable()
export class InterviewContextService {
  async getValidatedCoreQuestions(
    value: unknown,
  ): Promise<CoreQuestionJsonDto[]> {
    const validated = await validateJsonb(
      CoreQuestionsResponseJsonDto,
      { questions: value },
      'Bộ câu hỏi phỏng vấn trong database',
    );
    return validated.questions;
  }

  async getValidatedCvText(value: unknown): Promise<string> {
    if (!value) return '';

    const validated = await validateJsonb(
      CvDataJsonDto,
      value,
      'Dữ liệu CV trong database',
    );
    return JSON.stringify(validated);
  }
}
