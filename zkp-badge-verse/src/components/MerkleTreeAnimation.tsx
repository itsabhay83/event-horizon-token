
import React, { useEffect, useRef } from "react";

const MerkleTreeAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Tree structure
    type Node = {
      x: number;
      y: number;
      radius: number;
      color: string;
      alpha: number;
      value: number;
      children?: Node[];
      parent?: Node;
    };

    // Create tree nodes
    const createMerkleTree = (depth: number): Node => {
      const rootNode: Node = {
        x: canvas.width / 2,
        y: 60,
        radius: 8,
        color: "#7B61FF",
        alpha: 0.8,
        value: Math.random(),
      };

      const createChildren = (node: Node, currentDepth: number, maxDepth: number) => {
        if (currentDepth >= maxDepth) return;

        const gap = (canvas.width * 0.8) / Math.pow(2, currentDepth);
        const leftX = node.x - gap / 2;
        const rightX = node.x + gap / 2;
        const y = node.y + canvas.height / (maxDepth + 1);

        const leftChild: Node = {
          x: leftX,
          y: y,
          radius: 6,
          color: currentDepth % 2 === 0 ? "#00FFB3" : "#00C2FF",
          alpha: 0.6,
          value: Math.random(),
          parent: node,
        };

        const rightChild: Node = {
          x: rightX,
          y: y,
          radius: 6,
          color: currentDepth % 2 === 0 ? "#00C2FF" : "#00FFB3",
          alpha: 0.6,
          value: Math.random(),
          parent: node,
        };

        node.children = [leftChild, rightChild];

        createChildren(leftChild, currentDepth + 1, maxDepth);
        createChildren(rightChild, currentDepth + 1, maxDepth);
      };

      createChildren(rootNode, 0, depth);
      return rootNode;
    };

    // Draw tree
    const drawNode = (ctx: CanvasRenderingContext2D, node: Node) => {
      ctx.beginPath();
      ctx.globalAlpha = node.alpha;
      ctx.fillStyle = node.color;
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw connection to parent
      if (node.parent) {
        ctx.beginPath();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1;
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.parent.x, node.parent.y);
        ctx.stroke();
      }
    };

    const drawTree = (ctx: CanvasRenderingContext2D, node: Node) => {
      drawNode(ctx, node);
      node.children?.forEach((child) => drawTree(ctx, child));
    };

    // Animation
    const tree = createMerkleTree(4);
    let animationFrame: number;
    const lastUpdate = Date.now();

    const updateTree = (node: Node) => {
      // Pulse effect
      node.alpha = 0.3 + Math.sin(Date.now() / 1000) * 0.3 + 0.4;
      
      if (Math.random() < 0.001) {
        // Occasionally change node value
        node.value = Math.random();
        node.alpha = 1;
      }
      
      node.children?.forEach(updateTree);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Glow effect
      ctx.shadowColor = "#7B61FF";
      ctx.shadowBlur = 15;
      
      updateTree(tree);
      drawTree(ctx, tree);
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-64 md:h-96 opacity-80"
    />
  );
};

export default MerkleTreeAnimation;
