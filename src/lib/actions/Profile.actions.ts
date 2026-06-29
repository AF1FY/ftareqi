'use server'
import {getDataAsync} from './Base.actions'
import { IProfile } from '@/types/Profile';
import { CarDetails, DriverDetails, IDriverProfileModal } from '@/types/Driver';

const BASE_ENDPOINT = 'api/Profile';

export const getProfileAsync = async () => await getDataAsync<IProfile, undefined>(BASE_ENDPOINT);

export const getDriverDetails = async () => getDataAsync<DriverDetails, undefined>(`${BASE_ENDPOINT}/driver`);

export const getDriverCarAsync = async () => await getDataAsync<CarDetails, undefined>(`${BASE_ENDPOINT}/driver/car`);

export const getTripDriverDetailsAsync = async (driverId: string) =>
  getDataAsync<IDriverProfileModal, undefined>(`${BASE_ENDPOINT}/driver/${driverId}`);