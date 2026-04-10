import { getAuthTokens } from "../token";

export function getFullNameLatters(fullname?: string) {
    if(!fullname) return 'N/A'
    const names = fullname.split(' ');
    if(names.length > 1){
        return `${fullname[0]}${names[1][0]}`.toUpperCase();
    }
    return `${names[0][0]}${names[0][1]}`.toUpperCase();
}

export async function IsDriver(): Promise<boolean> {
    return await getAuthTokens().then(token => token?.IsDriver) ?? false
}