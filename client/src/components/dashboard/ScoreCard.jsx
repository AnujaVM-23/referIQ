// client/src/components/dashboard/ScoreCard.jsx
import React, { useState, useEffect } from 'react';
import { scoreAPI } from '../../services/api';
import Badge from '../common/Badge';

const ScoreCard = ({ userId }) => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScore();
  }, [userId]);

  const fetchScore = async () => {
    try {
      setLoading(true);
      const response = await scoreAPI.getScore(userId);
      setScore(response.data);
    } catch (error) {
      console.error('Error fetching score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading score...</div>;
  if (!score) return <div>Score not available</div>;

  const getTierColor = (score) => {
    if (score >= 600) return 'platinum';
    if (score >= 300) return 'gold';
    if (score >= 100) return 'silver';
    return 'bronze';
  };

  const tier = getTierColor(score.totalScore);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">Trust Score</h3>

      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-blue-600 mb-2">{score.totalScore}</div>
        <Badge variant={tier} className="text-lg">
          {tier.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 border-t pt-6">
        {Object.entries(score.components || {}).map(([key, value]) => (
          <div key={key} className="text-center">
            <p className="text-gray-600 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold text-blue-600">{value}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold mb-3">Recent Events</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {score.events?.slice(-5).map((event, index) => (
            <div key={index} className="text-sm bg-gray-50 p-2 rounded flex justify-between">
              <span>{event.type}</span>
              <span className={event.delta >= 0 ? 'text-green-600' : 'text-red-600'}>
                {event.delta >= 0 ? '+' : ''}{event.delta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
