import React from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';

export function Matches() {
  const matches = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Founder',
      skills: ['AI/ML', 'Product Strategy', 'Leadership'],
      bio: 'Building the future of AI-powered education. Looking for technical co-founders.',
    },
    {
      id: 2,
      name: 'Alex Rivera',
      role: 'Developer',
      skills: ['React', 'Node.js', 'AWS'],
      bio: 'Full-stack developer with 5 years of experience. Interested in joining early-stage startups.',
    },
    {
      id: 3,
      name: 'Michael Kim',
      role: 'Investor',
      skills: ['Venture Capital', 'Strategy', 'Growth'],
      bio: 'Angel investor focusing on B2B SaaS and deep tech startups.',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Matches</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{match.name}</h3>
            <p className="text-blue-600 mb-2">{match.role}</p>
            <p className="text-gray-600 mb-4">{match.bio}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {match.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                <MessageSquare className="w-4 h-4 mr-1" />
                Message
              </button>
              <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
                <ThumbsUp className="w-4 h-4 mr-1" />
                Like
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}