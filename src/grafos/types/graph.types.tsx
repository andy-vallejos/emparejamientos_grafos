export type Vertice = {
  id: number;
  x: number;
  y: number;
};

export type Arista = { origen: number; destino: number };

export interface ResultadoEmparejamiento {
  emparejamiento: Arista[];
  tamanio: number;
  esMaximal: boolean;
  esMaximo: boolean;
  esPerfecto: boolean;
}
