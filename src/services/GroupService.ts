import { FirebaseAbstract } from "./FirebaseAbscract";

export class GroupService extends FirebaseAbstract {
    constructor() {
        super("groups");
    }
}