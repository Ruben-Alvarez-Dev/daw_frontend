import React, { useRef, useState, useEffect } from 'react';
import { Layer, Rect, Transformer } from 'react-konva';
import BaseEditor from './BaseEditor';
import { GRID_SIZE } from './constants';

const TEXTURES = {
    wall: { fill: '#8B7355', stroke: '#000000' },
    window: { fill: '#87CEEB', stroke: '#4682B4' },
    column: { fill: '#A0522D', stroke: '#8B4513' },
    vegetation: { fill: '#228B22', stroke: '#006400' },
    surface: { fill: '#D3D3D3', stroke: '#A9A9A9' }
};

const MapPreview = ({ 
    mapData, 
    selectedTool = 'select',
    onAddElement,
    onUpdateElement,
    onDeleteElement 
}) => {
    const [selectedId, setSelectedId] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(null);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const transformerRef = useRef();
    const layerRef = useRef();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.shiftKey) setIsShiftPressed(true);
            if (e.key === 'Delete' && selectedId) {
                onDeleteElement(selectedId);
                setSelectedId(null);
            }
        };

        const handleKeyUp = (e) => {
            if (!e.shiftKey) setIsShiftPressed(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [selectedId, onDeleteElement]);

    const snapToGrid = (point) => {
        return {
            x: Math.round(point.x / GRID_SIZE) * GRID_SIZE,
            y: Math.round(point.y / GRID_SIZE) * GRID_SIZE
        };
    };

    const calculateOrthoPoint = (start, end) => {
        if (!isShiftPressed) return end;

        const dx = end.x - start.x;
        const dy = end.y - start.y;
        
        // Si la diferencia en X es mayor que en Y, hacemos una línea horizontal
        if (Math.abs(dx) > Math.abs(dy)) {
            return { 
                x: end.x, 
                y: start.y,
                isHorizontal: true 
            };
        } else {
            // Si no, hacemos una línea vertical
            return { 
                x: start.x, 
                y: end.y,
                isHorizontal: false 
            };
        }
    };

    const handleMouseDown = (e) => {
        // Evitar la propagación si estamos haciendo click en un anchor o en el transformer
        if (e.target.getClassName() === 'Transformer' || 
            e.target.getClassName() === 'Anchor' ||
            e.target.getClassName() === '_anchor') {
            return;
        }

        if (selectedTool === 'select') {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) {
                setSelectedId(null);
                return;
            }
            const id = e.target.id();
            setSelectedId(id);
            return;
        }

        if (e.target === e.target.getStage()) {
            const pos = snapToGrid(e.target.getStage().getPointerPosition());
            setStartPoint(pos);
            setIsDrawing(true);
            setSelectedId(null);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || selectedTool === 'select') return;

        const pos = snapToGrid(e.target.getStage().getPointerPosition());
        const endPoint = isShiftPressed ? calculateOrthoPoint(startPoint, pos) : pos;
        
        // Para muros, aseguramos un ancho mínimo cuando es ortogonal
        let width = Math.abs(endPoint.x - startPoint.x);
        let height = Math.abs(endPoint.y - startPoint.y);

        if (selectedTool === 'wall' && isShiftPressed) {
            if (endPoint.isHorizontal) {
                height = GRID_SIZE; // Una cuadrícula de alto para muros horizontales
            } else {
                width = GRID_SIZE; // Una cuadrícula de ancho para muros verticales
            }
        }
        
        const previewElement = {
            id: 'preview',
            type: selectedTool,
            x: Math.min(startPoint.x, endPoint.x),
            y: Math.min(startPoint.y, endPoint.y),
            width: width,
            height: height
        };

        const layer = layerRef.current;
        const previewNode = layer.findOne('#preview');
        if (previewNode) {
            previewNode.destroy();
        }
        
        const rect = new Rect({
            id: 'preview',
            ...previewElement,
            stroke: '#00ff00',
            strokeWidth: 2,
            dash: [5, 5]
        });
        layer.add(rect);
        layer.batchDraw();
    };

    const handleMouseUp = () => {
        if (!isDrawing || selectedTool === 'select') return;

        const stage = layerRef.current.getStage();
        const pos = snapToGrid(stage.getPointerPosition());
        const endPoint = isShiftPressed ? calculateOrthoPoint(startPoint, pos) : pos;

        // Aplicamos la misma lógica que en el preview
        let width = Math.abs(endPoint.x - startPoint.x);
        let height = Math.abs(endPoint.y - startPoint.y);

        if (selectedTool === 'wall' && isShiftPressed) {
            if (endPoint.isHorizontal) {
                height = GRID_SIZE;
            } else {
                width = GRID_SIZE;
            }
        }

        if (width >= GRID_SIZE || height >= GRID_SIZE) {
            const newElement = {
                id: Date.now().toString(),
                type: selectedTool,
                x: Math.min(startPoint.x, endPoint.x),
                y: Math.min(startPoint.y, endPoint.y),
                width: width,
                height: height,
                rotation: 0
            };
            onAddElement(newElement);
        }

        setIsDrawing(false);
        setStartPoint(null);
        const layer = layerRef.current;
        const previewNode = layer.findOne('#preview');
        if (previewNode) {
            previewNode.destroy();
        }
        layer.batchDraw();
    };

    return (
        <BaseEditor
            width={800}
            height={600}
            tool={selectedTool}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <Layer ref={layerRef}>
                {mapData.map((element) => (
                    <Rect
                        key={element.id}
                        id={element.id}
                        {...element}
                        {...TEXTURES[element.type]}
                        onClick={(e) => {
                            if (selectedTool === 'select') {
                                e.cancelBubble = true;
                                setSelectedId(element.id);
                            }
                        }}
                        onMouseDown={(e) => {
                            if (selectedTool === 'select') {
                                e.cancelBubble = true;
                            }
                        }}
                        stroke={selectedId === element.id ? "#00ff00" : "#000"}
                        strokeWidth={2}
                        draggable={selectedTool === 'select'}
                        onTransform={(e) => {
                            e.cancelBubble = true;
                            const node = e.target;
                            node.getLayer().batchDraw();
                        }}
                        onTransformEnd={(e) => {
                            e.cancelBubble = true;
                            const node = e.target;
                            const scaleX = node.scaleX();
                            const scaleY = node.scaleY();
                            const rotation = node.rotation();

                            node.scaleX(1);
                            node.scaleY(1);

                            onUpdateElement({
                                ...element,
                                x: Math.round(node.x() / GRID_SIZE) * GRID_SIZE,
                                y: Math.round(node.y() / GRID_SIZE) * GRID_SIZE,
                                width: Math.round(Math.max(GRID_SIZE, node.width() * scaleX) / GRID_SIZE) * GRID_SIZE,
                                height: Math.round(Math.max(GRID_SIZE, node.height() * scaleY) / GRID_SIZE) * GRID_SIZE,
                                rotation: rotation
                            });
                        }}
                        onDragEnd={(e) => {
                            e.cancelBubble = true;
                            const pos = snapToGrid(e.target.position());
                            onUpdateElement({
                                ...element,
                                x: pos.x,
                                y: pos.y
                            });
                        }}
                    />
                ))}
                {selectedId && selectedTool === 'select' && (
                    <Transformer
                        ref={transformerRef}
                        boundBoxFunc={(oldBox, newBox) => {
                            if (newBox.width < GRID_SIZE || newBox.height < GRID_SIZE) {
                                return oldBox;
                            }
                            const snapped = {
                                ...newBox,
                                width: Math.round(newBox.width / GRID_SIZE) * GRID_SIZE,
                                height: Math.round(newBox.height / GRID_SIZE) * GRID_SIZE,
                            };
                            return snapped;
                        }}
                        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                        rotateEnabled={true}
                        resizeEnabled={true}
                        rotateAnchorOffset={30}
                        anchorFill="#fff"
                        anchorStroke="#00ff00"
                        anchorSize={10}
                        anchorCornerRadius={5}
                        borderStroke="#00ff00"
                        borderDash={[]}
                        padding={5}
                        keepRatio={false}
                        rotationSnaps={isShiftPressed ? [0, 45, 90, 135, 180, 225, 270, 315] : []}
                        onMouseDown={(e) => {
                            e.cancelBubble = true;
                        }}
                    />
                )}
            </Layer>
        </BaseEditor>
    );
};

export default MapPreview;
