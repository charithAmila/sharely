import { FirebaseAbstract } from "./FirebaseAbscract";

export class TagService extends FirebaseAbstract {
    constructor() {
        super("tags");
    }
}