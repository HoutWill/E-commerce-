import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { BoundingBox } from '../types/product';

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
const CROPPED_DIR = path.join(UPLOADS_DIR, 'cropped');
const ORIGINALS_DIR = path.join(UPLOADS_DIR, 'originals');

export class ImageProcessor {
  constructor() {
    this.ensureDirs();
  }

  private ensureDirs() {
    if (!fs.existsSync(CROPPED_DIR)) fs.mkdirSync(CROPPED_DIR, { recursive: true });
    if (!fs.existsSync(ORIGINALS_DIR)) fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
  }

  /**
   * Crop the product box from the full frame screenshot using normalized coordinates (0.0 to 1.0)
   */
  public async cropProductBox(
    inputImagePath: string,
    outputFilename: string,
    boundingBox?: BoundingBox
  ): Promise<string> {
    try {
      const metadata = await sharp(inputImagePath).metadata();
      const imgWidth = metadata.width || 720;
      const imgHeight = metadata.height || 1280;

      let cropLeft: number;
      let cropTop: number;
      let cropWidth: number;
      let cropHeight: number;

      if (boundingBox && boundingBox.ymax > boundingBox.ymin && boundingBox.xmax > boundingBox.xmin) {
        // Convert normalized [0, 1] to actual pixel coordinates with strict box focus (trimming hand grasping areas)
        const ymin = Math.max(0, Math.min(1, boundingBox.ymin));
        const xmin = Math.max(0, Math.min(1, boundingBox.xmin));
        const ymax = Math.max(0, Math.min(1, boundingBox.ymax));
        const xmax = Math.max(0, Math.min(1, boundingBox.xmax));

        // Inset slightly to exclude holding fingers on left and bottom
        const insetLeft = (xmax - xmin) * 0.04;
        const insetBottom = (ymax - ymin) * 0.04;

        cropLeft = Math.round((xmin + insetLeft) * imgWidth);
        cropTop = Math.round(ymin * imgHeight);
        cropWidth = Math.round((xmax - (xmin + insetLeft)) * imgWidth);
        cropHeight = Math.round(((ymax - insetBottom) - ymin) * imgHeight);
      } else {
        // Fallback default angle crop: tightly frame the box in upper center (avoiding hand beneath)
        cropLeft = Math.round(imgWidth * 0.20);
        cropTop = Math.round(imgHeight * 0.38);
        cropWidth = Math.round(imgWidth * 0.62);
        cropHeight = Math.round(imgHeight * 0.48);
      }

      // Ensure valid boundary limits
      cropLeft = Math.max(0, Math.min(cropLeft, imgWidth - 10));
      cropTop = Math.max(0, Math.min(cropTop, imgHeight - 10));
      cropWidth = Math.max(10, Math.min(cropWidth, imgWidth - cropLeft));
      cropHeight = Math.max(10, Math.min(cropHeight, imgHeight - cropTop));

      const outputPath = path.join(CROPPED_DIR, outputFilename);

      await sharp(inputImagePath)
        .extract({
          left: cropLeft,
          top: cropTop,
          width: cropWidth,
          height: cropHeight
        })
        .webp({ quality: 90 })
        .toFile(outputPath);

      return `/uploads/cropped/${outputFilename}`;
    } catch (error) {
      console.error('Image cropping failed:', error);
      // Fallback: copy original if crop fails
      const fallbackFilename = `fallback_${outputFilename}`;
      const fallbackPath = path.join(CROPPED_DIR, fallbackFilename);
      try {
        await sharp(inputImagePath).webp({ quality: 85 }).toFile(fallbackPath);
        return `/uploads/cropped/${fallbackFilename}`;
      } catch (err) {
        return `/uploads/originals/${path.basename(inputImagePath)}`;
      }
    }
  }

  /**
   * Save a base64 or buffer image as an original screenshot
   */
  public async saveOriginalImage(
    buffer: Buffer,
    filename: string
  ): Promise<{ localPath: string; webUrl: string }> {
    const outputPath = path.join(ORIGINALS_DIR, filename);
    await fs.promises.writeFile(outputPath, buffer);
    return {
      localPath: outputPath,
      webUrl: `/uploads/originals/${filename}`
    };
  }
}

export const imageProcessor = new ImageProcessor();
