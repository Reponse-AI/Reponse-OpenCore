'use server';

import { redeemPoints } from './loyalty';
import type { RedeemResult } from './loyalty';

export async function redeemPointsAction(
  contactId: string,
  points: number,
): Promise<RedeemResult> {
  return redeemPoints(contactId, points);
}
