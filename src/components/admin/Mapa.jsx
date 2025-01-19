import React, { useState, useRef, useEffect, useContext } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importar el contexto de autenticación
import './Mapa.css';

export default function Mapa() {
  const [selectedTool, setSelectedTool] = useState('wall');
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [previewLine, setPreviewLine] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [groupBounds, setGroupBounds] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(null); // 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'
  const [rotating, setRotating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [availableTables, setAvailableTables] = useState([
    { id: 1, name: "Mesa 1" },
    { id: 2, name: "Mesa 2" },
    { id: 3, name: "Mesa 3" },
    // ... más mesas según el restaurante
  ]);
  const [usedTables, setUsedTables] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [templates, setTemplates] = useState([]);

  const svgRef = useRef(null);
  const GRID_SIZE = 10;
  const TABLE_SIZE = GRID_SIZE * 3;
  const MIN_SIZE = GRID_SIZE * 2;
  const gridWidth = 1000;
  const gridHeight = 1000;

  const { token } = useAuth(); // Obtener el token del contexto de autenticación

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/map-layouts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las plantillas');
      }

      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar las plantillas');
    }
  };

  const loadTemplate = (template) => {
    setElements(template.layout);
    setShowTemplatesModal(false);
  };

  const getGridCoordinates = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return {
      x: Math.round(x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(y / GRID_SIZE) * GRID_SIZE
    };
  };

  const calculateAngle = (cx, cy, ex, ey) => {
    const dy = ey - cy;
    const dx = ex - cx;
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    // Redondear a múltiplos de 45 grados
    return Math.round(angle / 45) * 45;
  };

  const findSnapPosition = (element, otherElements) => {
    const SNAP_DISTANCE = GRID_SIZE;
    let bestSnap = null;
    let minDistance = SNAP_DISTANCE;

    // Puntos del elemento actual
    const points = [
      { x: element.x1, y: element.y1 }, // Esquina superior izquierda
      { x: element.x2, y: element.y1 }, // Esquina superior derecha
      { x: element.x1, y: element.y2 }, // Esquina inferior izquierda
      { x: element.x2, y: element.y2 }, // Esquina inferior derecha
      { x: element.x1, y: (element.y1 + element.y2) / 2 }, // Centro izquierda
      { x: element.x2, y: (element.y1 + element.y2) / 2 }, // Centro derecha
      { x: (element.x1 + element.x2) / 2, y: element.y1 }, // Centro superior
      { x: (element.x1 + element.x2) / 2, y: element.y2 }  // Centro inferior
    ];

    otherElements.forEach(other => {
      if (other.id === element.id) return;

      // Puntos del otro elemento
      const otherPoints = [
        { x: other.x1, y: other.y1 },
        { x: other.x2, y: other.y1 },
        { x: other.x1, y: other.y2 },
        { x: other.x2, y: other.y2 },
        { x: other.x1, y: (other.y1 + other.y2) / 2 },
        { x: other.x2, y: (other.y1 + other.y2) / 2 },
        { x: (other.x1 + other.x2) / 2, y: other.y1 },
        { x: (other.x1 + other.x2) / 2, y: other.y2 }
      ];

      points.forEach(p1 => {
        otherPoints.forEach(p2 => {
          const dx = Math.abs(p1.x - p2.x);
          const dy = Math.abs(p1.y - p2.y);
          
          // Snap horizontal
          if (dy < minDistance) {
            minDistance = dy;
            bestSnap = {
              dx: 0,
              dy: p2.y - p1.y,
              distance: dy
            };
          }
          
          // Snap vertical
          if (dx < minDistance) {
            minDistance = dx;
            bestSnap = {
              dx: p2.x - p1.x,
              dy: 0,
              distance: dx
            };
          }
        });
      });
    });

    return bestSnap;
  };

  const calculateGroupBounds = (elementIds) => {
    if (!elementIds.length) return null;
    
    const selectedItems = elements.filter(el => elementIds.includes(el.id));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    selectedItems.forEach(el => {
      minX = Math.min(minX, el.x1);
      minY = Math.min(minY, el.y1);
      maxX = Math.max(maxX, el.x2);
      maxY = Math.max(maxY, el.y2);
    });
    
    return {
      x1: minX,
      y1: minY,
      x2: maxX,
      y2: maxY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  };

  const handleMouseDown = (e) => {
    const target = e.target;
    
    if (selectedTool !== 'move') {
      if (target.tagName === 'svg' || target.classList.contains('grid')) {
        const point = getGridCoordinates(e);
        
        if (selectedTool === 'table') {
          if (usedTables.length >= availableTables.length) {
            alert('No hay más mesas disponibles para colocar');
            return;
          }

          const unusedTables = availableTables.filter(t => !usedTables.includes(t.id));
          const nextTable = unusedTables[0];

          const newElement = {
            id: Date.now(),
            type: 'table',
            x1: point.x,
            y1: point.y,
            x2: point.x + TABLE_SIZE,
            y2: point.y + TABLE_SIZE,
            tableId: nextTable.id,
            tableName: nextTable.name,
            rotation: 0
          };

          setElements(prev => [...prev, newElement]);
          setUsedTables(prev => [...prev, nextTable.id]);
          return;
        }
        
        setStartPoint(point);
        setDrawing(true);
        setSelectedElements([]);
      }
      return;
    }

    if (target.classList.contains('resize-handle')) {
      setResizing(target.getAttribute('data-handle'));
      return;
    }

    if (target.classList.contains('rotation-handle')) {
      setRotating(true);
      return;
    }

    const element = target.closest('.element');
    if (element) {
      e.preventDefault();
      e.stopPropagation();
      
      const id = parseInt(element.getAttribute('data-id'));
      const coords = getGridCoordinates(e);
      const elementData = elements.find(el => el.id === id);
      
      if (elementData) {
        if (e.shiftKey) {
          setSelectedElements(prev => 
            prev.includes(id) ? prev.filter(el => el !== id) : [...prev, id]
          );
        } else {
          setSelectedElements([id]);
          setDragging(true);
          setDragOffset({
            x: coords.x - elementData.x1,
            y: coords.y - elementData.y1
          });
        }
      }
      return;
    }

    if (!e.shiftKey) {
      setSelectedElements([]);
    }
  };

  const handleMouseMove = (e) => {
    const coords = getGridCoordinates(e);

    if (selectedTool !== 'move') {
      if (!drawing || !startPoint || selectedTool === 'table') return;

      const currentPoint = getGridCoordinates(e);
      if (['wall', 'window', 'door'].includes(selectedTool)) {
        const dx = Math.abs(currentPoint.x - startPoint.x);
        const dy = Math.abs(currentPoint.y - startPoint.y);
        const isHorizontal = dx > dy;
        const endPoint = {
          x: isHorizontal ? currentPoint.x : startPoint.x,
          y: isHorizontal ? startPoint.y : currentPoint.y
        };
        setPreviewLine({
          x1: startPoint.x,
          y1: startPoint.y,
          x2: endPoint.x,
          y2: endPoint.y,
          isHorizontal
        });
      } else {
        setPreviewLine({
          x1: startPoint.x,
          y1: startPoint.y,
          x2: currentPoint.x,
          y2: currentPoint.y,
          isHorizontal: false
        });
      }
      return;
    }

    if (rotating && selectedElements.length > 0) {
      const bounds = calculateGroupBounds(selectedElements);
      if (bounds) {
        const angle = calculateAngle(bounds.centerX, bounds.centerY, coords.x, coords.y);
        setElements(elements.map(el => 
          selectedElements.includes(el.id) 
            ? { ...el, rotation: angle }
            : el
        ));
      }
      return;
    }

    if (resizing && selectedElements.length > 0) {
      const elementToResize = elements.find(el => selectedElements.includes(el.id));
      if (!elementToResize) return;

      let newX1 = elementToResize.x1;
      let newY1 = elementToResize.y1;
      let newX2 = elementToResize.x2;
      let newY2 = elementToResize.y2;

      switch (resizing) {
        case 'e':
          newX2 = Math.max(newX1 + MIN_SIZE, coords.x);
          break;
        case 'w':
          newX1 = Math.min(newX2 - MIN_SIZE, coords.x);
          break;
        case 'n':
          newY1 = Math.min(newY2 - MIN_SIZE, coords.y);
          break;
        case 's':
          newY2 = Math.max(newY1 + MIN_SIZE, coords.y);
          break;
        case 'ne':
          newX2 = Math.max(newX1 + MIN_SIZE, coords.x);
          newY1 = Math.min(newY2 - MIN_SIZE, coords.y);
          break;
        case 'nw':
          newX1 = Math.min(newX2 - MIN_SIZE, coords.x);
          newY1 = Math.min(newY2 - MIN_SIZE, coords.y);
          break;
        case 'se':
          newX2 = Math.max(newX1 + MIN_SIZE, coords.x);
          newY2 = Math.max(newY1 + MIN_SIZE, coords.y);
          break;
        case 'sw':
          newX1 = Math.min(newX2 - MIN_SIZE, coords.x);
          newY2 = Math.max(newY1 + MIN_SIZE, coords.y);
          break;
      }

      setElements(elements.map(el => 
        el.id === elementToResize.id
          ? { ...el, x1: newX1, y1: newY1, x2: newX2, y2: newY2 }
          : el
      ));
      return;
    }

    if (dragging && selectedElements.length > 0) {
      const selectedElement = elements.find(el => selectedElements.includes(el.id));
      if (!selectedElement) return;

      const dx = coords.x - dragOffset.x - selectedElement.x1;
      const dy = coords.y - dragOffset.y - selectedElement.y1;

      setElements(elements.map(el => {
        if (!selectedElements.includes(el.id)) return el;
        return {
          ...el,
          x1: el.x1 + dx,
          y1: el.y1 + dy,
          x2: el.x2 + dx,
          y2: el.y2 + dy
        };
      }));
    }
  };

  const handleMouseUp = (e) => {
    if (selectedTool !== 'move') {
      if (drawing && previewLine && selectedTool !== 'table') {
        const newElement = {
          id: Date.now(),
          type: selectedTool,
          x1: previewLine.x1,
          y1: previewLine.y1,
          x2: previewLine.x2,
          y2: previewLine.y2,
          isHorizontal: previewLine.isHorizontal,
          rotation: 0
        };
        setElements(prev => [...prev, newElement]);
      }
      setDrawing(false);
      setStartPoint(null);
      setPreviewLine(null);
      return;
    }

    setRotating(false);
    setResizing(null);
    setDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleSaveAsDefault = async () => {
    try {
      // Preparar los datos, asegurándonos de que son serializables
      const cleanElements = elements.map(el => ({
        ...el,
        id: el.id.toString(),
        x1: Number(el.x1),
        y1: Number(el.y1),
        x2: Number(el.x2),
        y2: Number(el.y2),
        rotation: Number(el.rotation || 0),
        type: el.type,
        tableName: el.tableName,
        tableId: el.tableId
      }));

      const data = {
        name: 'Default Layout',
        layout: cleanElements,
        is_default: true
      };
      
      console.log('Sending data:', JSON.stringify(data));
      
      const response = await fetch('http://localhost:8000/api/map-layouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(responseText);
      }
      
      alert('Layout guardado como predeterminado');
    } catch (error) {
      console.error('Error completo:', error);
      alert('Error al guardar el layout: ' + error.message);
    }
  };

  const handleSaveAsTemplate = () => {
    setShowSaveDialog(true);
  };

  const handleSaveTemplate = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/map-layouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: templateName,
          layout: elements,
          is_default: false
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error saving template');
      }
      
      setShowSaveDialog(false);
      alert('Plantilla guardada correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la plantilla: ' + error.message);
    }
  };

  const renderResizeHandles = (element) => {
    const width = Math.abs(element.x2 - element.x1);
    const height = Math.abs(element.y2 - element.y1);
    const x = Math.min(element.x1, element.x2);
    const y = Math.min(element.y1, element.y2);

    return (
      <>
        <circle cx={x} cy={y} r={5} className="resize-handle" data-handle="nw" />
        <circle cx={x + width} cy={y} r={5} className="resize-handle" data-handle="ne" />
        <circle cx={x} cy={y + height} r={5} className="resize-handle" data-handle="sw" />
        <circle cx={x + width} cy={y + height} r={5} className="resize-handle" data-handle="se" />
        <circle cx={x} cy={y + height/2} r={5} className="resize-handle" data-handle="w" />
        <circle cx={x + width} cy={y + height/2} r={5} className="resize-handle" data-handle="e" />
        <circle cx={x + width/2} cy={y} r={5} className="resize-handle" data-handle="n" />
        <circle cx={x + width/2} cy={y + height} r={5} className="resize-handle" data-handle="s" />
      </>
    );
  };

  const renderRotationHandle = (element) => {
    const width = Math.abs(element.x2 - element.x1);
    const height = Math.abs(element.y2 - element.y1);
    const x = Math.min(element.x1, element.x2);
    const y = Math.min(element.y1, element.y2);
    
    return (
      <>
        <circle
          cx={x + width}
          cy={y - 20}
          r={6}
          className="rotation-handle"
          data-id={element.id}
        />
        <line
          x1={x + width/2}
          y1={y + height/2}
          x2={x + width}
          y2={y - 20}
          className="rotation-line"
        />
      </>
    );
  };

  const renderElement = (element, isPreview = false) => {
    const width = Math.abs(element.x2 - element.x1) || GRID_SIZE;
    const height = Math.abs(element.y2 - element.y1) || GRID_SIZE;
    const x = Math.min(element.x1, element.x2);
    const y = Math.min(element.y1, element.y2);
    const isSelected = selectedElements.includes(element.id);
    const rotation = element.rotation || 0;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    let className = `element ${element.type}-element`;
    if (isSelected) className += ' selected';
    if (isPreview) className += ' preview-element';

    const transform = `rotate(${rotation} ${centerX} ${centerY})`;

    if (element.type === 'vegetation') {
      return (
        <g key={element.id || 'preview'}
           className={className}
           data-id={element.id}
           data-type={element.type}
           transform={transform}>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill="url(#vegetationPattern)"
            className="vegetation-shape"
          />
          {!isPreview && isSelected && renderResizeHandles(element)}
          {!isPreview && isSelected && renderRotationHandle(element)}
        </g>
      );
    }

    if (element.type === 'table') {
      return (
        <g key={element.id || 'preview'} 
           className={className}
           data-id={element.id}
           data-type={element.type}>
          <g transform={transform}>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              className="table-shape"
            />
          </g>
          {/* La etiqueta no rota con la mesa */}
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="table-label"
          >
            {element.tableName}
          </text>
          {!isPreview && isSelected && renderResizeHandles(element)}
          {!isPreview && isSelected && renderRotationHandle(element)}
        </g>
      );
    }

    if (element.type === 'surface') {
      return (
        <g key={element.id || 'preview'}
           className={className}
           data-id={element.id}
           data-type={element.type}
           transform={transform}>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill="url(#woodPattern)"
            className="surface-shape"
          />
          {!isPreview && isSelected && renderResizeHandles(element)}
          {!isPreview && isSelected && renderRotationHandle(element)}
        </g>
      );
    }

    return (
      <g key={element.id || 'preview'}
         className={className}
         data-id={element.id}
         data-type={element.type}
         transform={transform}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          className="element-shape"
        />
        {!isPreview && isSelected && renderResizeHandles(element)}
        {!isPreview && isSelected && renderRotationHandle(element)}
      </g>
    );
  };

  const renderGroupBounds = () => {
    if (selectedElements.length <= 1) return null;
    
    const bounds = calculateGroupBounds(selectedElements);
    if (!bounds) return null;

    return (
      <g className="group-bounds">
        <rect
          x={bounds.x1}
          y={bounds.y1}
          width={bounds.x2 - bounds.x1}
          height={bounds.y2 - bounds.y1}
          className="group-bounds-rect"
        />
        {renderResizeHandles({ ...bounds, id: 'group' })}
        <circle
          cx={bounds.x2}
          cy={bounds.y1}
          r={6}
          className="rotation-handle"
          data-id="group"
        />
        <line
          x1={bounds.centerX}
          y1={bounds.centerY}
          x2={bounds.x2}
          y2={bounds.y1}
          className="rotation-line"
        />
      </g>
    );
  };

  return (
    <div className="mapa-container">
      <div className="mapa-tools">
        <button 
          className={`tool-button ${selectedTool === 'move' ? 'selected' : ''}`}
          onClick={() => setSelectedTool('move')}
        >
          🖐️ Mover
        </button>
        <hr />
        <button 
          className={`tool-button ${selectedTool === 'wall' ? 'selected' : ''}`}
          onClick={() => setSelectedTool('wall')}
        >
          Muro
        </button>
        <button 
          className={`tool-button ${selectedTool === 'window' ? 'selected' : ''}`}
          onClick={() => setSelectedTool('window')}
        >
          Ventana
        </button>
        <button 
          className={`tool-button ${selectedTool === 'door' ? 'selected' : ''}`}
          onClick={() => setSelectedTool('door')}
        >
          Puerta
        </button>
        <button 
          className={`tool-button ${selectedTool === 'table' ? 'selected' : ''}`}
          onClick={() => setSelectedTool('table')}
          disabled={usedTables.length >= availableTables.length}
        >
          Mesa ({availableTables.length - usedTables.length} disponibles)
        </button>
        <button 
          className={`tool-button ${selectedTool === 'surface' ? 'selected' : ''}`}
          onClick={() => setSelectedTool('surface')}
        >
          Superficie
        </button>
        <button 
          className={`tool-button ${selectedTool === 'vegetation' ? 'selected' : ''}`}
          onClick={() => setSelectedTool('vegetation')}
        >
          Vegetación
        </button>
        <hr />
        <button 
          className="tool-button"
          onClick={() => {
            const lastElement = elements[elements.length - 1];
            if (lastElement && lastElement.type === 'table') {
              setUsedTables(usedTables.filter(id => id !== lastElement.tableId));
            }
            setElements(elements.slice(0, -1));
            setSelectedElements([]);
          }}
          disabled={elements.length === 0}
        >
          ↩️ Deshacer
        </button>
        <button 
          className="tool-button delete-button"
          onClick={() => {
            const selectedTables = elements
              .filter(el => selectedElements.includes(el.id) && el.type === 'table')
              .map(el => el.tableId);
            
            setUsedTables(usedTables.filter(id => !selectedTables.includes(id)));
            setElements(elements.filter(el => !selectedElements.includes(el.id)));
            setSelectedElements([]);
          }}
          disabled={selectedElements.length === 0}
        >
          🗑️ Borrar
        </button>
        <button 
          className="tool-button save-button"
          onClick={() => handleSaveAsDefault()}
        >
          💾 Guardar como Default
        </button>
        <button 
          className="tool-button save-button"
          onClick={() => handleSaveAsTemplate()}
        >
          📋 Guardar como Plantilla
        </button>
        <button 
          className="tool-button save-button"
          onClick={() => setShowTemplatesModal(true)}
        >
          📂 Abrir Plantilla
        </button>
      </div>
      {showSaveDialog && (
        <div className="save-dialog">
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Nombre de la plantilla"
          />
          <button onClick={handleSaveTemplate}>Guardar</button>
          <button onClick={() => setShowSaveDialog(false)}>Cancelar</button>
        </div>
      )}
      {showTemplatesModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Plantillas Guardadas</h2>
            <div className="templates-list">
              {templates.map(template => (
                <div key={template.id} className="template-item">
                  <span>{template.name}</span>
                  <button onClick={() => loadTemplate(template)}>Cargar</button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowTemplatesModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
      <div 
        className={`mapa-grid ${selectedTool === 'move' ? 'mode-move' : 'mode-draw'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg 
          width="100%" 
          height="100%" 
          className="mapa-svg"
          ref={svgRef}
        >
          <defs>
            <pattern
              id="vegetationPattern"
              patternUnits="userSpaceOnUse"
              width="20"
              height="20"
            >
              {/* Patrón denso de vegetación */}
              <circle cx="10" cy="10" r="10" fill="#1B5E20" />
              <circle cx="0" cy="0" r="10" fill="#2E7D32" />
              <circle cx="20" cy="0" r="10" fill="#1B5E20" />
              <circle cx="0" cy="20" r="10" fill="#2E7D32" />
              <circle cx="20" cy="20" r="10" fill="#1B5E20" />
            </pattern>

            <pattern
              id="woodPattern"
              patternUnits="userSpaceOnUse"
              width="50"
              height="30"
              patternTransform="rotate(0)"
            >
              {/* Base de madera */}
              <rect width="50" height="30" fill="#8B4513"/>
              {/* Vetas de la madera */}
              <path
                d="M0,5 Q25,0 50,5 Q25,10 0,5 Z"
                fill="#A0522D"
                opacity="0.3"
              />
              <path
                d="M0,15 Q25,10 50,15 Q25,20 0,15 Z"
                fill="#A0522D"
                opacity="0.3"
              />
              <path
                d="M0,25 Q25,20 50,25 Q25,30 0,25 Z"
                fill="#A0522D"
                opacity="0.3"
              />
            </pattern>
          </defs>

          {[...Array(100)].map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <line 
                x1={i * GRID_SIZE} 
                y1="0" 
                x2={i * GRID_SIZE} 
                y2="100%" 
                className="grid-line"
              />
              <line 
                x1="0" 
                y1={i * GRID_SIZE} 
                x2="100%" 
                y2={i * GRID_SIZE} 
                className="grid-line"
              />
            </React.Fragment>
          ))}
          
          {elements.map(element => renderElement(element))}
          {previewLine && renderElement(previewLine, true)}
          {renderGroupBounds()}
        </svg>
      </div>
    </div>
  );
}
