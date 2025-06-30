import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(4);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    socket.on("init", ({ history: h, redoStack: r }) => {
      setHistory(h);
      setRedoStack(r);
      redraw(h);
    });
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    setCurrentStroke([{ x: e.clientX, y: e.clientY }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    setCurrentStroke((prev) => {
      const next = [...prev, { x: e.clientX, y: e.clientY }];
      const last = prev[prev.length - 1];
      drawLine(last, next[next.length - 1], color, lineWidth);
      return next;
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || currentStroke.length < 2) {
      setIsDrawing(false);
      setCurrentStroke([]);
      return;
    }
    const stroke = { points: currentStroke, color, lineWidth };
    socket.emit("drawStroke", stroke);
    setIsDrawing(false);
    setCurrentStroke([]);
    console.log("Stroke:", stroke);
  };

  const drawLine = (from, to, c, w) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const drawStroke = (stroke) => {
    for (let i = 1; i < stroke.points.length; i++) {
      drawLine(
        stroke.points[i - 1],
        stroke.points[i],
        stroke.color,
        stroke.lineWidth
      );
    }
  };

  const redraw = (list) => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    list.forEach(drawStroke);
  };

  const handleUndo = () => socket.emit("undo");
  const handleRedo = () => socket.emit("redo");
  const handleClear = () => socket.emit("clear");

  const handleDownload = () => {
    const canvas = canvasRef.current;

    // Step 1: Create a new temporary canvas
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Set same size as original
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Step 2: Fill white background
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Step 3: Draw original canvas content on top
    tempCtx.drawImage(canvas, 0, 0);

    // Step 4: Download from tempCanvas
    const canvasUrl = tempCanvas.toDataURL("image/png", 1.0);
    const element = document.createElement("a");
    element.setAttribute("href", canvasUrl);
    element.setAttribute("download", "canvas.png");
    element.click();
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20 bg-white shadow-lg rounded-xl p-4 flex flex-wrap gap-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Clear
        </button>
        <button
          onClick={handleUndo}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Redo
        </button>
        <div className="flex items-center gap-2">
          <label>Stroke</label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(e.target.value)}
          />
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 border rounded"
        />
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-screen cursor-crosshair bg-gray-00"
      />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <button
          className="px-4 py-2 bg-cyan-700 text-white shadow-lg rounded-xl"
          onClick={handleDownload}
        >
          Download as Image
        </button>
      </div>
    </>
  );
}

export default App;
