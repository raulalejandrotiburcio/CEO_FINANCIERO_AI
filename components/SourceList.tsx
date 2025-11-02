
import React from 'react';
import { GroundingSource } from '../types';

interface SourceListProps {
  sources: GroundingSource[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-3 border-t border-gray-700">
      <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Sources</h4>
      <ul className="space-y-1">
        {sources.map((source, index) => (
          <li key={index} className="flex items-start">
            <span className="text-cyan-400 mr-2 text-sm">&#8226;</span>
            <a
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline text-sm break-all"
            >
              {source.title || source.uri}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourceList;
