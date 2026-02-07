import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ExternalLink, CheckCircle, Circle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import useStore from '../store/useStore';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Question = ({ question, parentId, parentType }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id, data: { type: 'question', question } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deleteQuestion = useStore(state => state.deleteQuestion);
  const updateQuestionStatus = useStore(state => state.updateQuestionStatus);

  const toggleStatus = () => {
      const newStatus = question.status === 'Done' ? 'Todo' : 'Done';
      updateQuestionStatus(parentId, parentType, question.id, newStatus);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 bg-gray-50 border border-dashed border-gray-300 rounded-md p-3 h-16"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white border border-gray-200 rounded-md p-3 flex items-center justify-between hover:shadow-sm transition-all mb-2"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>
        
        <button onClick={toggleStatus} className={cn("transition-colors", question.status === 'Done' ? "text-green-500" : "text-gray-300 hover:text-gray-400")}>
            {question.status === 'Done' ? <CheckCircle size={18} /> : <Circle size={18} />}
        </button>

        <div className="flex flex-col min-w-0">
            <span className={cn("font-medium text-sm truncate", question.status === 'Done' && "text-gray-400 line-through")}>{question.title}</span>
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium border", 
                    question.difficulty === 'Easy' ? "bg-green-50 text-green-700 border-green-200" :
                    question.difficulty === 'Medium' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                    "bg-red-50 text-red-700 border-red-200"
                )}>
                    {question.difficulty}
                </span>
                {question.platform && <span className="capitalize">{question.platform}</span>}
            </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <a 
            href={question.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
            title="Open Problem"
        >
            <ExternalLink size={14} />
        </a>
        <button
          onClick={() => deleteQuestion(parentId, parentType, question.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
          title="Delete Question"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default Question;
