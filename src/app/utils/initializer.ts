import { InitializeAppService } from "../services/initialize.app.service";

export function initializeFactory(init: InitializeAppService) {
    return async () => await init.initializeApp();
  }
  