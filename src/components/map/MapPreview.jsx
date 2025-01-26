import React, { useRef, useEffect, useState } from 'react';
import './MapPreview.css';

// Texturas predefinidas
const TEXTURES = {
    vegetation: {
        pattern: '',
        size: 20,
        opacity: 0.5,
        color: '#228B22',
        backgroundColor: '#90EE90'
    },
    surface: {
        pattern: '',
        size: 15,
        opacity: 0.3,
        color: '#8B7355',
        backgroundColor: '#D2B48C'
    },
    furniture: {
        pattern: '',
        size: 12,
        opacity: 0.3,
        color: '#2F1810',
        backgroundColor: '#4A3728'
    },
    window: {
        pattern: '',
        size: 10,
        opacity: 0.1,
        color: '#87CEEB',
        backgroundColor: 'rgba(135, 206, 235, 0.2)'
    }
};

export default function MapPreview({ 
    elements = [], 
    selectedTool = 'select', 
    onAddElement, 
    onUpdateElement,
    onDeleteElement
}) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [dragMode, setDragMode] = useState(null);
    const [dragStartPoint, setDragStartPoint] = useState(null);
    const [originalElement, setOriginalElement] = useState(null);
    const [selectedControlPoint, setSelectedControlPoint] = useState(null);
    const [currentPoint, setCurrentPoint] = useState({ x: 0, y: 0 });

    // Redibujar cuando cambien los elementos o el elemento seleccionado
    useEffect(() => {
        drawCanvas();
    }, [elements, selectedElement, isDrawing, startPoint]);

    const drawElement = (ctx, element, isSelected = false) => {
        if (!element) return;

        ctx.beginPath();
        ctx.save();

        // Si el elemento tiene rotación, aplicarla
        if (element.rotation) {
            const centerX = element.type === 'column' ? element.x : element.x + element.width / 2;
            const centerY = element.type === 'column' ? element.y : element.y + element.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(element.rotation);
            ctx.translate(-centerX, -centerY);
        }

        switch (element.type) {
            case 'wall':
                ctx.moveTo(element.x1, element.y1);
                ctx.lineTo(element.x2, element.y2);
                ctx.lineWidth = 10;
                ctx.strokeStyle = '#666';
                ctx.stroke();
                break;

            case 'door':
                ctx.moveTo(element.x1, element.y1);
                ctx.lineTo(element.x2, element.y2);
                ctx.lineWidth = 10;
                ctx.strokeStyle = '#964B00';
                ctx.stroke();
                break;

            case 'column':
                ctx.arc(element.x, element.y, element.radius || 10, 0, Math.PI * 2);
                ctx.fillStyle = '#666';
                ctx.fill();
                break;

            case 'window':
                ctx.rect(element.x, element.y, element.width, element.height);
                ctx.fillStyle = '#87CEEB';
                ctx.strokeStyle = '#4A90E2';
                ctx.lineWidth = 2;
                ctx.fill();
                ctx.stroke();
                break;

            case 'furniture':
                ctx.rect(element.x, element.y, element.width, element.height);
                ctx.fillStyle = '#8B4513';
                ctx.strokeStyle = '#4A3728';
                ctx.lineWidth = 2;
                ctx.fill();
                ctx.stroke();
                break;

            case 'vegetation':
                ctx.rect(element.x, element.y, element.width, element.height);
                ctx.fillStyle = '#228B22';
                ctx.strokeStyle = '#006400';
                ctx.lineWidth = 2;
                ctx.fill();
                ctx.stroke();
                break;

            case 'surface':
                ctx.rect(element.x, element.y, element.width, element.height);
                ctx.fillStyle = '#DEB887';
                ctx.strokeStyle = '#8B7355';
                ctx.lineWidth = 1;
                ctx.fill();
                ctx.stroke();
                break;

            default:
                ctx.rect(element.x, element.y, element.width, element.height);
                ctx.fillStyle = element.color || '#964B00';
                ctx.fill();
                break;
        }

        ctx.restore();

        if (isSelected) {
            drawSelectionControls(ctx, element);
        }
    };

    const drawSelectionControls = (ctx, element) => {
        const padding = 5;
        
        ctx.strokeStyle = '#32CD32';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        if (element.type === 'column') {
            const radius = element.radius + padding;
            ctx.beginPath();
            ctx.arc(element.x, element.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (element.type === 'wall' || element.type === 'door') {
            ctx.beginPath();
            ctx.moveTo(element.x1, element.y1);
            ctx.lineTo(element.x2, element.y2);
            ctx.stroke();
        } else {
            ctx.strokeRect(
                element.x - padding,
                element.y - padding,
                element.width + padding * 2,
                element.height + padding * 2
            );
        }
        
        ctx.setLineDash([]);
        
        const controlPoints = getControlPoints(element);
        controlPoints.forEach(point => {
            ctx.beginPath();
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#32CD32';
            ctx.lineWidth = 1;
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    };

    const getControlPoints = (element) => {
        if (!element) return [];

        switch (element.type) {
            case 'wall':
            case 'door':
                return [
                    { x: element.x1, y: element.y1, edge: 'start' },
                    { x: element.x2, y: element.y2, edge: 'end' }
                ];

            case 'column':
                const radius = element.radius || 10;
                return [
                    { x: element.x + radius, y: element.y, edge: 'right' },
                    { x: element.x - radius, y: element.y, edge: 'left' },
                    { x: element.x, y: element.y + radius, edge: 'bottom' },
                    { x: element.x, y: element.y - radius, edge: 'top' }
                ];

            default:
                return [
                    // Esquinas
                    { x: element.x, y: element.y, edge: 'topLeft' },
                    { x: element.x + element.width, y: element.y, edge: 'topRight' },
                    { x: element.x + element.width, y: element.y + element.height, edge: 'bottomRight' },
                    { x: element.x, y: element.y + element.height, edge: 'bottomLeft' },
                    // Bordes medios
                    { x: element.x + element.width / 2, y: element.y, edge: 'top' },
                    { x: element.x + element.width, y: element.y + element.height / 2, edge: 'right' },
                    { x: element.x + element.width / 2, y: element.y + element.height, edge: 'bottom' },
                    { x: element.x, y: element.y + element.height / 2, edge: 'left' }
                ];
        }
    };

    const isPointInElement = (x, y, element) => {
        if (!element) return false;

        const tolerance = 5;

        switch (element.type) {
            case 'wall':
            case 'door':
                // Distancia del punto a la línea
                const A = y - element.y1;
                const B = element.x2 - element.x1;
                const C = element.y2 - element.y1;
                const D = x - element.x1;
                
                const dot = A * B + C * D;
                const len_sq = B * B + C * C;
                
                let param = -1;
                if (len_sq !== 0) param = dot / len_sq;
                
                let xx, yy;
                
                if (param < 0) {
                    xx = element.x1;
                    yy = element.y1;
                } else if (param > 1) {
                    xx = element.x2;
                    yy = element.y2;
                } else {
                    xx = element.x1 + param * B;
                    yy = element.y1 + param * C;
                }
                
                const dx = x - xx;
                const dy = y - yy;
                
                return Math.sqrt(dx * dx + dy * dy) <= tolerance;

            case 'column':
                const radius = element.radius || 10;
                return Math.hypot(x - element.x, y - element.y) <= radius + tolerance;

            default:
                return x >= element.x - tolerance &&
                       x <= element.x + element.width + tolerance &&
                       y >= element.y - tolerance &&
                       y <= element.y + element.height + tolerance;
        }
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar la cuadrícula
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        const gridSize = 20;

        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Dibujar los elementos
        elements.forEach(element => {
            drawElement(ctx, element, element === selectedElement);
        });

        // Dibujar elemento en preview si estamos dibujando
        if (isDrawing && startPoint && selectedTool !== 'select') {
            const previewElement = createElement(selectedTool, startPoint, currentPoint);
            if (previewElement) {
                ctx.globalAlpha = 0.5;
                drawElement(ctx, previewElement);
                ctx.globalAlpha = 1.0;
            }
        }
    };

    const createElement = (type, start, end) => {
        if (!start || !end) return null;

        switch (type) {
            case 'wall':
            case 'door':
                return {
                    type,
                    x1: start.x,
                    y1: start.y,
                    x2: end.x,
                    y2: end.y
                };
            case 'column':
                return {
                    type,
                    x: start.x,
                    y: start.y,
                    radius: Math.max(5, Math.hypot(end.x - start.x, end.y - start.y))
                };
            default:
                const width = Math.abs(end.x - start.x);
                const height = Math.abs(end.y - start.y);
                return {
                    type,
                    x: Math.min(start.x, end.x),
                    y: Math.min(start.y, end.y),
                    width: Math.max(10, width),
                    height: Math.max(10, height)
                };
        }
    };

    const handleMouseDown = (e) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setCurrentPoint({ x: mouseX, y: mouseY });

        if (selectedTool === 'select') {
            const clickedElement = [...elements].reverse().find(element => 
                isPointInElement(mouseX, mouseY, element)
            );

            setSelectedElement(clickedElement || null);
            if (clickedElement) {
                setDragMode('move');
                setDragStartPoint({ x: mouseX, y: mouseY });
                setOriginalElement({ ...clickedElement });
            }
        } else {
            setIsDrawing(true);
            setStartPoint({ x: mouseX, y: mouseY });
        }
    };

    const handleMouseMove = (e) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setCurrentPoint({ x: mouseX, y: mouseY });

        if (dragMode && selectedElement && dragStartPoint) {
            const dx = mouseX - dragStartPoint.x;
            const dy = mouseY - dragStartPoint.y;

            const updatedElement = { ...selectedElement };
            if (selectedElement.type === 'wall' || selectedElement.type === 'door') {
                updatedElement.x1 = originalElement.x1 + dx;
                updatedElement.y1 = originalElement.y1 + dy;
                updatedElement.x2 = originalElement.x2 + dx;
                updatedElement.y2 = originalElement.y2 + dy;
            } else {
                updatedElement.x = originalElement.x + dx;
                updatedElement.y = originalElement.y + dy;
            }

            const elementIndex = elements.findIndex(el => el === selectedElement);
            if (elementIndex !== -1) {
                onUpdateElement(elementIndex, updatedElement);
            }
        }

        drawCanvas();
    };

    const handleMouseUp = () => {
        if (isDrawing && startPoint && selectedTool !== 'select') {
            const newElement = createElement(selectedTool, startPoint, currentPoint);
            if (newElement) {
                onAddElement(newElement);
            }
        }

        setIsDrawing(false);
        setStartPoint(null);
        setDragMode(null);
        setDragStartPoint(null);
        setOriginalElement(null);
    };

    return (
        <div className="map-preview">
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onContextMenu={e => {
                    e.preventDefault();
                    if (selectedElement) {
                        const elementIndex = elements.findIndex(el => el === selectedElement);
                        if (elementIndex !== -1) {
                            onDeleteElement(elementIndex);
                        }
                        setSelectedElement(null);
                    }
                }}
                style={{ 
                    cursor: selectedTool === 'select' ? (dragMode ? 'grabbing' : 'default') : 'crosshair',
                    backgroundColor: 'white'
                }}
            />
        </div>
    );
}
