import { useState, useEffect, useMemo } from 'react';

export const useLeaderboardState = (players: any[]) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Scroll effects state
  const [isSticky, setIsSticky] = useState(false);
  const [showGoToTop, setShowGoToTop] = useState(false);

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

  // Scroll event handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsSticky(scrollTop > 100);
      
      // Show Go To Top button only when scrolled past 50 items
      // Assuming each table row is roughly 60px tall, 50 items = 3000px
      const pixelsToScroll = 60 * 30;
      const tableElement = document.querySelector('.leaderboard-table') as HTMLElement;
      const tableStartPosition = tableElement?.offsetTop || 0;
      const scrollPast50Items = scrollTop > (tableStartPosition + pixelsToScroll);
      setShowGoToTop(scrollPast50Items);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return {
    // Pagination
    currentPage,
    itemsPerPage,
    filteredAndPaginatedPlayers,
    handlePageChange,
    handleItemsPerPageChange,
    
    // Search
    searchTerm,
    setSearchTerm,
    
    // Scroll effects
    isSticky,
    showGoToTop,
    scrollToTop
  };
};
