import { createApp } from './app.js';

const PORT = process.env.PORT || 4000;

(async () => {
  const app = await createApp();
  app.listen(PORT, () => {
    console.log(`Backend running on ${PORT}`);
  });
})();
