// Generate 4 mascot options for Talkotopia
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = '/home/z/my-project/download/mascots';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const mascots = [
  {
    name: 'tako-octopus',
    prompt: 'A cute friendly cartoon octopus mascot for a children learning platform, soft sage green body with cream and amber accents, big sparkly eyes, happy smile, holding a small book, flat vector illustration style, clean simple shapes, warm cream background, playful and educational, kawaii style, high quality, professional mascot design',
  },
  {
    name: 'wise-owl',
    prompt: 'A cute wise owl mascot for a children learning platform, warm amber and cream feathers with sage green accents, big round glasses, friendly smile, holding a graduation cap, flat vector illustration style, clean simple shapes, soft cream background, playful and educational, kawaii style, high quality, professional mascot design',
  },
  {
    name: 'happy-fox',
    prompt: 'A cute happy fox mascot for a children learning platform, warm amber orange fur with cream belly and sage green scarf, big friendly eyes, joyful smile, holding a pencil, flat vector illustration style, clean simple shapes, soft cream background, playful and educational, kawaii style, high quality, professional mascot design',
  },
  {
    name: 'panda-scholar',
    prompt: 'A cute panda scholar mascot for a children learning platform, classic black and white panda with sage green backpack and amber book, big friendly eyes, gentle smile, flat vector illustration style, clean simple shapes, soft cream background, playful and educational, kawaii style, high quality, professional mascot design',
  },
];

async function generate() {
  const zai = await ZAI.create();
  for (const m of mascots) {
    console.log(`🎨 Generating: ${m.name}...`);
    try {
      const response = await zai.images.generations.create({
        prompt: m.prompt,
        size: '1024x1024',
      });
      const buffer = Buffer.from(response.data[0].base64, 'base64');
      const outPath = path.join(OUTPUT_DIR, `${m.name}.png`);
      fs.writeFileSync(outPath, buffer);
      console.log(`✓ Saved: ${outPath}`);
    } catch (err) {
      console.error(`✗ Failed ${m.name}:`, err instanceof Error ? err.message : err);
    }
  }
  console.log('\n🎉 All mascots generated in:', OUTPUT_DIR);
}

generate();
