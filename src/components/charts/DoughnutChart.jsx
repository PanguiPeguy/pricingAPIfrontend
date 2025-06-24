import { useEffect, useRef } from "react";

export const DoughnutChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Configuration du graphique
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const innerRadius = radius * 0.5; // Taille du trou du donut

    // Calculer le total pour les pourcentages
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Dessiner le graphique
    let startAngle = -Math.PI / 2; // Commencer en haut (à midi)

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Dessiner chaque segment
    data.forEach((item) => {
      const sliceAngle = (item.value / total) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      // Dessiner le segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Remplir avec la couleur de la catégorie
      ctx.fillStyle = item.color;
      ctx.fill();

      // Dessiner le trou intérieur pour créer l'effet donut
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = "white";
      ctx.fill();

      startAngle = endAngle;
    });

    // Ajouter le total au centre
    ctx.fillStyle = "black";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Total", centerX, centerY - 10);
    ctx.font = "bold 20px Arial";
    ctx.fillText(total.toString(), centerX, centerY + 15);
  }, [data]);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="max-w-full max-h-full"
      />
    </div>
  );
};

export default DoughnutChart;
