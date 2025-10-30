import React, { useState, useEffect } from 'react';

interface MatchingPair {
  id: string;
  promptText: string;
  responseText: string;
  orderIndex: number;
  promptMediaUrl?: string;
  responseMediaUrl?: string;
}

interface Question {
  id: string;
  questionText: string;
  matchPairs?: MatchingPair[];
}

interface MatchingQuestionProps {
  question: Question;
  onAnswerChange: (answerData: any) => void;
  currentAnswer?: any;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  onAnswerChange,
  currentAnswer
}) => {
  const [matches, setMatches] = useState<Record<string, string>>({});

  // Initialize from current answer if available
  useEffect(() => {
    if (currentAnswer && currentAnswer.pairs) {
      setMatches(currentAnswer.pairs);
    }
  }, [currentAnswer]);

  // Handle selection change
  const handleMatchChange = (promptId: string, responseId: string) => {
    setMatches(prev => {
      const newMatches = {
        ...prev,
        [promptId]: responseId
      };
      
      // Notify parent of change
      onAnswerChange({
        pairs: newMatches,
        type: 'matching'
      });
      
      return newMatches;
    });
  };

  // Sort match pairs by orderIndex
  const sortedPairs = question.matchPairs 
    ? [...question.matchPairs].sort((a, b) => a.orderIndex - b.orderIndex) 
    : [];

  // Create a shuffled array of responses for selection
  const shuffledResponses = sortedPairs.length > 0
    ? [...sortedPairs].sort(() => Math.random() - 0.5)
    : [];

  return (
    <div className="matching-question">
      <div className="text-sm text-gray-600 mb-4">Match items from left column with corresponding items on the right.</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prompts Column */}
        <div className="space-y-6">
          {sortedPairs.map(pair => (
            <div key={pair.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-2 font-medium text-gray-800">{pair.promptText}</div>
              
              {pair.promptMediaUrl && (
                <div className="mt-2">
                  <img 
                    src={pair.promptMediaUrl} 
                    alt="Prompt visual" 
                    className="max-w-full h-auto rounded-md max-h-32 object-contain"
                  />
                </div>
              )}
              
              <div className="mt-4">
                <select
                  value={matches[pair.id] || ''}
                  onChange={(e) => handleMatchChange(pair.id, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a match --</option>
                  {shuffledResponses.map(response => (
                    <option key={response.id} value={response.id}>
                      {response.responseText}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        
        {/* Responses Column (just for reference) */}
        <div className="space-y-6">
          {shuffledResponses.map(response => (
            <div 
              key={response.id}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div>{response.responseText}</div>
              
              {response.responseMediaUrl && (
                <div className="mt-2">
                  <img 
                    src={response.responseMediaUrl} 
                    alt="Response visual" 
                    className="max-w-full h-auto rounded-md max-h-32 object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingQuestion;