import { useEffect, useRef, useState } from "react";

import type { Vertice, Arista } from "../types/graph.types";

interface GraphCanvasProps {
  vertices: Vertice[];
  aristas: Arista[];
  emparejamientoSeleccionado: Arista[];
  actualizarVertice: (id: number, x: number, y: number) => void;
  agregarArista: (origen: number, destino: number) => void;
}

export function GraphCanvas({
  vertices,
  aristas,
  emparejamientoSeleccionado,
  actualizarVertice,
  agregarArista,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [verticeSeleccionado, setVerticeSeleccionado] = useState<number | null>(
    null,
  );

  const verticeArrastrado = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    aristas.forEach((arista) => {
      const origen = vertices.find((vertice) => vertice.id === arista.origen);

      const destino = vertices.find((vertice) => vertice.id === arista.destino);

      if (!origen || !destino) return;
      const esEmparejamiento = emparejamientoSeleccionado.some(
        (e) =>
          (e.origen === arista.origen && e.destino === arista.destino) ||
          (e.origen === arista.destino && e.destino === arista.origen),
      );
      ctx.beginPath();

      ctx.moveTo(origen.x, origen.y);
      ctx.lineTo(destino.x, destino.y);

      ctx.strokeStyle = esEmparejamiento ? "#22c55e" : "#71717a";
      ctx.lineWidth = esEmparejamiento ? 5 : 3;

      ctx.stroke();
    });
    vertices.forEach((vertice) => {
      const seleccionado = vertice.id === verticeSeleccionado;

      ctx.beginPath();

      ctx.arc(vertice.x, vertice.y, 20, 0, Math.PI * 2);

      ctx.fillStyle = seleccionado ? "#22c55e" : "#2563eb";

      ctx.fill();

      ctx.strokeStyle = "#93c5fd";
      ctx.lineWidth = 2;

      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "14px";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(String(vertice.id), vertice.x, vertice.y);
    });
  }, [vertices, aristas, verticeSeleccionado, emparejamientoSeleccionado]);

  const obtenerPosicionMouse = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    const escalaX = canvas.width / rect.width;
    const escalaY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * escalaX,

      y: (event.clientY - rect.top) * escalaY,
    };
  };

  const encontrarVertice = (x: number, y: number) => {
    return vertices.find((vertice) => {
      const distanciaX = x - vertice.x;
      const distanciaY = y - vertice.y;

      const distancia = Math.sqrt(distanciaX ** 2 + distanciaY ** 2);

      return distancia <= 20;
    });
  };

  const manejarMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const posicion = obtenerPosicionMouse(event);

    if (!posicion) return;

    const vertice = encontrarVertice(posicion.x, posicion.y);

    if (!vertice) return;

    verticeArrastrado.current = vertice.id;
  };

  const manejarMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const id = verticeArrastrado.current;

    if (id === null) return;

    const posicion = obtenerPosicionMouse(event);

    if (!posicion) return;

    actualizarVertice(id, posicion.x, posicion.y);
  };

  const manejarMouseUp = () => {
    verticeArrastrado.current = null;
  };

  const manejarClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const posicion = obtenerPosicionMouse(event);

    if (!posicion) return;

    const vertice = encontrarVertice(posicion.x, posicion.y);

    if (!vertice) return;

    if (verticeSeleccionado === null) {
      setVerticeSeleccionado(vertice.id);
      return;
    }

    if (verticeSeleccionado === vertice.id) {
      setVerticeSeleccionado(null);
      return;
    }

    agregarArista(verticeSeleccionado, vertice.id);

    setVerticeSeleccionado(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      className="h-full w-full rounded-lg"
      onMouseDown={manejarMouseDown}
      onMouseMove={manejarMouseMove}
      onMouseUp={manejarMouseUp}
      onMouseLeave={manejarMouseUp}
      onClick={manejarClick}
    />
  );
}
