import { Bid } from "./Bid";
import { Image } from "./Image";

export class Item {
    id: number;
    bids: Bid[];
    images: Image[];
    name: string;
    price: string;
    description: string;
    max_bid_value: string;
    close_datetime: string;

    isClosed(): boolean {
        const closeDatetime = new Date(this.close_datetime);
        const current = new Date();
        if (closeDatetime.getTime() <= current.getTime())
            return true;
        return false;
    }

}