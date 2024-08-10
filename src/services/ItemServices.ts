import { FirebaseAbstract } from "./FirebaseAbscract";

export class ItemService extends FirebaseAbstract {
    constructor() {
        super("sharedItems");
    }
}