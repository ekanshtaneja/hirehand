import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Mail, Phone, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProviderCard } from "@/components/ProviderCard";

type Professional = {
  id: string;
  name: string;
  specialty: string;
  created_at: string;
  status: string;
  location?: string;
  description?: string;
  experience?: string;
  hourly_rate?: string;
};

export default function FindPros() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch approved professionals from Supabase
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const { data, error } = await supabase
          .from('professionals_public')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setProfessionals(data || []);
        setFilteredProfessionals(data || []);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  // Filter professionals based on search and specialty
  useEffect(() => {
    let filtered = professionals;

    if (searchTerm) {
      filtered = filtered.filter(pro => 
        pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pro.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pro.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(pro => pro.specialty === selectedSpecialty);
    }

    setFilteredProfessionals(filtered);
  }, [searchTerm, selectedSpecialty, professionals]);

  const specialties = Array.from(new Set(professionals.map(p => p.specialty)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading professionals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Trusted Professionals
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Browse our network of verified professionals ready to help with your construction and home improvement projects.
          </p>
        </div>

        {/* Filters */}
        <Card className="shadow-card border-0 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredProfessionals.length === 0 ? (
          <Card className="shadow-card border-0">
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                {professionals.length === 0 
                  ? "No approved professionals found. Check back later!" 
                  : "No professionals match your search criteria. Try adjusting your filters."
                }
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <ProviderCard
                key={professional.id}
                name={professional.name}
                location={professional.location || "Location not specified"}
                rating={4.8} // Mock rating for now
                reviewCount={12} // Mock review count for now
                serviceStyle={professional.specialty}
                startingPrice={professional.hourly_rate || "Contact for quote"}
                portfolioImages={["/placeholder.svg"]} // Mock image for now
                specialty={professional.specialty}
                bio={professional.description || "Experienced professional ready to help with your project."}
                phone={undefined}
                email={undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}