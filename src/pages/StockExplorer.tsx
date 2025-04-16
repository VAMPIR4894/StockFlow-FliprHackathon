import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StockTable from '@/components/stocks/StockTable';
import { Stock, mockStocks, getUniqueSectors, filterStocks } from '@/lib/mockData';
import { Search, Filter, X, IndianRupee } from 'lucide-react';

const StockExplorer = () => {
  const sectors = getUniqueSectors();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>(mockStocks);
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Stock>('symbol');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const sectorFilter = selectedSector === 'all' ? '' : selectedSector;
    const filtered = filterStocks(searchTerm, sectorFilter, priceRange[0], priceRange[1]);
    
    const sorted = [...filtered].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        const numA = Number(valueA);
        const numB = Number(valueB);
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
    });
    
    setFilteredStocks(sorted);
  }, [searchTerm, selectedSector, priceRange, sortKey, sortDirection]);

  const handleSort = (key: keyof Stock) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSector('all');
    setPriceRange([0, 6000]);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const maxPrice = Math.max(...mockStocks.map(stock => stock.price));
  const roundedMaxPrice = Math.ceil(maxPrice / 1000) * 1000;

  return (
    <PageContainer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Stock Explorer</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFilters}
            className="md:hidden flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Browse, search and filter all available stocks
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="search" className="text-sm font-medium block mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Symbol or company name..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="sector" className="text-sm font-medium block mb-1">
                    Sector
                  </label>
                  <Select
                    value={selectedSector}
                    onValueChange={setSelectedSector}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Price Range (<span className="flex items-center inline-flex"><IndianRupee className="h-3 w-3" />{priceRange[0]}</span> - <span className="flex items-center inline-flex"><IndianRupee className="h-3 w-3" />{priceRange[1]}</span>)
                  </label>
                  <Slider
                    defaultValue={[0, roundedMaxPrice]}
                    min={0}
                    max={roundedMaxPrice}
                    step={100}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={handlePriceRangeChange}
                    className="my-4"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={resetFilters}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredStocks.length} stocks
                </div>
              </div>
              <StockTable 
                stocks={filteredStocks} 
                onSort={handleSort}
                sortKey={sortKey}
                sortDirection={sortDirection}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default StockExplorer;
