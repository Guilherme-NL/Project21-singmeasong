import * as e2eService from "../services/e2eService.js";
import { Request, Response } from "express";

export async function reset(req: Request, res: Response) {
  await e2eService.truncate();
  res.sendStatus(200);
}
