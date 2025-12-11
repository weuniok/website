/** @jsxImportSource react */

import * as THREE from "three";
import { Planet } from "../orbit-determination/meshes/Planet.react";
import { Rocket } from "../orbit-determination/meshes/Rocket.react";
import { LineOfSight } from "./LineOfSight.react";
import { Telescope } from "./Telescope.react";

export function Scene({
  telescopePosition,
  spacecraftPosition,
  ...props
}: {
  telescopePosition: THREE.Vector3;
  spacecraftPosition: THREE.Vector3;
  [key: string]: any;
}) {
  return (
    <>
      <group>
        <Planet path={"/2k_mars.jpg"} fallbackColor="orange" radius={1} />
        {/* <Target/> */}
        <Telescope
          position={telescopePosition}
          lookAtPosition={spacecraftPosition}
        />
        <Rocket
          scale={[0.002, 0.002, 0.002]}
          rotation={[0, 0, 0]}
          position={spacecraftPosition}
        />
        <LineOfSight
          spacecraftPosition={spacecraftPosition}
          telescopePosition={telescopePosition}
        />
        <LineOfSight
          spacecraftPosition={spacecraftPosition}
          telescopePosition={new THREE.Vector3(0, 0, 0)}
        />
      </group>
    </>
  );
}
