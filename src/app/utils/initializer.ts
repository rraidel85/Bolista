import { InitializeAppService } from "../services/initialize.app.service";

export function initializeFactory(init: InitializeAppService) {
    return () => init.initializeApp();
  }
  