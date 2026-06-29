import { ai, AI_MODEL_CONFIG } from '../../config/ai.config';

async function test() {
  const schema = {
    type: 'OBJECT',
    properties: {
      reply: { type: 'STRING' },
      suggestedAction: { type: 'STRING', enum: ['CONTINUE', 'FINISH'] },
    },
  };

  const responseStream = await ai.models.generateContentStream({
    model: AI_MODEL_CONFIG.model,
    contents: 'Nói xin chào khoảng 50 chữ',
    config: {
      ...AI_MODEL_CONFIG.config,
      responseSchema: schema,
    },
  });

  for await (const chunk of responseStream) {
    console.log('CHUNK ARRIVED:', chunk.text);
  }
}

test().catch(console.error);
