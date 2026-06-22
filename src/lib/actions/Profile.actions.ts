'use server'
import {getDataAsync} from './Base.actions'
import { IProfile } from '@/types/Profile';
import { CarDetails } from '@/types/Driver';

const BASE_ENDPOINT = 'api/Profile';

export const getProfileAsync = async () => await getDataAsync<IProfile, undefined>(BASE_ENDPOINT);

export const getDriverCarAsync = async () => await getDataAsync<CarDetails, undefined>(`${BASE_ENDPOINT}/driver/car`);