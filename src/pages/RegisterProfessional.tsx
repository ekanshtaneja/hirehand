import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Shield, 
  Star,
  UserPlus,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  {
    icon: Users,
    title: "Access to Customers",
    description: "Connect with homeowners and businesses looking for your expertise."
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Expand your client base and increase your revenue potential."
  },
  {
    icon: Shield,
    title: "Trusted Platform",
    description: "Join a vetted network of professionals with verified credentials."
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description: "Showcase your work and collect reviews to build trust."
  }
];

const specialties = [
  "Painting",
  "Carpentry", 
  "Electrical",
  "Plumbing",
  "Masonry",
  "Interior Design",
  "General Contracting",
  "Roofing",
  "Flooring",
  "HVAC",
  "Other"
];

export default function RegisterProfessional() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    bio: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.specialty || !formData.bio) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Submit form (mock)
    console.log("Professional registration:", formData);
    setIsSubmitted(true);
    
    toast({
      title: "Registration Submitted",
      description: "Thank you for joining HireHand! We'll review your application and get back to you soon.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center py-12">
        <Card className="w-full max-w-2xl shadow-elevated border-0 text-center">
          <CardContent className="p-12">
            <div className="p-4 gradient-hero rounded-full w-fit mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Application Submitted!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for your interest in joining the HireHand professional network. 
              We'll review your application and contact you within 2-3 business days.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">What's Next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Application review (24-48 hours)</li>
                  <li>• Background verification</li>
                  <li>• Profile setup assistance</li>
                  <li>• Welcome to the network!</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Contact our professional support team:
                </p>
                <div className="text-sm text-muted-foreground">
                  <div>📧 pros@hirehand.com</div>
                  <div>📞 (555) 123-4567</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Join Our Professional Network
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with customers, grow your business, and build your reputation 
            on the most trusted construction marketplace.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="shadow-card border-0 text-center group hover:shadow-elevated transition-smooth animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="p-3 gradient-hero rounded-lg w-fit mx-auto mb-4 group-hover:shadow-construction transition-smooth">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Registration Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-elevated border-0 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center">
                <UserPlus className="mr-2 h-6 w-6" />
                Professional Registration
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Fill out the form below to join our network of trusted professionals.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-base font-medium">
                    Full Name / Business Name *
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., John Smith or Smith Construction LLC"
                      className="pl-10"
                      required
                    />
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-base font-medium">
                    Email Address *
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      className="pl-10"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-base font-medium">
                    Phone Number *
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                      className="pl-10"
                      required
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Specialty */}
                <div>
                  <Label htmlFor="specialty" className="text-base font-medium">
                    Primary Specialty *
                  </Label>
                  <Select value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your primary specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio" className="text-base font-medium">
                    Professional Bio *
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell customers about your experience, specialties, and what makes you unique. Include years of experience, certifications, and notable projects."
                    className="mt-2 min-h-[120px]"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This will be displayed on your public profile. {formData.bio.length}/500 characters.
                  </p>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full" size="lg">
                  Submit Application
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our terms of service and 
                  professional conduct guidelines. All applications are subject to review.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}