import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProviderCard } from "@/components/ProviderCard";
import { Search, Filter } from "lucide-react";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useToast } from "@/hooks/use-toast";

// Mock provider data
const providers = [
  {
    id: 1,
    name: "Mike Rodriguez",
    location: "Brooklyn, NY",
    rating: 4.9,
    reviewCount: 127,
    serviceStyle: "Labor-based",
    startingPrice: "$200/hour",
    portfolioImages: ["/placeholder.svg"],
    specialty: "Interior Painting",
    bio: "Professional painter with 15+ years of experience. Specializing in high-quality interior and exterior painting with attention to detail.",
    phone: "(555) 123-4567",
    email: "mike@paintpro.com",
  },
  {
    id: 2,
    name: "Sarah Construction Co.",
    location: "Manhattan, NY",
    rating: 4.8,
    reviewCount: 89,
    serviceStyle: "Machine-assisted",
    startingPrice: "$180/hour",
    portfolioImages: ["/placeholder.svg"],
    specialty: "Commercial Painting",
    bio: "Full-service painting company with modern equipment and eco-friendly materials. Licensed and insured.",
    phone: "(555) 234-5678",
    email: "info@sarahconstruction.com",
  },
  {
    id: 3,
    name: "Tom's Carpentry",
    location: "Queens, NY",
    rating: 5.0,
    reviewCount: 203,
    serviceStyle: "Labor-based",
    startingPrice: "$350/hour",
    portfolioImages: ["/placeholder.svg"],
    specialty: "Custom Furniture",
    bio: "Master carpenter creating beautiful custom furniture and built-ins. Every piece is crafted with precision and care.",
    phone: "(555) 345-6789",
    email: "tom@tomscarpentry.com",
  },
  {
    id: 4,
    name: "ElectriTech Solutions",
    location: "Bronx, NY",
    rating: 4.7,
    reviewCount: 156,
    serviceStyle: "Machine-assisted",
    startingPrice: "$150/hour",
    portfolioImages: ["/placeholder.svg"],
    specialty: "Smart Home Wiring",
    bio: "Modern electrical solutions for smart homes. Certified electricians with latest technology and safety standards.",
    phone: "(555) 456-7890",
    email: "service@electritech.com",
  },
  {
    id: 5,
    name: "Maria's Interiors",
    location: "Staten Island, NY",
    rating: 4.9,
    reviewCount: 94,
    serviceStyle: "Labor-based",
    startingPrice: "$500/hour",
    portfolioImages: ["/placeholder.svg"],
    specialty: "Residential Design",
    bio: "Award-winning interior designer transforming homes with elegant, functional designs that reflect your personality.",
    phone: "(555) 567-8901",
    email: "maria@mariasinteriors.com",
  },
  {
    id: 6,
    name: "Brooklyn Masonry",
    location: "Brooklyn, NY",
    rating: 4.6,
    reviewCount: 78,
    serviceStyle: "Machine-assisted",
    startingPrice: "$400/hour",
    portfolioImages: ["/placeholder.svg"],
    specialty: "Brick Restoration",
    bio: "Specializing in historic brick restoration and modern masonry work. Preserving the past while building the future.",
    phone: "(555) 678-9012",
    email: "info@brooklynmasonry.com",
  },
];

export default function Quotes() {
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    maxBudget: [1000],
    serviceStyle: "",
  });
  
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const { convert, convertPrice, loading, error } = useCurrencyConverter();
  const { toast } = useToast();

  // Fetch exchange rate on component mount
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (!exchangeRate) {
        const result = await convert(1, 'USD', 'INR');
        if (result) {
          setExchangeRate(result.rate);
        } else if (error) {
          toast({
            title: "Currency Conversion Error",
            description: "Failed to fetch exchange rate. Please refresh the page.",
            variant: "destructive"
          });
        }
      }
    };
    
    fetchExchangeRate();
  }, [exchangeRate, convert, error, toast]);

  const convertedProviders = useMemo(() => {
    if (!exchangeRate) {
      return providers;
    }
    
    return providers.map(provider => ({
      ...provider,
      startingPrice: convertPrice(provider.startingPrice, exchangeRate)
    }));
  }, [exchangeRate, convertPrice]);

  const filteredProviders = useMemo(() => {
    return convertedProviders.filter((provider) => {
      if (filters.name && !provider.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.location && !provider.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      // Extract numeric value from price string for comparison (always INR)
      const priceMatch = provider.startingPrice.match(/₹([\d,]+)/);
      const providerPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
      const maxBudget = filters.maxBudget[0] * (exchangeRate || 83);
      if (providerPrice > maxBudget) {
        return false;
      }
      if (filters.serviceStyle && provider.serviceStyle !== filters.serviceStyle) {
        return false;
      }
      return true;
    });
  }, [convertedProviders, filters, exchangeRate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Find Construction Professionals
              </h1>
              <p className="text-muted-foreground">
                Browse our network of vetted professionals and find the perfect match for your project.
              </p>
            </div>
          </div>
          
          {exchangeRate && (
            <div className="text-sm text-muted-foreground mb-4">
              All prices shown in Indian Rupees (₹) | Exchange Rate: 1 USD = ₹{exchangeRate.toFixed(2)}
            </div>
          )}
          
          {loading && (
            <div className="text-sm text-muted-foreground mb-4">
              Loading exchange rates...
            </div>
          )}
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
                    Maximum Budget: ₹{Math.round(filters.maxBudget[0] * (exchangeRate || 83)).toLocaleString('en-IN')}
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
                    <span>₹{Math.round(100 * (exchangeRate || 83)).toLocaleString('en-IN')}</span>
                    <span>₹{Math.round(1000 * (exchangeRate || 83)).toLocaleString('en-IN')}+</span>
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

            {filteredProviders.length === 0 ? (
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