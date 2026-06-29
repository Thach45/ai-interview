import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Interview API Documentation',
      version: '1.0.0',
      description: 'Tài liệu API tự động cho hệ thống AI Interview Backend',
      contact: {
        name: 'AI Interview Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Đường dẫn trỏ tới các file có chứa các đoạn ghi chú JSDoc
  apis: ['./src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
