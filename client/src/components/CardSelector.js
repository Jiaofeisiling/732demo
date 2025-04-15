import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';

const CardSelector = ({ onSelect, selectedCard }) => {
  const { user } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [dailyCards, setDailyCards] = useState(3);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/users/me/cards', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        setCards(data.inventory);
        setDailyCards(data.dailyRemaining);
      } catch (error) {
        console.error('获取卡片失败:', error);
      }
    };
    
    if (user) {
      fetchCards();
    }
  }, [user]);

  const getCardColor = (type) => {
    switch (type) {
      case 'blank': return 'bg-gray-100';
      case 'special': return 'bg-purple-100';
      case 'periodic': return 'bg-blue-100';
      default: return 'bg-white';
    }
  };

  return (
    <div className="mb-4">
      <div className="text-sm font-medium mb-2">
        可用空白卡片: {dailyCards}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {cards.map(card => (
          <div
            key={card._id}
            onClick={() => onSelect(card)}
            className={`p-4 rounded-lg cursor-pointer border-2 ${
              selectedCard?._id === card._id 
                ? 'border-blue-500' 
                : 'border-transparent'
            } ${getCardColor(card.type)}`}
          >
            <h3 className="font-medium">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
            {card.type === 'special' && (
              <div className="mt-2 text-xs text-purple-600">
                加成: {card.bonus.experienceMultiplier}x经验
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;
