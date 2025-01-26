import React, { useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { GRID_SIZE } from './constants';

const BaseEditor = ({ 
    children, 
    width = 800, 
    height = 600,
    onSelect,
    selectedId,
    tool = 'select',
    gridEnabled = true
}) => {
    const stageRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleWheel = (e) => {
        e.evt.preventDefault();
        
        const stage = stageRef.current;
        const oldScale = scale;
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - position.x) / oldScale,
            y: (pointer.y - position.y) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1;

        setPosition({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
        setScale(newScale);
    };

    const snapToGrid = (pos) => {
        return {
            x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE,
            y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE,
        };
    };

    return (
        <Stage
            ref={stageRef}
            width={width}
            height={height}
            onWheel={handleWheel}
            scaleX={scale}
            scaleY={scale}
            x={position.x}
            y={position.y}
            draggable={tool === 'select'}
        >
            <Layer>
                {/* Grid */}
                {gridEnabled && Array.from({ length: width / GRID_SIZE }, (_, i) => (
                    <React.Fragment key={`grid-${i}`}>
                        {/* Vertical lines */}
                        <Line
                            points={[i * GRID_SIZE, 0, i * GRID_SIZE, height]}
                            stroke="#ddd"
                            strokeWidth={1}
                        />
                        {/* Horizontal lines */}
                        <Line
                            points={[0, i * GRID_SIZE, width, i * GRID_SIZE]}
                            stroke="#ddd"
                            strokeWidth={1}
                        />
                    </React.Fragment>
                ))}
                
                {/* Editor content */}
                {children}
            </Layer>
        </Stage>
    );
};

export default BaseEditor;
