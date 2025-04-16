import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, MessageSquare, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { filterStocks, mockStocks, Stock } from "@/lib/mockData";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/explorer", label: "Explorer" },
    { path: "/insights", label: "Insights" },
    { path: "/watchlist", label: "Watchlist" },
  ];

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of StockFlow",
    });
    navigate("/auth");
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    if (value.trim()) {
      const filtered = filterStocks(value);
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSelect = (stock: Stock) => {
    navigate(`/stock/${stock.symbol}`);
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleSelect(searchResults[0]);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SearchResults = () => (
    <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
      {searchResults.length > 0 ? (
        <div className="py-1">
          {searchResults.map((stock) => (
            <div
              key={stock.symbol}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
              onClick={() => handleSelect(stock)}
            >
              <div>
                <span className="font-medium">{stock.symbol}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">{stock.name}</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">₹{stock.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
          No stocks found
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 dark:bg-stockflow-navy/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img 
                src="/uploads/99fb7d4f-0028-459f-99af-71f6fd8541a9.png" 
                alt="StockFlow Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-stockflow-navy dark:text-white">
                StockFlow
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-1 py-2 text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "text-stockflow-gold border-b-2 border-stockflow-gold"
                      : "text-gray-700 hover:text-stockflow-gold dark:text-gray-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search stocks..."
                className="pl-10 w-64 h-9 bg-gray-100 dark:bg-gray-800 border-0"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {showSearchResults && <SearchResults />}
            </div>

            <ThemeToggle />

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-700 dark:text-gray-200"
              onClick={() => navigate("/ai-chat")}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-stockflow-navy border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? "bg-stockflow-gold/10 text-stockflow-gold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2">
              <div className="relative px-3" ref={searchRef}>
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search stocks..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {showSearchResults && <SearchResults />}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
