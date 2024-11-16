/** @jsxImportSource react */

export const OrbitalElementsController = ({
  elements,
  setElements,
}: {
  elements: OrbitalElements;
  setElements: (elements: OrbitalElements) => void;
}) => {
  return (
    <div
      style={{
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <ElementSlider
        label="Semi-Major Axis"
        value={elements.semiMajorAxis}
        min={1}
        max={10}
        step={0.1}
        onChange={(value) => setElements({ ...elements, semiMajorAxis: value })}
      />

      <ElementSlider
        label="Eccentricity"
        value={elements.eccentricity}
        min={0}
        max={0.99}
        step={0.01}
        onChange={(value) => setElements({ ...elements, eccentricity: value })}
      />

      <ElementSlider
        label="Inclination"
        value={elements.inclination}
        min={0}
        max={Math.PI * 2}
        step={0.01}
        onChange={(value) => setElements({ ...elements, inclination: value })}
        formatDisplay={(value) => (value * (180 / Math.PI)).toFixed(0) + "°"}
      />

      <ElementSlider
        label="Longitude of Ascending Node"
        value={elements.longitudeOfAscendingNode}
        min={0}
        max={2 * Math.PI}
        step={0.01}
        onChange={(value) =>
          setElements({ ...elements, longitudeOfAscendingNode: value })
        }
        formatDisplay={(value) => (value * (180 / Math.PI)).toFixed(0) + "°"}
      />

      <ElementSlider
        label="Argument of Periapsis"
        value={elements.argumentOfPeriapsis}
        min={0}
        max={2 * Math.PI}
        step={0.01}
        onChange={(value) =>
          setElements({ ...elements, argumentOfPeriapsis: value })
        }
        formatDisplay={(value) => (value * (180 / Math.PI)).toFixed(0) + "°"}
      />

      <ElementSlider
        label="True Anomaly"
        value={elements.trueAnomaly}
        min={0}
        max={2 * Math.PI}
        step={0.01}
        onChange={(value) => setElements({ ...elements, trueAnomaly: value })}
        formatDisplay={(value) => (value * (180 / Math.PI)).toFixed(0) + "°"}
      />
    </div>
  );
};

const ElementSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatDisplay = (value) => value.toFixed(2),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatDisplay?: (value: number) => string;
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="font-bold">{label}:</label>
      <div className="flex w-1/2 items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="h-7 w-full appearance-none rounded-full bg-gray-300 outline-none"
        />
        <b className="ml-2 w-16 text-center">{formatDisplay(value)}</b>
      </div>
    </div>
  );
};
