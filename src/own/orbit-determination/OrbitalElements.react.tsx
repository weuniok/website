/** @jsxImportSource react */

import { useState } from "react";

import { OrbitalElementsCanvas } from "./OrbitalElementsCanvas.react";
import { OrbitalElementsController } from "./OrbitalElementsController.react";

// Initial orbital elements
const initialOrbitalElements = {
  semiMajorAxis: 3,
  eccentricity: 0.5,
  inclination: Math.PI / 6, // 30 degrees in radians
  longitudeOfAscendingNode: Math.PI / 4,
  argumentOfPeriapsis: Math.PI / 3,
  trueAnomaly: 0,
};

export function OrbitalElementsVisualizer() {
  const [elements, setElements] = useState(initialOrbitalElements);

  return (
    <div style={{ width: "auto", maxWidth: "100%" }}>
      <OrbitalElementsCanvas elements={elements} />
      <OrbitalElementsController
        elements={elements}
        setElements={setElements}
      />
    </div>
  );
}
