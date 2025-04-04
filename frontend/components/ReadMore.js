import React, { useState } from 'react';

const ReadMoreText = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(prevState => !prevState);
  };

  return (
    <div>
      <p className="text-gray-600">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      {text.length > maxLength && (
        <button
          onClick={handleToggle}
          className="text-sm text-blue-500 hover:underline mt-2"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default ReadMoreText;
