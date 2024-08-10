import { FirebaseAbstract } from "./FirebaseAbscract";

export class TagService extends FirebaseAbstract {
    constructor(uid: string) {
        super("users/" + uid + "/tags");
    }
}