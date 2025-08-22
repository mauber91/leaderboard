import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { Player } from '../types/leaderboard';
import { getApiUrl, API_CONFIG } from '../config/api';
import './Leaderboard.css';

const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showGoToTop, setShowGoToTop] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Refs for scrolling to positions
  const playerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    /* if (!isTokenConfigured()) {
      setError('Bearer token not configured. Please set REACT_APP_BEARER_TOKEN in your environment variables.');
      setLoading(false);
      return;
    } */
    fetchLeaderboardData();
    
    // Add scroll event listener for sticky behavior and Go To Top button
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsSticky(scrollTop > 100);
      
      // Show Go To Top button only when scrolled past 50 items
      // Assuming each table row is roughly 60px tall, 50 items = 3000px
      const tableElement = document.querySelector('.leaderboard-table') as HTMLElement;
      const tableStartPosition = tableElement?.offsetTop || 0;
      const scrollPast50Items = scrollTop > (tableStartPosition + 3000);
      setShowGoToTop(scrollPast50Items);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Filter and paginate players
  const filteredAndPaginatedPlayers = useMemo(() => {
    // Filter by search term
    const filtered = players.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      filteredPlayers: filtered.slice(startIndex, endIndex),
      totalPages,
      totalFiltered: filtered.length
    };
  }, [players, searchTerm, currentPage, itemsPerPage]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.LEADERBOARD);
      // const headers = getAuthHeaders();
      
      // console.log('Making API call to:', apiUrl);
      // console.log('Headers:', headers);
      
      const response = await axios.get(apiUrl);

      // console.log('Response status:', response.status);
      //console.log('Response data:', response.data);

      // Transform the API response to match our Player interface
      // Adjust this transformation based on the actual API response structure
      const transformedPlayers: Player[] = response.data.map((player: any, index: number) => ({
        id: player.id || `player-${index}`,
        name: player.name || player.username || `Player ${index + 1}`,
        points: player.points || player.score || 0,
        correctPredictions: player.correctPredictions || player.correct || 0,
        totalPredictions: player.totalPredictions || player.total || 0,
        rank: index + 1
      }));

      // Sort by points (highest first) and update ranks
      const sortedPlayers = transformedPlayers
        .sort((a, b) => b.points - a.points)
        .map((player, index) => ({
          ...player,
          rank: index + 1
        }));

      setPlayers(sortedPlayers);
    } catch (err: any) {
      console.error('Error fetching leaderboard data:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      // Provide more specific error messages based on the error
      if (err.response?.status === 401) {
        setError('Authentication failed. Please check your bearer token.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load leaderboard data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const renderPagination = () => {
    const { totalPages } = filteredAndPaginatedPlayers;
    
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
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndPaginatedPlayers.totalFiltered)} of {filteredAndPaginatedPlayers.totalFiltered} players
        </div>
        <div className="pagination-controls">
          {pages}
        </div>
      </div>
    );
  };

  const scrollToPlayerPosition = (playerId: string) => {
    // Clear search to show all players
    setSearchTerm('');
    setCurrentPage(1);
    setItemsPerPage(players.length); // Show all items
    
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
      <h1 className="leaderboard-title"><div className="beta-badge">Beta Version</div><span className="emoji">⚽</span>Football Predictions Leaderboard</h1>
      
      {/* Search and Controls */}
      <div className={`leaderboard-controls ${isSticky ? 'sticky' : ''}`}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Show:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="items-select"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={players.length}>All ({players.length})</option>
          </select>
          <span>per page</span>
        </div>
      </div>
      
      <div className="leaderboard-table">
        <div className="table-header">
          <div className="header-rank">Rank</div>
          <div className="header-name">Player</div>
          <div className="header-points">Points</div>
          <div className="header-distance-1st">To 1st</div>
          <div className="header-distance-top100">To Top 100</div>
          {searchTerm && <div className="header-actions">Actions</div>}
        </div>
        
        {filteredAndPaginatedPlayers.filteredPlayers.map((player) => {
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
              <div className="player-name">{player.name}</div>
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
              {/* {searchTerm && (
                <div className="actions">
                  <button
                    onClick={() => scrollToPlayerPosition(player.id)}
                    className="jump-button"
                    title="Jump to position in main table"
                  >
                    🎯 Jump to Position
                  </button>
                </div>
              )} */}
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
      
      <div className="leaderboard-stats">
        <div className="stat-card">
          <h3>Total Players</h3>
          <p>{players.length}</p>
        </div>
        <div className="stat-card">
          <h3>Top Score</h3>
          <p>{players.length > 0 ? Math.max(...players.map(p => p.points)) : 0}</p>
        </div>
        <div className="stat-card">
          <h3>Average Points</h3>
          <p>{players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.points, 0) / players.length) : 0}</p>
        </div>
        <div className="stat-card">
          <h3>Filtered Results</h3>
          <p>{filteredAndPaginatedPlayers.totalFiltered}</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
