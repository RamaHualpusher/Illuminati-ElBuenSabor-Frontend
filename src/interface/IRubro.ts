import { IBase } from "./IBase";

export interface IRubro extends IBase {
  nombre: string;
  idRubroPadre?: IRubro;
}

//el simbolo ? indica que el id puede no traer informacion
