import { User } from "../users/model";
import { v4 as uuidv4 } from "uuid";
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

export async function generateUniqueReferralCode() {
  let code;
  let exists = true;

  while (exists) {
    code = nanoid();
    exists = !!(await User.findOne({ team_code: code }));
  }

  return code;
}