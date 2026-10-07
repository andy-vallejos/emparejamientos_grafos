import { useState } from "react";
import { GraphCanvas } from "../components/GraphCanvas";
import { GraphSidebar } from "../components/GraphSidebar";
import type { Vertice, Arista } from "../types/graph.types";

export function GraphPage() {
  const [vertices, setVertices] = useState<Vertice[]>([]);
  const [aristas, setAristas] = useState<Arista[]>([]);

  const [emparejamientoSeleccionado, setEmparejamientoSeleccionado] = useState<
    Arista[]
  >([]);

  const definirVertices = (cantidad: number) => {
    const centroX = 400;
    const centroY = 250;
    const radio = 180;

    const nuevosVertices: Vertice[] = Array.from(
      { length: cantidad },
      (_, index) => {
        const angulo = (2 * Math.PI * index) / cantidad - Math.PI / 2;

        return {
          id: index + 1,
          x: centroX + radio * Math.cos(angulo),
          y: centroY + radio * Math.sin(angulo),
        };
      },
    );

    setVertices(nuevosVertices);
    setAristas([]);
    setEmparejamientoSeleccionado([]);
  };

  const actualizarVertice = (id: number, x: number, y: number) => {
    setVertices((verticesActuales) =>
      verticesActuales.map((vertice) =>
        vertice.id === id ? { ...vertice, x, y } : vertice,
      ),
    );
  };

  const agregarArista = (origen: number, destino: number) => {
    setAristas((aristasActuales) => {
      const yaExiste = aristasActuales.some(
        (arista) =>
          (arista.origen === origen && arista.destino === destino) ||
          (arista.origen === destino && arista.destino === origen),
      );

      if (yaExiste) {
        return aristasActuales;
      }

      return [
        ...aristasActuales,
        {
          origen,
          destino,
        },
      ];
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#09090b] text-zinc-100">
      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 py-6">
        <section className="grid min-h-0 w-full gap-6 px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <GraphSidebar
            definirVertices={definirVertices}
            vertices={vertices}
            aristas={aristas}
            seleccionarEmparejamiento={setEmparejamientoSeleccionado}
          />

          <section className="flex min-h-0 flex-col rounded-xl border border-zinc-800 bg-[#0f0f12] p-6">
            <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <GraphCanvas
                vertices={vertices}
                aristas={aristas}
                emparejamientoSeleccionado={emparejamientoSeleccionado}
                actualizarVertice={actualizarVertice}
                agregarArista={agregarArista}
              />
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
