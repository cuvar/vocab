import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const data = await prisma.word.findMany();
  // console.log(data);
  // fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  // const content = fs.readFileSync("data.json");
  // const data = JSON.parse(content.toString());

  res.status(200).json({ name: "John Doe" });
}
