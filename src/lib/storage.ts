import { createWriteStream, existsSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";

export type StorageProvider = {
  putChunk: (key: string, chunkNo: number, data: Buffer) => Promise<void>;
  composeFile: (key: string, totalChunks: number) => Promise<Buffer>;
  deleteObject: (key: string) => Promise<void>;
};

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

class LocalStorageProvider implements StorageProvider {
  constructor(private readonly basePath: string) {
    ensureDir(basePath);
  }

  async putChunk(key: string, chunkNo: number, data: Buffer) {
    const chunkDir = join(this.basePath, key);
    ensureDir(chunkDir);
    await new Promise<void>((resolve, reject) => {
      const stream = createWriteStream(join(chunkDir, `${chunkNo}`));
      stream.on("error", reject);
      stream.on("finish", () => resolve());
      stream.end(data);
    });
  }

  async composeFile(key: string, totalChunks: number) {
    const chunkDir = join(this.basePath, key);
    const buffers: Buffer[] = [];
    for (let i = 1; i <= totalChunks; i += 1) {
      buffers.push(readFileSync(join(chunkDir, `${i}`)));
    }
    return Buffer.concat(buffers);
  }

  async deleteObject(key: string) {
    // Cleanup is handled by seed cleanup tasks or manual scripts. No-op for demo.
    void key;
  }
}

let provider: StorageProvider | null = null;

export async function getStorageProvider(): Promise<StorageProvider> {
  if (provider) return provider;

  const target = process.env.FILE_STORAGE_DRIVER ?? "local";
  if (target === "s3") {
    try {
      const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = await import("@aws-sdk/client-s3");
      const client = new S3Client({});
      provider = {
        async putChunk(key, chunkNo, data) {
          await client.send(
            new PutObjectCommand({
              Bucket: process.env.FILE_STORAGE_BUCKET!,
              Key: `${key}/${chunkNo}`,
              Body: data
            })
          );
        },
        async composeFile(key, totalChunks) {
          const parts: Buffer[] = [];
          for (let i = 1; i <= totalChunks; i += 1) {
            const { Body } = await client.send(
              new GetObjectCommand({
                Bucket: process.env.FILE_STORAGE_BUCKET!,
                Key: `${key}/${i}`
              })
            );
            if (!Body) throw new Error("Unable to read remote chunk");
            const arrayBuffer = await Body.transformToByteArray();
            parts.push(Buffer.from(arrayBuffer));
          }
          return Buffer.concat(parts);
        },
        async deleteObject(key) {
          await client.send(
            new DeleteObjectCommand({
              Bucket: process.env.FILE_STORAGE_BUCKET!,
              Key: key
            })
          );
        }
      } satisfies StorageProvider;
      return provider;
    } catch (error) {
      console.warn("Falling back to local storage provider", error);
    }
  }

  provider = new LocalStorageProvider(process.env.LOCAL_STORAGE_PATH ?? join(process.cwd(), "uploads-temp"));
  return provider;
}
