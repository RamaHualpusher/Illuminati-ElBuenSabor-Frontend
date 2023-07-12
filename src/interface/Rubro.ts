import Base from "./IBase";

export interface Rubro extends Base{
    idRubro: number;
    nombre: string;  
    idRubroPadre?: Rubro;
    //el simbolo ? indica que el id puede no traer informacion
  }