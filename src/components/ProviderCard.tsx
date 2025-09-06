import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail } from "lucide-react";

interface ProviderCardProps {
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  serviceStyle: string;
  startingPrice: number;
  portfolioImages: string[];
  specialty: string;
  bio: string;
  phone?: string;
  email?: string;
}

export const ProviderCard = ({
  name,
  location,
  rating,
  reviewCount,
  serviceStyle,
  startingPrice,
  portfolioImages,
  specialty,
  bio,
  phone,
  email,
}: ProviderCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-smooth border-0 overflow-hidden group">
      {/* Portfolio Images Carousel */}
      <div className="relative h-48 overflow-hidden">
        <div className="flex animate-slide-up">
          <img 
            src={portfolioImages[0] || "/placeholder.svg"} 
            alt={`${name} portfolio`}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
          />
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {serviceStyle}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-1">{name}</h3>
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {location}
            </div>
            <div className="flex items-center mb-2">
              <div className="flex items-center mr-3">
                <Star className="h-4 w-4 text-construction-yellow fill-current mr-1" />
                <span className="font-medium">{rating}</span>
                <span className="text-muted-foreground text-sm ml-1">
                  ({reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              ${startingPrice}
            </div>
            <div className="text-sm text-muted-foreground">starting</div>
          </div>
        </div>

        {/* Specialty */}
        <div className="mb-3">
          <Badge variant="outline" className="text-xs">
            {specialty}
          </Badge>
        </div>

        {/* Bio */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
          {bio}
        </p>

        {/* Contact Info */}
        <div className="flex flex-col space-y-2 mb-4">
          {phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              {phone}
            </div>
          )}
          {email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              {email}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button variant="default" size="sm" className="flex-1">
            Contact
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};