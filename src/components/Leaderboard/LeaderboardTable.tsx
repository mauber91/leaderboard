import React, { useRef } from 'react';
import { Player } from '../../types/leaderboard';

interface LeaderboardTableProps {
  players: Player[];
  filteredPlayers: Player[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalFiltered: number;
  handlePageChange: (page: number) => void;
  showGoToTop: boolean;
  scrollToTop: () => void;
  onScrollToPlayer: (playerId: string) => void;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  players,
  filteredPlayers,
  searchTerm,
  currentPage,
  itemsPerPage,
  totalPages,
  totalFiltered,
  handlePageChange,
  showGoToTop,
  scrollToTop,
  onScrollToPlayer
}) => {
  const playerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const scrollToPlayerPosition = (playerId: string) => {
    // Call the parent component's handler to clear search and show all items
    onScrollToPlayer(playerId);
    
    // Wait for the next render cycle to ensure the table is updated
    setTimeout(() => {
      const playerElement = playerRefs.current[playerId];
      if (playerElement) {
        playerElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Add a highlight effect
        playerElement.classList.add('highlight-player');
        setTimeout(() => {
          playerElement.classList.remove('highlight-player');
        }, 2000);
      }
    }, 100);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-btn"
        >
          ← Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-btn"
        >
          Next →
        </button>
      );
    }

    return (
      <div className="pagination">
        <div className="pagination-info">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalFiltered)} of {totalFiltered} players
        </div>
        <div className="pagination-controls">
          {pages}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="leaderboard-table">
        <div className="table-header">
          <div className="header-rank">Rank</div>
          <div className="header-name">Player</div>
          <div className="header-points">Points</div>
          <div className="header-distance-1st">To 1st</div>
          <div className="header-distance-top100">To Top 100</div>
          {searchTerm && <div className="header-actions">Actions</div>}
        </div>
        
        {filteredPlayers.map((player) => {
          // Calculate distances
          const topPlayer = players[0]; // First player (highest points)
          const distanceTo1st = topPlayer ? topPlayer.points - player.points : 0;
          const top100Threshold = players.length >= 100 ? players[99]?.points || 0 : 0;
          const distanceToTop100 = player.points - top100Threshold;
          
          return (
            <div 
              key={player.id} 
              className={`table-row ${player.rank <= 3 ? 'top-three' : ''}`}
              ref={(el) => { playerRefs.current[player.id] = el; }}
            >
              <div className="rank">
                <span className="rank-icon" title='Jump to position' onClick={() => scrollToPlayerPosition(player.id)}>{getRankIcon(player.rank)}</span>
              </div>
              <div className="player-name">
                <span>{player.name}</span>
                {player.name === 'kurt0411' && (
                  <img
                    className="player-icon"
                    src="https://shop.universalorlando.com/merchimages/P-ET-Uni-Mini-Plush-1291140.jpg"
                    alt=""
                    title="with E.T.'s help"
                  />
                )}
              </div>
              <div className="points">{player.points}</div>
              <div className="distance-1st">
                {distanceTo1st === 0 ? (
                  <span className="leader-badge">🥇 Leader</span>
                ) : (
                  <span className="distance-value">-{distanceTo1st}</span>
                )}
              </div>
              <div className="distance-top100">
                {player.rank <= 100 ? (
                  <span className="top100-badge">Top 100</span>
                ) : (
                  <span className="distance-value">-{Math.abs(distanceToTop100)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination - only show when not showing all items */}
      {itemsPerPage < players.length && renderPagination()}
      
      {/* Go to Top button - only show when scrolled down past 50 items */}
      {showGoToTop && (
        <div className="go-to-top-container">
          <button onClick={scrollToTop} className="go-to-top-button">
            ⬆️ Go to Top
          </button>
        </div>
      )}
    </>
  );
};

export default LeaderboardTable;
