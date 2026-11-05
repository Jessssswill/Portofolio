import { existsSync, readdirSync, openSync, readSync, closeSync } from "node:fs";
import { join, extname, basename } from "node:path";

// Files Will can drop into /public without touching code. Everything here runs
// at build time, so the site stays fully static.
//   public/cv.pdf                 -> "CV" links appear
//   public/me.jpg (or .png/.webp) -> portrait in the About section
//   public/work/<slug>/*.png|jpg  -> screenshot gallery on that case study

const PUBLIC = join(process.cwd(), "public");

export function publicFile(name: string): string | null {
  return existsSync(join(PUBLIC, name)) ? `/${name}` : null;
}

export function findPortrait(): string | null {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const hit = publicFile(`me.${ext}`);
    if (hit) return hit;
  }
  return null;
}

export type Shot = { src: string; width: number; height: number; caption: string };

export function screenshots(slug: string): Shot[] {
  const dir = join(PUBLIC, "work", slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort()
    .flatMap((f) => {
      const size = imageSize(join(dir, f));
      if (!size) return [];
      return [{ src: `/work/${slug}/${f}`, ...size, caption: captionFrom(f) }];
    });
}

// "02-lobby-page.png" -> "Lobby page"
function captionFrom(file: string) {
  const name = basename(file, extname(file))
    .replace(/^\d+[-_ ]*/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return name ? name[0].toUpperCase() + name.slice(1) : "";
}

// Reads width/height from the file header (PNG, JPEG, WebP) so next/image
// gets real dimensions without a dependency.
function imageSize(path: string): { width: number; height: number } | null {
  const fd = openSync(path, "r");
  try {
    const buf = Buffer.alloc(65536);
    const len = readSync(fd, buf, 0, buf.length, 0);
    const b = buf.subarray(0, len);
    // PNG
    if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
      return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    }
    // WebP
    if (b.length > 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
      const kind = b.toString("ascii", 12, 16);
      if (kind === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
      if (kind === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
      if (kind === "VP8L") {
        const bits = b.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
    // JPEG: walk the markers until a start-of-frame
    if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i + 9 < b.length) {
        if (b[i] !== 0xff) {
          i++;
          continue;
        }
        const marker = b[i + 1];
        const size = b.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
        }
        i += 2 + size;
      }
    }
    return null;
  } finally {
    closeSync(fd);
  }
}
