// Local development server only. On Vercel, api/index.ts is used directly.
import app from "./api/index";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
