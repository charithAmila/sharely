import { FirebaseAbstract } from "./FirebaseAbscract";

export class UserService extends FirebaseAbstract {
    constructor() {
        super("users");
    }
}