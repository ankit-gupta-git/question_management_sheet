import React from 'react';
import useStore from '../store/useStore';
import { Activity } from 'lucide-react';

const StatsDashboard = () => {
  const data = useStore(state => state.data);

  const stats = React.useMemo(() => {
    let total = 0;
    let solved = 0;
    let easy = 0;
    let medium = 0;
    let hard = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    const processQuestion = (q) => {
      total++;
      if (q.status === 'Done') solved++;
      
      if (q.difficulty === 'Easy') {
          easy++;
          if (q.status === 'Done') easySolved++;
      }
      else if (q.difficulty === 'Medium') {
          medium++;
          if (q.status === 'Done') mediumSolved++;
      }
      else if (q.difficulty === 'Hard') {
          hard++;
          if (q.status === 'Done') hardSolved++;
      }
    };

    data.forEach(topic => {
      topic.questions.forEach(processQuestion);
      topic.subTopics.forEach(subTopic => {
        subTopic.questions.forEach(processQuestion);
      });
    });

    return { total, solved, easy, medium, hard, easySolved, mediumSolved, hardSolved };
  }, [data]);

  if (stats.total === 0) return null;

  const percentage = Math.round((stats.solved / stats.total) * 100) || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Activity className="text-blue-600" /> Progress Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Progress */}
        <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-blue-100">
            <div className="relative w-20 h-20 flex items-center justify-center">
                 <svg className="transform -rotate-90 w-20 h-20">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-200" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-600" strokeDasharray={`${percentage * 2.26} 226`} />
                 </svg>
                 <span className="absolute text-xl font-bold text-blue-700">{percentage}%</span>
            </div>
            <p className="mt-2 text-sm font-medium text-blue-900">Total Solved</p>
            <p className="text-xs text-blue-600">{stats.solved} / {stats.total}</p>
        </div>

        {/* Easy Stats */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <span className="text-green-700 font-bold">Easy</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">{stats.easySolved}/{stats.easy}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(stats.easySolved / stats.easy) * 100 || 0}%` }}></div>
            </div>
            <p className="text-xs text-green-600 mt-2 text-right">{Math.round((stats.easySolved / stats.easy) * 100 || 0)}% Done</p>
        </div>

        {/* Medium Stats */}
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-700 font-bold">Medium</span>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">{stats.mediumSolved}/{stats.medium}</span>
            </div>
            <div className="w-full bg-yellow-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(stats.mediumSolved / stats.medium) * 100 || 0}%` }}></div>
            </div>
            <p className="text-xs text-yellow-600 mt-2 text-right">{Math.round((stats.mediumSolved / stats.medium) * 100 || 0)}% Done</p>
        </div>

        {/* Hard Stats */}
        <div className="bg-red-50 rounded-lg p-4 border border-red-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <span className="text-red-700 font-bold">Hard</span>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">{stats.hardSolved}/{stats.hard}</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(stats.hardSolved / stats.hard) * 100 || 0}%` }}></div>
            </div>
            <p className="text-xs text-red-600 mt-2 text-right">{Math.round((stats.hardSolved / stats.hard) * 100 || 0)}% Done</p>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
