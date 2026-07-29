"use client";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, ImageOverlay, Rectangle } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapData {
  width: number;
  height: number;
  labels: number[];
}

interface ClusterMapProps {
  lat: number;
  lon: number;
  radius: number;
  mapData: MapData;
  clusterColors: string[];
}

export default function ClusterMap({ lat, lon, radius, mapData, clusterColors }: ClusterMapProps) {
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const safeRadius = Math.max(radius, 100);
  const delta = safeRadius / 111000;
  const bounds: LatLngBoundsExpression = [
    [lat - delta, lon - delta],
    [lat + delta, lon + delta],
  ];

  useEffect(() => {
    const { width, height, labels } = mapData;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);
    labels.forEach((clusterLabel, i) => {
      const color = clusterColors[clusterLabel % clusterColors.length];
      const [r, g, b] = hexToRgb(color);
      imageData.data[i * 4] = r;
      imageData.data[i * 4 + 1] = g;
      imageData.data[i * 4 + 2] = b;
      imageData.data[i * 4 + 3] = 200;
    });
    ctx.putImageData(imageData, 0, 0);

    setOverlayUrl(canvas.toDataURL());
  }, [mapData, clusterColors]);

  return (
    <MapContainer
      bounds={bounds}
      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
      />
      {overlayUrl && <ImageOverlay url={overlayUrl} bounds={bounds} />}
      <Rectangle
        bounds={bounds}
        pathOptions={{ color: "#ffffff", weight: 2, fill: false }}
      />
    </MapContainer>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}