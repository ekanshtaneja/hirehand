import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin, Clock, MessageSquare, Send, CheckCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
const contactMethods = [{
  icon: Mail,
  title: "Email Support",
  details: "tanejas1000@gmail.com",
  description: "We'll respond within 24 hours",
  action: "Send Email"
}, {
  icon: MapPin,
  title: "Location",
  details: "India",
  description: "Remote consultation available",
  action: "Contact Us"
}];
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: ""
  });
  const [reviewData, setReviewData] = useState({
    name: "",
    email: "",
    rating: "",
    review: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || !formData.inquiryType) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Insert contact request into database
      const { error } = await supabase
        .from('contact_requests')
        .insert({
          client_name: formData.name,
          client_email: formData.email,
          message: `${formData.subject ? formData.subject + ': ' : ''}${formData.message} (Inquiry Type: ${formData.inquiryType})`,
          professional_id: '00000000-0000-0000-0000-000000000000' // General contact, not for specific professional
        });

      if (error) {
        console.error('Error saving contact:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setIsSubmitted(true);
      toast({
        title: "Message Sent",
        description: "Thank you for your message! We'll get back to you soon."
      });
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewData.name || !reviewData.email || !reviewData.rating || !reviewData.review) {
      toast({
        title: "Incomplete Review",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Insert review into database
      const { error } = await supabase
        .from('reviews')
        .insert({
          client_name: reviewData.name,
          client_email: reviewData.email,
          rating: parseInt(reviewData.rating),
          comment: reviewData.review,
          professional_id: null // General platform review
        });

      if (error) {
        console.error('Error saving review:', error);
        toast({
          title: "Error",
          description: "Failed to submit review. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Your review helps us improve."
      });
      setReviewData({
        name: "",
        email: "",
        rating: "",
        review: ""
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  };
  if (isSubmitted) {
    return <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center py-12">
        <Card className="w-full max-w-md shadow-elevated border-0 text-center">
          <CardContent className="p-12">
            <div className="p-4 gradient-hero rounded-full w-fit mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Message Received!
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for contacting HireHand. We'll review your message 
              and get back to you within 24 hours.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our platform? Need help with your project? 
            We're here to help you connect with the right professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                How to Reach Us
              </h2>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => <Card key={index} className="shadow-card border-0 group hover:shadow-elevated transition-smooth animate-slide-up" style={{
                animationDelay: `${index * 100}ms`
              }}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 gradient-hero rounded-lg shadow-construction">
                          <method.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {method.title}
                          </h3>
                          <p className="text-primary font-medium mb-1">
                            {method.details}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {method.description}
                          </p>
                          <Button variant="outline" size="sm">
                            {method.action}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>

            {/* Office Hours */}
            
          </div>

          {/* Review Section */}
          <div>
            <Card className="shadow-elevated border-0 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Leave a Review
                </CardTitle>
                <p className="text-muted-foreground">
                  Share your experience with HireHand to help us improve our services.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reviewName">Name *</Label>
                      <Input id="reviewName" value={reviewData.name} onChange={e => setReviewData({
                      ...reviewData,
                      name: e.target.value
                    })} placeholder="Your name" className="mt-2" required />
                    </div>
                    <div>
                      <Label htmlFor="reviewEmail">Email *</Label>
                      <Input id="reviewEmail" type="email" value={reviewData.email} onChange={e => setReviewData({
                      ...reviewData,
                      email: e.target.value
                    })} placeholder="your@email.com" className="mt-2" required />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <Label htmlFor="rating">Rating *</Label>
                    <Select value={reviewData.rating} onValueChange={value => setReviewData({
                    ...reviewData,
                    rating: value
                  })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Rate your experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                        <SelectItem value="2">⭐⭐ Fair</SelectItem>
                        <SelectItem value="1">⭐ Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Review */}
                  <div>
                    <Label htmlFor="review">Your Review *</Label>
                    <Textarea id="review" value={reviewData.review} onChange={e => setReviewData({
                    ...reviewData,
                    review: e.target.value
                  })} placeholder="Tell us about your experience with HireHand..." className="mt-2 min-h-[120px]" required />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Star className="mr-2 h-4 w-4" />
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="shadow-elevated border-0 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Send us a Message
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" value={formData.name} onChange={e => setFormData({
                      ...formData,
                      name: e.target.value
                    })} placeholder="Your full name" className="mt-2" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
                      ...formData,
                      email: e.target.value
                    })} placeholder="your@email.com" className="mt-2" required />
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <Label htmlFor="inquiryType">Inquiry Type *</Label>
                    <Select value={formData.inquiryType} onValueChange={value => setFormData({
                    ...formData,
                    inquiryType: value
                  })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="What can we help you with?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="customer">Customer Support</SelectItem>
                        <SelectItem value="professional">Professional Support</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" value={formData.subject} onChange={e => setFormData({
                    ...formData,
                    subject: e.target.value
                  })} placeholder="Brief description of your inquiry" className="mt-2" />
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" value={formData.message} onChange={e => setFormData({
                    ...formData,
                    message: e.target.value
                  })} placeholder="Please provide details about your inquiry..." className="mt-2 min-h-[120px]" required />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
}