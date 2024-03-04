import type { NextApiRequest, NextApiResponse } from "next";
import { getWOTD } from "../../../server/domain/service/wotd.service";

type ResponseData = {
  wotd: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const wotd = await getWOTD();
  res.status(200).json({ wotd: JSON.stringify(wotd) });
}
