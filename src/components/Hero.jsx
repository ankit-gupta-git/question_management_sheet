import React from 'react';
import useStore from '../store/useStore';
import { PlusCircle, BookOpen, Layers } from 'lucide-react';

const Hero = () => {
  const { openModal } = useStore();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-4 rounded-full shadow-lg mb-6 ring-1 ring-gray-100">
        <BookOpen size={48} className="text-blue-600" />
      </div>
      
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
        Start Your DSA Journey
      </h2>
      
      <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        Your sheet is currently empty. Create your first topic to begin tracking your progress and mastering data structures.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
         <button
          onClick={() => openModal('topic', null, null)}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg group"
        >
          <PlusCircle size={24} className="group-hover:scale-110 transition-transform" />
          <div className="text-left">
             <div className="font-bold text-base">New Topic</div>
             <div className="text-xs text-blue-100 opacity-80">Create a main category</div>
          </div>
        </button>

        <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm text-left">
            <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600">
                <Layers size={24} />
            </div>
            <div>
                 <div className="font-bold text-gray-800">Organize</div>
                 <div className="text-xs text-gray-500">Group by patterns</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
