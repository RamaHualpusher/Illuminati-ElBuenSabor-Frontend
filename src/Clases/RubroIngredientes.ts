export class RubroIngredientes {
    private id: number;
    private nombre: string;
    private activo: boolean;

    constructor(id: number, nombre: string, activo: boolean) {
        this.id = id;
        this.nombre = nombre;
        this.activo = activo;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    public isActivo(): boolean {
        return this.activo;
    }

    public setActivo(activo: boolean): void {
        this.activo = activo;
    }
}
