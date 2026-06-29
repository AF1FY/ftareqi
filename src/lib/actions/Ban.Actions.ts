import { PaginatedReq } from "@/types/Auth";
import { CreateBanDto } from "../validators/ban.schema";
import { getDataAsync, getPaginatedDataAsync, patchDataAsync, postDataAsync } from "./Base.actions";
import { BannedUserItem, BansSummary } from "@/types/Ban";

const BASE_API = 'api/bans';

export const banDriverAsync = async (driverId: string, body: CreateBanDto) =>
  postDataAsync<undefined, CreateBanDto>(`${BASE_API}/${driverId}`, body);

//? Get all banned drivers
export const getBannedDriversAsync = async (params: PaginatedReq) =>
  getPaginatedDataAsync<BannedUserItem, PaginatedReq>(BASE_API, '', '', [], params);

//? Get Ban summary
export const getBanSummaryAsync = async () => getDataAsync<BansSummary, undefined>(`${BASE_API}/summary`);

//~ Unban driver by Id
export const unBanDriverAsync = async (banId: number) => patchDataAsync<undefined, undefined>(`${BASE_API}/${banId}/unban`)
