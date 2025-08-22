import React from 'react';

interface LeaderboardControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  itemsPerPage: number;
  handleItemsPerPageChange: (items: number) => void;
  totalPlayers: number;
  isSticky: boolean;
}

const LeaderboardControls: React.FC<LeaderboardControlsProps> = ({
  searchTerm,
  setSearchTerm,
  itemsPerPage,
  handleItemsPerPageChange,
  totalPlayers,
  isSticky
}) => {
  return (
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
          <option value={totalPlayers}>All ({totalPlayers})</option>
        </select>
        <span>per page</span>
      </div>
    </div>
  );
};

export default LeaderboardControls;
