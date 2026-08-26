import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { randomUUID } from 'node:crypto';
import { validateJsonb } from './jsonb-validation.util';
import { CoreQuestionsResponseJsonDto, CvDataJsonDto } from './jsonb.dto';
import { SaveCvDto } from '../../modules/cv-management/builder/dto/cv-builder.dto';
import { CreateJobCategoryDto } from '../../modules/job-category/dto/job-category.dto';
import { CreateJobTemplateDto } from '../../modules/job-template/dto/job-template.dto';

const validCvData = {
  fullName: 'Nguyễn Văn A',
  jobTitle: 'Backend Engineer',
  objective: null,
  contact: {
    phone: null,
    email: 'candidate@example.com',
    birthday: null,
    address: null,
  },
  experiences: [],
  projects: [],
  hardSkills: ['PostgreSQL'],
  computerSkills: [],
  languages: [],
  education: [],
  certifications: [],
  activities: [],
  references: [],
};

describe('JSONB runtime validation', () => {
  it('accepts a CV payload matching the former Prisma composite type', async () => {
    await expect(
      validateJsonb(CvDataJsonDto, validCvData, 'cvData'),
    ).resolves.toEqual(validCvData);
  });

  it('rejects malformed nested JSON before Prisma persists it', async () => {
    await expect(
      validateJsonb(
        CvDataJsonDto,
        { ...validCvData, hardSkills: { invalid: true } },
        'cvData',
      ),
    ).rejects.toThrow('hardSkills');
  });

  it('rejects coreQuestions when criteria is not an array', async () => {
    await expect(
      validateJsonb(
        CoreQuestionsResponseJsonDto,
        {
          questions: [
            {
              title: 'PostgreSQL',
              reason: 'Kiểm tra kiến thức',
              criteria: null,
            },
          ],
        },
        'coreQuestions',
      ),
    ).rejects.toThrow('criteria');
  });

  it('parses and validates a JSON-string cvData request', async () => {
    const dto = plainToInstance(SaveCvDto, {
      templateId: randomUUID(),
      title: 'CV Backend',
      cvData: JSON.stringify(validCvData),
      renderedHtml: '<main>CV</main>',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto.cvData.fullName).toBe(validCvData.fullName);
  });

  it('normalizes an empty optional parent UUID to null', async () => {
    const dto = plainToInstance(CreateJobCategoryDto, {
      name: 'Engineering',
      type: 'GROUP',
      parentId: '',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto.parentId).toBeNull();
  });

  it('normalizes an empty optional category UUID to null', async () => {
    const dto = plainToInstance(CreateJobTemplateDto, {
      title: 'Backend Engineer',
      companyName: 'Arion',
      categoryId: '',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto.categoryId).toBeNull();
  });

  it('rejects a legacy Mongo ObjectId before it reaches PostgreSQL', async () => {
    const dto = plainToInstance(CreateJobCategoryDto, {
      name: 'Engineering',
      type: 'INDUSTRY',
      parentId: '64b8f0123456789012345678',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isUuid).toBeDefined();
  });
});
