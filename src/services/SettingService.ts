import { FirebaseAbstract } from "./FirebaseAbscract";

export class SettingService extends FirebaseAbstract {
  constructor() {
    super("settings");
  }
}
