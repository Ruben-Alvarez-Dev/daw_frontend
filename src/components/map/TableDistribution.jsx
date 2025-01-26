import React, { useState, useRef } from 'react';
import { Rect, Text, Group } from 'react-konva';
import BaseEditor from './BaseEditor';
import { GRID_SIZE } from './constants';

const TableShape = ({ 
    table, 
    isSelected, 
    onSelect, 
    onChange,
    isAvailable = true 
}) => {
    return (
        <Group
            x={table.x}
            y={table.y}
            rotation={table.rotation || 0}
            draggable
            onClick={() => onSelect(table.id)}
            onDragEnd={(e) => {
                const pos = {
                    x: Math.round(e.target.x() / GRID_SIZE) * GRID_SIZE,
                    y: Math.round(e.target.y() / GRID_SIZE) * GRID_SIZE
                };
                onChange({
                    ...table,
                    x: pos.x,
                    y: pos.y
                });
            }}
            onTransformEnd={(e) => {
                const node = e.target;
                const rotation = node.rotation();
                
                onChange({
                    ...table,
                    rotation: rotation
                });
            }}
        >
            <Rect
                width={60}
                height={40}
                fill={isAvailable ? '#4CAF50' : '#f44336'}
                stroke={isSelected ? "#00ff00" : "#000"}
                strokeWidth={2}
                opacity={0.8}
            />
            <Text
                text={table.name}
                fontSize={16}
                fill="#fff"
                width={60}
                height={40}
                align="center"
                verticalAlign="middle"
            />
        </Group>
    );
};

const TableDistribution = ({
    tables,
    mapData,
    onUpdateTable,
    onToggleTableAvailability
}) => {
    const [selectedId, setSelectedId] = useState(null);
    const transformerRef = useRef();

    return (
        <BaseEditor
            width={800}
            height={600}
            tool="select"
            selectedId={selectedId}
            onSelect={setSelectedId}
        >
            {/* Render map elements as background */}
            {mapData.map((element) => (
                <Rect
                    key={element.id}
                    {...element}
                    fill={element.fill || '#ccc'}
                    opacity={0.5}
                    stroke="#666"
                    strokeWidth={1}
                />
            ))}

            {/* Render tables */}
            {tables.map((table) => (
                <TableShape
                    key={table.id}
                    table={table}
                    isSelected={selectedId === table.id}
                    onSelect={setSelectedId}
                    onChange={onUpdateTable}
                    isAvailable={table.is_available}
                />
            ))}

            {selectedId && (
                <Transformer
                    ref={transformerRef}
                    rotateEnabled={true}
                    resizeEnabled={false}
                    rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                    boundBoxFunc={(oldBox, newBox) => oldBox}
                />
            )}
        </BaseEditor>
    );
};

export default TableDistribution;
