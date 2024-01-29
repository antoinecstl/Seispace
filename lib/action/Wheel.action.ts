
export async function calculateFinalAngle (finalAngle: number) {
  const randomAngle = Math.floor(Math.random() * 10 * 360 * 10);
  const calcAngle = finalAngle + randomAngle
  console.log("Angle Server :", calcAngle)
  return calcAngle ;
};



export const spinWheel = async (finalAngle: number) => {
  const final = await calculateFinalAngle(finalAngle)
  return final
}

export async function startTimer() {
  let remaining = 30;
  const intervalId = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(intervalId);
    }
  }, 1000);
  return () => remaining;
}

// Convert polar coordinates to Cartesian for SVG path
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  export function describeArc (x: number, y: number, radius: number, innerRadius: number, startAngle: number, endAngle: number) {
    const startOuter = polarToCartesian(x, y, radius, endAngle);
    const endOuter = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);

    return [
      'M', startOuter.x, startOuter.y,
      'A', radius, radius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      'L', endInner.x, endInner.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
      'Z'
    ].join(' ');
  };


  


