export class Booking{
    constructor(
        public id:string,
        public placeId:string,
        public userId: string,
        public title:string,
        public imageUrl:string,
        public guestNumber: number
    ){}
}