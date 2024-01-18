export const Starfield = () => {
  const starVertices = [];
  for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000; // make sure stars are created behind our globe (push them in the negative z direction)
    starVertices.push(x, y, z);
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(starVertices), 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="white" transparent={true} size={0.4} />
    </points>
  );
};
