export interface Domicilio {
  idDomicilio: number;
  calle: string;
  numero: number;
  localidad: string;
}

export interface AddDireccionModalProps {
  show: boolean;
  handleClose: () => void;
  handleDireccionAdd: (domicilio: Domicilio) => void;
}

export interface EditDireccionModalProps {
  show: boolean;
  handleClose: () => void;
  handleDireccionEdit: (domicilio: Domicilio) => void;
  selectedDireccion: Domicilio | null;
}
