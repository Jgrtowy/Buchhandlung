import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { action } = req.query;

  switch (action) {
    case "get":
      try {
        const books = await db.ksiazki.findMany();

        res.status(200).json(books);
      } catch (error) {
        res.status(500).json({ error });
      }
  }
}
