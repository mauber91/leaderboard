import React, { useMemo } from 'react';
import { useLeaderboardData } from '../../hooks/useLeaderboardData';
import { useLeaderboardState } from '../../hooks/useLeaderboardState';
import LeaderboardControls from './LeaderboardControls';
import LeaderboardTable from './LeaderboardTable';
import LeaderboardStats from './LeaderboardStats';
import './Leaderboard.css';
import { formatTimeAgo } from '../../utils/time';
// import { streamResponse } from '../../config/llm-api';
import fbxmas2Image from '../../fbxmas2.png';

const LeaderboardContainer: React.FC = () => {
  // const [llmRequest, setLlmRequest] = React.useState<string>('');
  // const [llmResponse, setLlmResponse] = React.useState<string>('');

  const { players, loading, error, fetchLeaderboardData, lastUpdate } = useLeaderboardData();
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

  const lastUpdatedRelative = useMemo(() => (lastUpdate ? formatTimeAgo(lastUpdate) : ''), [lastUpdate]);

  const handleScrollToPlayer = (playerId: string) => {
    // Clear search to show all players
    setSearchTerm('');
    handlePageChange(1);
    handleItemsPerPageChange(players.length); // Show all items
  };

  // const callLLM = async (input: string) => {
  //   setLlmResponse('');
  //   if (!input.trim()) return;
  //   setLlmRequest(input);
  //   await streamResponse('http://localhost:8787', input, (token) => {
  //     console.log('token', token);
  //     
  //     setLlmResponse((prev) => prev + token);
  //   });
  //   // setLlmResponse(res);
  // };

  if  (loading) {
    return (
      <div className="leaderboard">
        <div className="leaderboard-header-image">
        <img src={fbxmas2Image} alt="Leaderboard header" className="header-image" />
      </div>
        <h1 className="leaderboard-title">{/* <span className="emoji">⚽</span> */}Kurt0411's Football Predictions Leaderboard</h1>
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
        <h1 className="leaderboard-title">{/* <span className="emoji">⚽</span> */}Football Predictions Leaderboard</h1>
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
      <div className="leaderboard-header-image">
        <img src={fbxmas2Image} alt="Leaderboard header" className="header-image" />
      </div>
      <h1 className="leaderboard-title">
        {/* <span className="emoji">⚽</span> */}Football Predictions Leaderboard
      </h1>
      {lastUpdatedRelative && (
        <div className="last-updated">last update: {lastUpdatedRelative}</div>
      )}

      {/* <div>
        <input
          type="text"
          placeholder="ask ET"
          value={llmRequest}
          onChange={(e) => setLlmRequest(e.target.value)}
          className="search-input"
        />
        <button
          key="next"
          onClick={() => callLLM(llmRequest)}
          className="pagination-btn"
        >
          call
        </button>
      </div> */}

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
