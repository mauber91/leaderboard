import React from 'react';
import { useLeaderboardData } from '../../hooks/useLeaderboardData';
import { useLeaderboardState } from '../../hooks/useLeaderboardState';
import LeaderboardControls from './LeaderboardControls';
import LeaderboardTable from './LeaderboardTable';
import LeaderboardStats from './LeaderboardStats';
import './Leaderboard.css';

const LeaderboardContainer: React.FC = () => {
  const { players, loading, error, fetchLeaderboardData } = useLeaderboardData();
  const {
    currentPage,
    itemsPerPage,
    filteredAndPaginatedPlayers,
    handlePageChange,
    handleItemsPerPageChange,
    searchTerm,
    setSearchTerm,
    isSticky,
    showGoToTop,
    scrollToTop
  } = useLeaderboardState(players);

  const handleScrollToPlayer = (playerId: string) => {
    // Clear search to show all players
    setSearchTerm('');
    handlePageChange(1);
    handleItemsPerPageChange(players.length); // Show all items
  };

  if (loading) {
    return (
      <div className="leaderboard">
        <h1 className="leaderboard-title"><span className="emoji">⚽</span>Football Predictions Leaderboard</h1>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard">
        <h1 className="leaderboard-title"><span className="emoji">⚽</span>Football Predictions Leaderboard</h1>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchLeaderboardData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h1 className="leaderboard-title">
        <div className="beta-badge">Beta Version</div>
        <span className="emoji">⚽</span>Football Predictions Leaderboard
      </h1>
      
      <LeaderboardControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        handleItemsPerPageChange={handleItemsPerPageChange}
        totalPlayers={players.length}
        isSticky={isSticky}
      />
      
      <LeaderboardTable
        players={players}
        filteredPlayers={filteredAndPaginatedPlayers.filteredPlayers}
        searchTerm={searchTerm}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={filteredAndPaginatedPlayers.totalPages}
        totalFiltered={filteredAndPaginatedPlayers.totalFiltered}
        handlePageChange={handlePageChange}
        showGoToTop={showGoToTop}
        scrollToTop={scrollToTop}
        onScrollToPlayer={handleScrollToPlayer}
      />
      
      <LeaderboardStats
        players={players}
        totalFiltered={filteredAndPaginatedPlayers.totalFiltered}
      />
    </div>
  );
};

export default LeaderboardContainer;
