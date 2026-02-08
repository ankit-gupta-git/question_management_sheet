import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useStore = create((set) => ({
  data: [],
  setData: (data) => set({ data }),
  
  // Topic Actions
  addTopic: (title) => set((state) => ({
    data: [...state.data, {
      id: uuidv4(),
      title,
      subTopics: [],
      questions: [],
      type: 'topic'
    }]
  })),
  
  deleteTopic: (id) => set((state) => ({
    data: state.data.filter(t => t.id !== id)
  })),

  editTopic: (id, title) => set((state) => ({
    data: state.data.map(t => t.id === id ? { ...t, title } : t)
  })),

  // SubTopic Actions
  addSubTopic: (topicId, title) => set((state) => ({
    data: state.data.map(t => {
      if (t.id !== topicId) return t;
      return {
        ...t,
        subTopics: [...t.subTopics, {
          id: uuidv4(),
          title,
          questions: [],
          type: 'subTopic'
        }]
      };
    })
  })),

  deleteSubTopic: (topicId, subTopicId) => set((state) => ({
    data: state.data.map(t => {
      if (t.id !== topicId) return t;
      return {
        ...t,
        subTopics: t.subTopics.filter(st => st.id !== subTopicId)
      };
    })
  })),

  editSubTopic: (topicId, subTopicId, title) => set((state) => ({
    data: state.data.map(t => {
      if (t.id !== topicId) return t;
      return {
        ...t,
        subTopics: t.subTopics.map(st => st.id === subTopicId ? { ...st, title } : st)
      };
    })
  })),

  // Question Actions
  addQuestion: (parentId, parentType, questionData) => set((state) => {
    const newQuestion = { ...questionData, id: uuidv4(), type: 'question' };
    
    return {
      data: state.data.map(topic => {
        if (parentType === 'topic' && topic.id === parentId) {
          return { ...topic, questions: [...topic.questions, newQuestion] };
        }
        
        if (parentType === 'subTopic') {
            // Check if this topic contains the subtopic
            const subTopicIndex = topic.subTopics.findIndex(st => st.id === parentId);
            if (subTopicIndex !== -1) {
                 const updatedSubTopics = [...topic.subTopics];
                 updatedSubTopics[subTopicIndex] = {
                     ...updatedSubTopics[subTopicIndex],
                     questions: [...updatedSubTopics[subTopicIndex].questions, newQuestion]
                 };
                 return { ...topic, subTopics: updatedSubTopics };
            }
        }
        
        return topic;
      })
    };
  }),

  deleteQuestion: (parentId, parentType, questionId) => set((state) => ({
    data: state.data.map(topic => {
      if (parentType === 'topic' && topic.id === parentId) {
        return { ...topic, questions: topic.questions.filter(q => q.id !== questionId) };
      }

      if (parentType === 'subTopic') {
          const subTopicIndex = topic.subTopics.findIndex(st => st.id === parentId);
           if (subTopicIndex !== -1) {
                 const updatedSubTopics = [...topic.subTopics];
                 updatedSubTopics[subTopicIndex] = {
                     ...updatedSubTopics[subTopicIndex],
                     questions: updatedSubTopics[subTopicIndex].questions.filter(q => q.id !== questionId)
                 };
                 return { ...topic, subTopics: updatedSubTopics };
            }
      }
      return topic;
    })
  })),

  updateQuestionStatus: (parentId, parentType, questionId, status) => set((state) => ({
     data: state.data.map(topic => {
      if (parentType === 'topic' && topic.id === parentId) {
        return { 
            ...topic, 
            questions: topic.questions.map(q => q.id === questionId ? { ...q, status } : q) 
        };
      }

      if (parentType === 'subTopic') {
          const subTopicIndex = topic.subTopics.findIndex(st => st.id === parentId);
           if (subTopicIndex !== -1) {
                 const updatedSubTopics = [...topic.subTopics];
                 updatedSubTopics[subTopicIndex] = {
                     ...updatedSubTopics[subTopicIndex],
                     questions: updatedSubTopics[subTopicIndex].questions.map(q => q.id === questionId ? { ...q, status } : q)
                 };
                 return { ...topic, subTopics: updatedSubTopics };
            }
      }
      return topic;
    }) 
  })),

  // Reorder Actions
  reorderTopics: (newOrder) => set({ data: newOrder }),
  
  reorderSubTopics: (topicId, newOrder) => set((state) => ({
    data: state.data.map(t => t.id === topicId ? { ...t, subTopics: newOrder } : t)
  })),

  reorderQuestions: (parentId, parentType, newOrder) => set((state) => ({
     data: state.data.map(topic => {
        if (parentType === 'topic' && topic.id === parentId) {
          return { ...topic, questions: newOrder };
        }
        
        if (parentType === 'subTopic') {
            const subTopicIndex = topic.subTopics.findIndex(st => st.id === parentId);
            if (subTopicIndex !== -1) {
                 const updatedSubTopics = [...topic.subTopics];
                 updatedSubTopics[subTopicIndex] = {
                     ...updatedSubTopics[subTopicIndex],
                     questions: newOrder
                 };
                 return { ...topic, subTopics: updatedSubTopics };
            }
        }
        
        return topic;
      })
  })),

  // Modal State
  modal: {
    isOpen: false,
    type: null, // 'topic', 'subTopic', 'question'
    parentId: null,
    parentType: null, // 'topic', 'subTopic'
  },

  openModal: (type, parentId = null, parentType = null) => set({
    modal: { isOpen: true, type, parentId, parentType }
  }),

  closeModal: () => set({
    modal: { isOpen: false, type: null, parentId: null, parentType: null }
  })
}));

export default useStore;
