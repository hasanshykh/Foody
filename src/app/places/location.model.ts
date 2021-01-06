export interface Coordinates{
    lat:number;
    lng:number;
}

export interface donarLoaction extends Coordinates{
    address: string;
    mapImageUrl: string;
}