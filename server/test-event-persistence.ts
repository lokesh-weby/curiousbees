import 'dotenv/config';
import { OllamaService } from './src/ai/ollama.service';
import { EventPersistenceService } from './src/events/event-persistence.service';

async function testPersistence() {
  const aiService = new OllamaService();
  // EventPersistenceService now requires an embedding queue — pass a no-op mock for this test
  const mockQueue = { add: async () => {} } as any;
  const persistenceService = new EventPersistenceService(mockQueue);

  const rawEmail = `
Dear All,
Greetings!!!

You are cordially invited to attend the Pre - Ph.D. talk of our Ph.D. - FT Research scholar Mr. D. Saravanan scheduled at 09.30 AM on May 27, 2026 at the G.D.Naidu Hall, Mechanical Engineering B Block, SRMIST.

Thanks and Regards

Dr. K. Suresh Kumar
Professor & Head
Department of Mechanical Engineering
`;

  console.log('--- Step 1: Running AI Extraction ---');
  const extractedEvent = await aiService.extractEvent(rawEmail);

  if (!extractedEvent) {
    console.error('Failed to extract event JSON from Ollama.');
    return;
  }

  console.log('Extraction Success! Event Data:', extractedEvent);
  
  console.log('\\n--- Step 2: Running Database Persistence ---');
  const savedEvent = await persistenceService.saveExtractedEvent(extractedEvent, rawEmail);

  if (savedEvent) {
    console.log('Persistence Success! Database Record:', savedEvent);
  } else {
    console.log('Persistence Skipped (Could be a duplicate).');
  }
}

testPersistence();
