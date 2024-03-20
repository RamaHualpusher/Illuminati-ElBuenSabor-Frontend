import { IBase } from "./IBase";

export interface IRubro extends IBase {
  nombre: string;
  idRubroPadre?: IRubro;
}
export interface IRubroNew extends IBase{
  nombre: string;
  rubroPadre?: IRubroNew;
  ingredientOwner: boolean;
}
