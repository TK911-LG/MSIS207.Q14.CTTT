import React from 'react';
import { BookOpen } from 'lucide-react';

const JournalPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center fade-in">
      <div className="w-20 h-20 bg-[#E7F3F0] rounded-full flex items-center justify-center text-[#5E8B7E] mb-4 animate-pulse">
        <BookOpen size={40} />
      </div>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Journal</h2>
      <p className="text-stone-500">Feature coming soon.</p>
    </div>
  );
};

export default JournalPage;

