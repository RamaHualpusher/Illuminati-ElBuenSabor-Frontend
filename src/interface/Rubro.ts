export interface Rubro {
    idRubro: number;
    nombre: string;  
    idRubroPadre?: number;
    //el simbolo ? indica que el id puede ser nulo
  }