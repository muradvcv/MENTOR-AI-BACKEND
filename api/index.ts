import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, Collection } from "mongodb";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

let client: MongoClient | null = null;
let jobCollection: Collection | null = null;

async function initDb(): Promise<Collection> {
  if (jobCollection) return jobCollection;

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
  }

  jobCollection = client.db("Mentor-Ai").collection("Jobs");
  return jobCollection;
}

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/addjob", async (req: Request, res: Response) => {
  try {
    const collection = await initDb();
    const result = await collection.insertOne(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: String(err) });
  }
});

app.get("/api/getjobs", async (_req: Request, res: Response) => {
  try {
    const collection = await initDb();
    const result = await collection.find().toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: String(err) });
  }
});

export default app;
