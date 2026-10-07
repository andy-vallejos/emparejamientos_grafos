import type {
  Vertice,
  Arista,
  ResultadoEmparejamiento,
} from "../types/graph.types";

function encontrarEmparejamiento(listaDeParejas: number[][]): number[][] {
  const usados: number[] = [];
  const res: number[][] = [];

  for (let i = 0; i < listaDeParejas.length; i++) {
    const parejaActual = listaDeParejas[i];
    const verticeA = parejaActual[0];
    const verticeB = parejaActual[1];

    if (!usados.includes(verticeA) && !usados.includes(verticeB)) {
      res.push([...parejaActual]);
      usados.push(verticeA, verticeB);
    }
  }

  return res;
}

function esRepetido(
  emparejamientoActual: number[][],
  todos: number[][][],
): boolean {
  const actual = emparejamientoActual
    .map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`))
    .sort();

  for (const emparejamiento of todos) {
    const anterior = emparejamiento
      .map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`))
      .sort();

    if (
      actual.length === anterior.length &&
      actual.every((pareja, index) => pareja === anterior[index])
    ) {
      return true;
    }
  }

  todos.push(emparejamientoActual.map((pareja) => [...pareja]));

  return false;
}

function esMaximal(emparejamiento: number[][], aristas: number[][]): boolean {
  for (const edge of aristas) {
    const [a, b] = edge;
    const aUsado = emparejamiento.some(([x, y]) => x === a || y === a);
    const bUsado = emparejamiento.some(([x, y]) => x === b || y === b);

    if (!aUsado && !bUsado) {
      return false;
    }
  }

  return true;
}

export function evaluarEmparejamiento(
  aristas: Arista[],
  vertices: Vertice[],
): ResultadoEmparejamiento[] {
  let contador = 0;
  const todos: number[][][] = [];

  const listaDeParejas: number[][] = aristas.map((arista) => [
    arista.origen,
    arista.destino,
  ]);

  while (contador < listaDeParejas.length) {
    const res = encontrarEmparejamiento(listaDeParejas);

    esRepetido(res, todos);

    const primeraPareja = listaDeParejas.shift()!;

    listaDeParejas.push(primeraPareja);

    contador++;
  }

  const tamañoMaximo =
    todos.length > 0
      ? Math.max(...todos.map((emparejamiento) => emparejamiento.length))
      : 0;

  const resultados: ResultadoEmparejamiento[] = [];

  for (const emparejamiento of todos) {
    const tamanio = emparejamiento.length;
    const maximal = esMaximal(emparejamiento, listaDeParejas);
    const maximo = tamanio === tamañoMaximo;
    const verticesUsados = emparejamiento.flat();
    const perfecto = vertices.every((vertice) =>
      verticesUsados.includes(vertice.id),
    );

    resultados.push({
      emparejamiento: emparejamiento.map(([origen, destino]) => ({
        origen,
        destino,
      })),
      tamanio,
      esMaximal: maximal,
      esMaximo: maximo,
      esPerfecto: perfecto,
    });
  }

  return resultados;
}
