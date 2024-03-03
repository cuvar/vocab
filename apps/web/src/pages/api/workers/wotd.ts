import type { NextApiRequest, NextApiResponse } from "next";

import { getWOTD } from "@vocab/server";

type ResponseData = {
  wotd: string;
};

/**
 *
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const wotd = await getWOTD();
  res.status(200).json({ wotd: JSON.stringify(wotd) });
}
