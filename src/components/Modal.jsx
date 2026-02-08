import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { X } from 'lucide-react';

const Modal = () => {
  const { modal, closeModal, addTopic, addSubTopic, addQuestion } = useStore();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (modal.isOpen) {
      setTitle('');
      setUrl('');
    }
  }, [modal.isOpen]);

  if (!modal.isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (modal.type === 'topic') {
      addTopic(title);
    } else if (modal.type === 'subTopic') {
      addSubTopic(modal.parentId, title);
    } else if (modal.type === 'question') {
      addQuestion(modal.parentId, modal.parentType, {
        title,
        url: url || '#',
        difficulty: 'Medium',
        status: 'Todo'
      });
    }

    closeModal();
  };

  const getTitle = () => {
    switch (modal.type) {
      case 'topic': return 'Add New Topic';
      case 'subTopic': return 'Add New Sub-Topic';
      case 'question': return 'Add New Question';
      default: return 'Add Item';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-4 sm:p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          <button 
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={modal.type === 'question' ? "e.g., Two Sum" : "e.g., Arrays"}
                required
              />
            </div>

            {modal.type === 'question' && (
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Add {modal.type === 'question' ? 'Question' : 'Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
