import type { NextApiRequest, NextApiResponse } from "next";
import { getWOTD } from "../../../server/service/server/wotd.service";

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
  res: NextApiResponse<ResponseData>
) {
  const wotd = await getWOTD(""); // TODO: must be collectionId
  res.status(200).json({ wotd: JSON.stringify(wotd) });
}
