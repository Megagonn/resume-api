import { cloudinary, assertCloudinaryConfigured } from '../config/cloudinary.js';

export type UploadKind = 'image' | 'raw';

export interface UploadedFile {
  url: string;
  publicId: string;
  format?: string;
  bytes: number;
  resourceType: string;
  originalFilename?: string;
}

export async function uploadBuffer(
  buffer: Buffer,
  options: {
    folder: string;
    resourceType: UploadKind;
    filename?: string;
  }
): Promise<UploadedFile> {
  assertCloudinaryConfigured();

  const result = await new Promise<UploadedFile>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resourceType,
        use_filename: Boolean(options.filename),
        unique_filename: true,
        overwrite: false,
        ...(options.filename ? { filename_override: options.filename } : {}),
      },
      (err, uploadResult) => {
        if (err || !uploadResult) {
          reject(err ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          resourceType: uploadResult.resource_type,
          originalFilename: uploadResult.original_filename,
        });
      }
    );
    stream.end(buffer);
  });

  return result;
}

export async function deleteByPublicId(
  publicId: string,
  resourceType: UploadKind = 'image'
): Promise<void> {
  assertCloudinaryConfigured();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
