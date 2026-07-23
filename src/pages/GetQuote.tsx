import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Bot, DollarSign, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Mock AI pricing function
const getAIPrice = async (data: any): Promise<{price: string, justification: string}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const basePrice = {
    painting: 200,
    carpentry: 300,
    electrical: 150,
    plumbing: 120,
    masonry: 400,
    "interior-design": 500,
  }[data.service] || 250;

  const multiplier = data.style === "machine-assisted" ? 0.8 : 1.2;
  const locationFactor = data.location.toLowerCase().includes("city") ? 1.3 : 1;

  const INR_PER_USD = 5;
  const minPrice = Math.round(basePrice * multiplier * locationFactor) * INR_PER_USD;
  const maxPrice = Math.round(minPrice * 1.8);

  return {
    price: `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`,
    justification: `Based on ${data.service} service, ${data.style} approach in ${data.location}. Factors: complexity, location demand, and material costs.`
  };
};

const serviceNames: Record<string, string> = {
  painting: "Painting",
  carpentry: "Carpentry", 
  electrical: "Electrical",
  plumbing: "Plumbing",
  masonry: "Masonry",
  "interior-design": "Interior Design",
};

export default function GetQuote() {
  const { service = "painting" } = useParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    service,
    style: "",
    location: "",
    requirements: "",
    name: "",
    email: "",
    
  });
  const [aiPrice, setAiPrice] = useState<{price: string, justification: string} | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleGetAIPrice = async () => {
    if (!formData.style || !formData.location || !formData.requirements) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before getting AI price suggestion.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingAI(true);
    try {
      const price = await getAIPrice(formData);
      setAiPrice(price);
      toast({
        title: "AI Price Generated",
        description: "Price suggestion ready! Review the estimate below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI price suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.style || !formData.location || !formData.requirements || !formData.name || !formData.email) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Save quote request to database
      const { error } = await supabase
        .from('quote_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          
          service: formData.service,
          location: formData.location,
          description: `${formData.style} style. ${formData.requirements}`,
          budget: aiPrice?.price || null,
        });

      if (error) throw error;
      
      toast({
        title: "Quote Request Submitted",
        description: "We'll connect you with professionals in your area!",
      });
      
      // Navigate to quotes page with form data
      window.location.href = "/quotes";
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your quote request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Get {serviceNames[service] || "Service"} Quote
          </h1>
          <p className="text-muted-foreground">
            Tell us about your project and get matched with trusted professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Style */}
                  <div>
                    <Label className="text-base font-medium">Service Style</Label>
                    <RadioGroup 
                      value={formData.style} 
                      onValueChange={(value) => setFormData({...formData, style: value})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="labor-based" id="labor" />
                        <Label htmlFor="labor">Labor-based (Traditional methods)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="machine-assisted" id="machine" />
                        <Label htmlFor="machine">Machine-assisted (Modern tools)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                   {/* Contact Information */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-medium">Contact Information</h3>
                     
                     <div>
                       <Label htmlFor="name" className="text-base font-medium">
                         Your Name *
                       </Label>
                       <Input
                         id="name"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         placeholder="Full Name"
                         className="mt-2"
                         required
                       />
                     </div>

                     <div>
                       <Label htmlFor="email" className="text-base font-medium">
                         Email Address *
                       </Label>
                       <Input
                         id="email"
                         type="email"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         placeholder="your@email.com"
                         className="mt-2"
                         required
                       />
                     </div>

                   </div>

                   {/* Location */}
                   <div>
                     <Label htmlFor="location" className="text-base font-medium">
                       Project Location *
                     </Label>
                     <Input
                       id="location"
                       value={formData.location}
                       onChange={(e) => setFormData({...formData, location: e.target.value})}
                       placeholder="e.g., New York City, NY"
                       className="mt-2"
                       required
                     />
                   </div>

                  {/* Requirements */}
                  <div>
                    <Label htmlFor="requirements" className="text-base font-medium">
                      Project Requirements *
                    </Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      placeholder="Describe your project in detail - size, timeline, special requirements, materials, etc."
                      className="mt-2 min-h-[120px]"
                      required
                    />
                  </div>

                  {/* AI Price Button */}
                  <Button
                    type="button"
                    variant="construction"
                    onClick={handleGetAIPrice}
                    disabled={isLoadingAI}
                    className="w-full"
                  >
                    {isLoadingAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Getting AI Price...
                      </>
                    ) : (
                      <>
                        <Bot className="mr-2 h-4 w-4" />
                        Get AI Price Suggestion
                      </>
                    )}
                  </Button>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" size="lg">
                    Get Professional Quotes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Price Display */}
          <div className="lg:col-span-1">
            <Card className="shadow-card border-0 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-primary" />
                  AI Price Estimate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiPrice ? (
                  <div className="space-y-4">
                    <div className="text-center p-6 gradient-accent rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {aiPrice.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Estimated Price Range
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Justification
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {aiPrice.justification}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Fill out the form and click "Get AI Price Suggestion" to see an estimated price range for your project.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}