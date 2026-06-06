import { OllamaService } from './src/ai/ollama.service';

async function test() {
  const ai = new OllamaService();

  const result = await ai.extractEvent(`
Dear All,
Greetings!!!

You are cordially invited to attend the Pre - Ph.D. talk of our Ph.D. - FT Research scholar Mr. D. Saravanan scheduled at 09.30 AM on May 27, 2026 at the G.D.Naidu Hall, Mechanical Engineering B Block, SRMIST.

Thanks and Regards

Dr. K. Suresh Kumar
Professor & Head
Department of Mechanical Engineering
`);

  console.log(result);
}

test();