import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GripVertical, Trash2, Edit2, ChevronDown, ChevronRight, Plus, FolderPlus, FilePlus } from 'lucide-react';
import SubTopic from './SubTopic';
import Question from './Question';
import useStore from '../store/useStore';

const Topic = ({ topic }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: topic.id, data: { type: 'topic', topic } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const deleteTopic = useStore(state => state.deleteTopic);
  const editTopic = useStore(state => state.editTopic);
  const openModal = useStore(state => state.openModal);

  const handleSaveTitle = () => {
      if (editTitle.trim()) {
          editTopic(topic.id, editTitle);
      }
      setIsEditing(false);
  };

  const handleAddSubTopic = () => {
      openModal('subTopic', topic.id, null);
      setIsExpanded(true);
  };

   const handleAddQuestion = () => {
      openModal('question', topic.id, 'topic');
      setIsExpanded(true);
  };

  if (isDragging) {
      return (
        <div
          ref={setNodeRef}
          style={style}
          className="opacity-50 bg-gray-50 border border-dashed border-gray-400 rounded-xl p-6 h-64 mb-6"
        />
      );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden"
    >
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <button
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200"
          >
            <GripVertical size={20} />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded text-gray-500"
          >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          
          {isEditing ? (
              <input 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                autoFocus
                className="px-2 py-1 border rounded text-lg font-bold text-gray-800"
              />
          ) : (
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-800">{topic.title}</h2>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {topic.questions.length + topic.subTopics.reduce((acc, st) => acc + st.questions.length, 0)} Qs
                    </span>
                     <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit2 size={14} />
                    </button>
                </div>
          )}
        </div>

        <div className="flex items-center gap-2">
            <button
                onClick={handleAddSubTopic}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                title="Add Sub-topic"
            >
                <FolderPlus size={16} /> <span className="hidden sm:inline">Sub-topic</span>
            </button>
            <button
                onClick={handleAddQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                title="Add Question"
            >
                <FilePlus size={16} /> <span className="hidden sm:inline">Question</span>
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button
                onClick={() => deleteTopic(topic.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Delete Topic"
            >
                <Trash2 size={18} />
            </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50/30">
            {/* SubTopics Area */}
            <div className="mb-4 space-y-4">
                <SortableContext 
                    items={topic.subTopics.map(st => st.id)} 
                    strategy={verticalListSortingStrategy}
                >
                    {topic.subTopics.map((subTopic) => (
                        <SubTopic key={subTopic.id} subTopic={subTopic} topicId={topic.id} />
                    ))}
                </SortableContext>
            </div>

            {/* Questions Area */}
             <SortableContext 
                items={topic.questions.map(q => q.id)} 
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-1">
                     {topic.questions.length > 0 && topic.subTopics.length > 0 && <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4 ml-1">Direct Questions</div>}
                    {topic.questions.map((question) => (
                        <Question
                            key={question.id}
                            question={question}
                            parentId={topic.id}
                            parentType="topic"
                        />
                    ))}
                </div>
            </SortableContext>

             {topic.questions.length === 0 && topic.subTopics.length === 0 && (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    Empty topic. Add a sub-topic or a question to get started.
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Topic;
