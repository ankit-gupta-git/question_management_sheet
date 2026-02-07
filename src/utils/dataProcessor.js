import { v4 as uuidv4 } from 'uuid';

export const processSheetData = (data) => {
  if (!data || !data.sheet) return [];

  const { config, questions } = data.sheet;
  const topicOrder = config?.topicOrder || [];
  
  // Create a map for topics
  const topicsMap = new Map();

  // Initialize topics from order
  topicOrder.forEach(topicName => {
    topicsMap.set(topicName, {
      id: uuidv4(),
      title: topicName,
      subTopics: [],
      questions: [],
      type: 'topic'
    });
  });

  // Process questions
  questions.forEach(q => {
    const topicName = q.topic;
    const subTopicName = q.subTopic;
    
    // If topic doesn't exist (not in order list), create it
    if (!topicsMap.has(topicName)) {
      topicsMap.set(topicName, {
        id: uuidv4(),
        title: topicName,
        subTopics: [],
        questions: [],
        type: 'topic'
      });
    }

    const topic = topicsMap.get(topicName);
    const questionData = {
      id: q._id || uuidv4(),
      title: q.title,
      url: q.questionId?.problemUrl || q.link,
      difficulty: q.questionId?.difficulty || 'Medium',
      platform: q.questionId?.platform || 'cal',
      status: q.isSolved ? 'Done' : 'Todo',
      type: 'question'
    };

    if (subTopicName) {
      // Find or create subtopic
      let subTopic = topic.subTopics.find(st => st.title === subTopicName);
      if (!subTopic) {
        subTopic = {
          id: uuidv4(),
          title: subTopicName,
          questions: [],
          type: 'subTopic'
        };
        topic.subTopics.push(subTopic);
      }
      subTopic.questions.push(questionData);
    } else {
      // Add directly to topic
      topic.questions.push(questionData);
    }
  });

  return Array.from(topicsMap.values());
};
