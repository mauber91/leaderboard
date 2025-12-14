import React, { useState, useEffect } from 'react';
import './Snow.css';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

const Snow: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const createSnowflakes = () => {
      const count = 100; // Number of snowflakes
      const flakes: Snowflake[] = [];

      for (let i = 0; i < count; i++) {
        flakes.push({
          id: i,
          left: Math.random() * 100, // Random horizontal position (0-100%)
          animationDuration: 3 + Math.random() * 7, // 3-10 seconds
          animationDelay: Math.random() * 5, // 0-5 seconds delay
          size: 2 + Math.random() * 4, // 2-6px
          opacity: 0.3 + Math.random() * 0.7, // 0.3-1.0
        });
      }

      setSnowflakes(flakes);
    };

    createSnowflakes();
  }, []);

  return (
    <div className="snow-container">
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="snowflake"
          style={{
            left: `${snowflake.left}%`,
            width: `${snowflake.size}px`,
            height: `${snowflake.size}px`,
            animationDuration: `${snowflake.animationDuration}s`,
            animationDelay: `${snowflake.animationDelay}s`,
            opacity: snowflake.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default Snow;
