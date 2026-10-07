import { useState } from "react";
import type { Vertice, Arista } from "../types/graph.types";
import { evaluarEmparejamiento } from "../hooks/evaluarEmparejamiento";
import type { ResultadoEmparejamiento } from "../types/graph.types";

interface GraphSidebarProps {
  definirVertices: (cantidad: number) => void;
  vertices: Vertice[];
  aristas: Arista[];
  seleccionarEmparejamiento: (emparejamiento: Arista[]) => void;
}

export function GraphSidebar({
  definirVertices,
  vertices,
  aristas,
  seleccionarEmparejamiento,
}: GraphSidebarProps) {
  const [cantidadVertices, setCantidadVertices] = useState("");
  const [emparejamientos, setEmparejamientos] = useState<
    ResultadoEmparejamiento[]
  >([]);
  const [emparejamientoSeleccionado, setEmparejamientoSeleccionado] = useState<
    number | null
  >(null);

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0f0f12]">
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-5">
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();

            const cantidad = Number(cantidadVertices);

            if (cantidad <= 0) return;

            definirVertices(cantidad);
          }}
        >
          <div>
            <label className="text-xs font-medium text-zinc-300">
              Numero de vertices
            </label>
          </div>

          <input
            type="number"
            min="1"
            className="rounded-lg border border-zinc-800 bg-[#09090b] px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
            placeholder="Numero de vertices"
            value={cantidadVertices}
            onChange={(event) => setCantidadVertices(event.target.value)}
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
          >
            Cargar grafo
          </button>
        </form>

        <section className="border-t border-zinc-800 pt-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-4">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Orden
              </span>

              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100">
                {vertices.length}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-4">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Tamaño
              </span>

              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100">
                {aristas.length}
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 pt-6">
          <button
            onClick={() => {
              const res = evaluarEmparejamiento(aristas, vertices);
              setEmparejamientos(res);
            }}
            className="w-full rounded-lg border border-blue-500/20 bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
          >
            Encontrar emparejamientos
          </button>
        </section>

        {emparejamientos.length > 0 && (
          <section className="border-t border-zinc-800 pt-6">
            <div className="flex flex-col gap-2">
              {emparejamientos.map((elemento, index) => (
                <article
                  key={index}
                  onClick={() => {
                    setEmparejamientoSeleccionado(index);
                    seleccionarEmparejamiento(elemento.emparejamiento);
                  }}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    emparejamientoSeleccionado === index
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-zinc-800 bg-[#09090b] hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold text-zinc-200">
                      Emparejamiento {index + 1}
                    </h2>
                  </div>
                  <div className="flex gap-4 mt-5">
                    {elemento.emparejamiento.map((el, index) => {
                      return (
                        <h1
                          key={index}
                          className="border border-zinc-800 p-1 rounded-md"
                        >
                          {el.origen} - {el.destino}
                        </h1>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    {elemento.esPerfecto && (
                      <span className="rounded-md px-2 py-1 text-[10px] font-medium text-emerald-400">
                        Perfecto
                      </span>
                    )}

                    {elemento.esMaximo && (
                      <span className="rounded-md px-2 py-1 text-[10px] font-medium text-blue-400">
                        Maximo
                      </span>
                    )}

                    {elemento.esMaximal && (
                      <span className="rounded-md  px-2 py-1 text-[10px] font-medium text-white-400">
                        Maximal
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
