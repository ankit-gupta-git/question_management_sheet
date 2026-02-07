import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GripVertical, Trash2, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { cn } from './Question';
import Question from './Question';
import useStore from '../store/useStore';

const SubTopic = ({ subTopic, topicId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: subTopic.id, data: { type: 'subTopic', subTopic, topicId } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const deleteSubTopic = useStore(state => state.deleteSubTopic);
  const addQuestion = useStore(state => state.addQuestion);

  const handleAddQuestion = () => {
      const title = prompt("Enter question title:");
      if(!title) return;
      const url = prompt("Enter question URL (optional):");
      
      addQuestion(subTopic.id, 'subTopic', {
          title,
          url: url || '#',
          difficulty: 'Medium', // Default
          status: 'Todo'
      });
      setIsExpanded(true);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 h-32 mb-4"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50/50 border border-gray-200 rounded-lg mb-3 overflow-hidden transition-all hover:border-gray-300"
    >
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
           <button
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded text-gray-500"
          >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <span className="font-semibold text-gray-700 text-sm">{subTopic.title}</span>
          <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">
            {subTopic.questions.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
             <button
                onClick={handleAddQuestion}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium flex items-center gap-1"
            >
                <Plus size={14} /> Add Q
            </button>
            <button
            onClick={() => deleteSubTopic(topicId, subTopic.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            >
            <Trash2 size={14} />
            </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3">
          <SortableContext 
            items={subTopic.questions.map(q => q.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="min-h-[10px]">
                {subTopic.questions.length === 0 && (
                    <div className="text-center py-4 text-xs text-gray-400 border border-dashed rounded bg-gray-50">
                        No questions in this sub-topic
                    </div>
                )}
                {subTopic.questions.map((question) => (
                <Question
                    key={question.id}
                    question={question}
                    parentId={subTopic.id}
                    parentType="subTopic"
                />
                ))}
            </div>
          </SortableContext>
        </div>
      )}
    </div>
  );
};

export default SubTopic;
