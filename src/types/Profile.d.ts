export interface IProfile{
    id: string,
    fullName: string,
    gender: IGender,
    createdAt: string,
    userImage: string,
    phoneNumber: string,
    isDriver: boolean,
    phoneNumberConfirmed: boolean,
    driverId: number
}