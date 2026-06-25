import { Request, Response } from 'express';
import prisma from '../../../config/prisma';

export class CvTemplateController {
  // Lấy danh sách (Admin & Client đều có thể gọi hàm này hoặc mình tách riêng cho Client)
  // Ở admin, có thể cần lấy cả isActive = false, nhưng ta làm chung cho đơn giản trước
  static async getTemplates(req: Request, res: Response) {
    try {
      const templates = await prisma.cvTemplate.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi khi lấy danh sách template' });
    }
  }

  static async getTemplateById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const template = await prisma.cvTemplate.findUnique({
        where: { id },
      });
      if (!template) {
        res.status(404).json({ error: 'Không tìm thấy template' });
        return;
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi khi lấy template' });
    }
  }

  static async createTemplate(req: Request, res: Response) {
    try {
      const { name, thumbnailUrl, htmlStructure, cssStyles, isActive } = req.body;
      const newTemplate = await prisma.cvTemplate.create({
        data: {
          name,
          thumbnailUrl,
          htmlStructure,
          cssStyles,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
      res.status(201).json(newTemplate);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi khi tạo template' });
    }
  }

  static async updateTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, thumbnailUrl, htmlStructure, cssStyles, isActive } = req.body;

      const existing = await prisma.cvTemplate.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ error: 'Không tìm thấy template để cập nhật' });
        return;
      }

      const updated = await prisma.cvTemplate.update({
        where: { id },
        data: {
          name,
          thumbnailUrl,
          htmlStructure,
          cssStyles,
          isActive,
        },
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi khi cập nhật template' });
    }
  }

  static async deleteTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const existing = await prisma.cvTemplate.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ error: 'Không tìm thấy template để xóa' });
        return;
      }

      await prisma.cvTemplate.delete({
        where: { id },
      });
      res.json({ message: 'Xóa template thành công' });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi khi xóa template' });
    }
  }
}
