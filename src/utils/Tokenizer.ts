import { blockNormal as rules } from './rule';

interface Space {
  type: 'space';
  raw: string;
}

interface Fence {
  type: 'fence';
  raw: string;
}

interface Segment {
  type: 'segment';
  raw: string;
}

export type Token = Space | Fence | Segment;

export class Tokenizer {
  /** 空行 */
  space(src: string): Space | undefined {
    const cap = rules.newline.exec(src);
    if (cap) {
      return {
        type: 'space',
        raw: cap[0],
      };
    }
  }
  /** 围栏 fence */
  fence(src: string): Fence | undefined {
    const cap = rules.fences.exec(src);
    if (cap) {
      return {
        type: 'fence',
        raw: cap[0],
      };
    }
  }
  /** 块 */
  segment(src: string): Segment | undefined {
    const cap = rules.block.exec(src);
    if (cap) {
      return {
        type: 'segment',
        raw: cap[0],
      };
    }
  }
}
