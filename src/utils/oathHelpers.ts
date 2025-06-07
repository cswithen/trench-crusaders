import type { Oath } from '../types/Oath.js';

export function isUserPledged(oaths: Oath[], userId: string) {
    return oaths.some((oath) => oath.user_id === userId);
}
