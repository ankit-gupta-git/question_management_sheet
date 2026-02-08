import React, { useEffect, useState } from 'react';
import useStore from './store/useStore';
import Topic from './components/Topic';
import StatsDashboard from './components/StatsDashboard';
import { Github, Plus, Loader2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Modal from './components/Modal';
import Hero from './components/Hero';
import { processSheetData } from './utils/dataProcessor';

function App() {
  const { 
    data, 
    setData, 
    reorderTopics, 
    reorderSubTopics, 
    reorderQuestions,
    openModal,
  } = useStore();
  
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet');
        const json = await response.json();
        const processedData = processSheetData(json.data);
        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setData]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveItem(active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
        setActiveId(null);
        setActiveItem(null);
        return;
    }

    if (active.id !== over.id) {
      const activeType = active.data.current?.type;
      const overType = over.data.current?.type;

      // 1. Reordering Topics
      if (activeType === 'topic' && overType === 'topic') {
        const oldIndex = data.findIndex((t) => t.id === active.id);
        const newIndex = data.findIndex((t) => t.id === over.id);
        reorderTopics(arrayMove(data, oldIndex, newIndex));
      }
      
      // 2. Reordering SubTopics
      if (activeType === 'subTopic' && overType === 'subTopic') {
         const activeTopicId = active.data.current.topicId;
         const overTopicId = over.data.current.topicId;

         if (activeTopicId === overTopicId) {
             const topic = data.find(t => t.id === activeTopicId);
             if (topic) {
                 const oldIndex = topic.subTopics.findIndex(st => st.id === active.id);
                 const newIndex = topic.subTopics.findIndex(st => st.id === over.id);
                 reorderSubTopics(activeTopicId, arrayMove(topic.subTopics, oldIndex, newIndex));
             }
         }
      }

      // 3. Reordering Questions
      if (activeType === 'question' && overType === 'question') {
          const findQuestionParent = (questionId) => {
              for (const topic of data) {
                  if (topic.questions && topic.questions.find(q => q.id === questionId)) {
                      return { parent: topic, type: 'topic', list: topic.questions };
                  }
                  if (topic.subTopics) {
                    for (const subTopic of topic.subTopics) {
                         if (subTopic.questions && subTopic.questions.find(q => q.id === questionId)) {
                            return { parent: subTopic, type: 'subTopic', list: subTopic.questions, topicId: topic.id };
                        }
                    }
                  }
              }
              return null;
          };

          const activeInfo = findQuestionParent(active.id);
          const overInfo = findQuestionParent(over.id);

          if (activeInfo && overInfo && activeInfo.parent.id === overInfo.parent.id) {
              const oldIndex = activeInfo.list.findIndex(q => q.id === active.id);
              const newIndex = overInfo.list.findIndex(q => q.id === over.id);
              reorderQuestions(activeInfo.parent.id, activeInfo.type, arrayMove(activeInfo.list, oldIndex, newIndex));
          }
      }
    }

    setActiveId(null);
    setActiveItem(null);
  };

  const handleAddNewTopic = () => {
      openModal('topic', null, null);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col">
      <Modal />
      <header className="bg-white border-t border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Github size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">Sheet Manager</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Interactive Question Tracker</p>
            </div>
          </div>
          
           <button 
                onClick={handleAddNewTopic}
                className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                title="New Topic"
            >
                <Plus size={16} /> <span className="hidden sm:inline">New Topic</span>
            </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow w-full">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading your sheet...</p>
          </div>
        ) : data.length === 0 ? (
            <Hero />
        ) : (
          <>
            <StatsDashboard />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
            <SortableContext
              items={data.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {data.map((topic) => (
                  <Topic key={topic.id} topic={topic} />
                ))}
              </div>
            </SortableContext>
            
            <DragOverlay>
                {activeId && activeItem ? (
                     activeItem.type === 'topic' ? (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 opacity-90 scale-105 w-[600px]">
                            <div className="flex items-center justify-between">
                                  <h2 className="text-lg font-bold text-gray-800">{activeItem.topic.title}</h2>
                            </div>
                        </div>
                     ) : activeItem.type === 'subTopic' ? (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg flex items-center justify-between w-[400px]">
                               <span className="font-semibold text-gray-700">{activeItem.subTopic.title}</span>
                          </div>
                     ) : (
                          <div className="bg-white border border-gray-200 rounded-md p-3 shadow-lg w-[400px] flex items-center gap-3">
                               <div className="text-gray-400"><Github size={16}/></div>
                               <span className="font-medium text-sm">{activeItem.question.title}</span>
                          </div>
                     )
                ) : null}
            </DragOverlay>

          </DndContext>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2026 Question Sheet Manager. All rights reserved.</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
