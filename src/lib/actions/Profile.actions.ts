'use server'
import { AuthResponse } from '@/types/Auth';
import {getDataAsync} from './Base.actions'
import { IProfile } from '@/types/Profile';

const BASE_ENDPOINT = 'api/Profile';

export const getProfileAsync = async (): Promise<AuthResponse<IProfile>> => await getDataAsync<IProfile>(BASE_ENDPOINT, 'Failed to fetch profile data')