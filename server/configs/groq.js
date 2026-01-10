import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ silent: true });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export default groq;
