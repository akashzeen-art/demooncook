import { createServer } from "./index";

const app  = createServer();
const port = 3001;

app.listen(port, () => {
  console.log(`🔧 API server running on http://localhost:${port}`);
});
