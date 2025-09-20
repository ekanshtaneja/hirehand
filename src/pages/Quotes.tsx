import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProviderCard } from "@/components/ProviderCard";
import { Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const fetchProfessionals = async () => {
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export default function Quotes() {
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    maxBudget: [1000],
    serviceStyle: "",
  });

  const { data: professionals = [], isLoading, error } = useQuery({
    queryKey: ['professionals'],
    queryFn: fetchProfessionals,
  });

  const transformedProfessionals = useMemo(() => {
    return professionals.map((prof: any) => ({
      id: prof.id,
      name: prof.name || 'Unknown',
      location: prof.location || 'Location not specified',
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
      reviewCount: Math.floor(Math.random() * 100) + 20, // Random reviews 20-120
      serviceStyle: Math.random() > 0.5 ? "Labor-based" : "Machine-assisted",
      startingPrice: prof.hourly_rate ? (parseInt(prof.hourly_rate.replace(/[^0-9]/g, '')) || 200) * 80 : 16000,
      portfolioImages: ["/placeholder.svg"],
      specialty: prof.specialty || 'General Services',
      bio: prof.description || 'Professional service provider with years of experience.',
      email: prof.email,
    }));
  }, [professionals]);

  const filteredProviders = useMemo(() => {
    return transformedProfessionals.filter((provider) => {
      if (filters.name && !provider.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.location && !provider.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (provider.startingPrice > filters.maxBudget[0]) {
        return false;
      }
      if (filters.serviceStyle && provider.serviceStyle !== filters.serviceStyle) {
        return false;
      }
      return true;
    });
  }, [transformedProfessionals, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Find Construction Professionals
          </h1>
          <p className="text-muted-foreground">
            Browse our network of vetted professionals and find the perfect match for your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-card border-0 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Provider Name */}
                <div>
                  <Label htmlFor="name-filter" className="text-sm font-medium">
                    Provider Name
                  </Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name-filter"
                      value={filters.name}
                      onChange={(e) => setFilters({...filters, name: e.target.value})}
                      placeholder="Search by name..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location-filter" className="text-sm font-medium">
                    Location
                  </Label>
                  <Input
                    id="location-filter"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    placeholder="e.g., Brooklyn, NY"
                    className="mt-2"
                  />
                </div>

                {/* Budget */}
                <div>
                  <Label className="text-sm font-medium">
                    Maximum Budget: ₹{filters.maxBudget[0] * 80}
                  </Label>
                  <Slider
                    value={filters.maxBudget}
                    onValueChange={(value) => setFilters({...filters, maxBudget: value})}
                    max={1000}
                    min={100}
                    step={50}
                    className="mt-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹8,000</span>
                    <span>₹80,000+</span>
                  </div>
                </div>

                {/* Service Style */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Service Style
                  </Label>
                  <RadioGroup 
                    value={filters.serviceStyle} 
                    onValueChange={(value) => setFilters({...filters, serviceStyle: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="all-styles" />
                      <Label htmlFor="all-styles" className="text-sm">All Styles</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Labor-based" id="labor-style" />
                      <Label htmlFor="labor-style" className="text-sm">Labor-based</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Machine-assisted" id="machine-style" />
                      <Label htmlFor="machine-style" className="text-sm">Machine-assisted</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Providers Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {filteredProviders.length} Professional{filteredProviders.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            {isLoading ? (
              <Card className="shadow-card border-0 p-12 text-center">
                <div className="text-muted-foreground">
                  <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <p>Loading professionals...</p>
                </div>
              </Card>
            ) : error ? (
              <Card className="shadow-card border-0 p-12 text-center">
                <div className="text-muted-foreground">
                  <h3 className="text-lg font-medium mb-2">Error loading professionals</h3>
                  <p>Please try again later.</p>
                </div>
              </Card>
            ) : filteredProviders.length === 0 ? (
              <Card className="shadow-card border-0 p-12 text-center">
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No professionals found</h3>
                  <p>Try adjusting your filters to see more results.</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProviders.map((provider, index) => (
                  <div 
                    key={provider.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProviderCard {...provider} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}