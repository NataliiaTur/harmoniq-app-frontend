// components/UserJourneyVisualizer.jsx
import ReactFlow, { Background, Controls } from 'reactflow';
import { useEffect, useState } from 'react';

export const UserJourneyVisualizer = ({ sessionId }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  useEffect(() => {
    fetch(`/api/analytics/journey/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        // Перетворюємо події в ноди та зв'язки
        const journeyNodes = [];
        const journeyEdges = [];
        
        data.journey.forEach((event, index) => {
          journeyNodes.push({
            id: `${index}`,
            data: { 
              label: `${event.type}\n${event.data.url || ''}`,
              time: new Date(event.timestamp).toLocaleTimeString()
            },
            position: { x: index * 200, y: 100 },
            style: getNodeStyle(event.type)
          });
          
          if (index > 0) {
            journeyEdges.push({
              id: `e${index - 1}-${index}`,
              source: `${index - 1}`,
              target: `${index}`,
              animated: true
            });
          }
        });
        
        setNodes(journeyNodes);
        setEdges(journeyEdges);
      });
  }, [sessionId]);
  
  return (
    <div style={{ height: 500 }}>
      <h3>Шлях користувача</h3>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const getNodeStyle = (type) => {
  const styles = {
    page_view: { background: '#e3f2fd', border: '2px solid #2196f3' },
    article_view: { background: '#fff3e0', border: '2px solid #ff9800' },
    add_to_cart: { background: '#e8f5e9', border: '2px solid #4caf50' },
    purchase: { background: '#f3e5f5', border: '2px solid #9c27b0' }
  };
  return styles[type] || { background: '#f5f5f5', border: '2px solid #999' };
};