import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Mail, Clock, Briefcase } from "lucide-react";

interface ProviderCardProps {
  name: string;
  location: string;
  serviceStyle: string;
  startingPrice: number;
  specialty: string;
  bio: string;
  experience?: string;
  email?: string;
  phone?: string;
}

export const ProviderCard = ({
  name,
  location,
  serviceStyle,
  startingPrice,
  specialty,
  bio,
  experience,
  email,
  phone,
}: ProviderCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-smooth border-0 overflow-hidden group">
      {/* Service Style Badge */}
      <div className="p-4 pb-0">
        <div className="flex justify-end">
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
            {experience && (
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {experience} experience
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              ₹{startingPrice.toLocaleString('en-IN')}
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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                View Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  {name}'s Profile
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <h4 className="font-medium mb-2">Professional Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{location}</span>
                    </div>
                    {experience && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{experience} experience</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{specialty}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h4 className="font-medium mb-2">Pricing</h4>
                  <div className="text-2xl font-bold text-primary">
                    ₹{startingPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-muted-foreground">per hour (starting rate)</div>
                  <Badge variant="secondary" className="mt-2">
                    {serviceStyle}
                  </Badge>
                </div>

                {/* Bio */}
                <div>
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {bio}
                  </p>
                </div>

                {/* Contact Info */}
                {(email || phone) && (
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      {email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{email}</span>
                        </div>
                      )}
                      {phone && (
                        <div className="flex items-center">
                          <span className="h-4 w-4 mr-2 text-muted-foreground">📞</span>
                          <span>{phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Button */}
                <Button className="w-full">
                  Contact {name}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};