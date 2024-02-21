import { IBase } from "./IBase";

export interface IRubro extends IBase {
  nombre: string;
  idRubroPadre?: IRubro;
}
