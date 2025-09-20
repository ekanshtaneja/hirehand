import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, UserPlus, Eye, BarChart3, TrendingUp, Clock, Mail, Shield, Trash2, User, MapPin, DollarSign, Calendar, FileText, MessageSquare, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
const ADMIN_PASSWORD = "admin123"; // In real app, this would be properly secured

type Professional = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  location?: string;
  description?: string;
  experience?: string;
  hourly_rate?: string;
  status: string;
  created_at: string;
  updated_at: string;
};
type QuoteRequest = {
  id: string;
  name: string;
  email: string;
  service: string;
  location: string;
  budget: string;
  created_at: string;
};
type ContactRequest = {
  id: string;
  client_name: string;
  client_email: string;
  message: string;
  status: string;
  created_at: string;
};
type Review = {
  id: string;
  client_name: string;
  client_email: string;
  rating: number;
  comment: string;
  created_at: string;
};
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalVisitors: 0,
    professionals: 0,
    newProfessionals: 0,
    weeklyVisitors: [0, 0, 0, 0, 0, 0, 0]
  });
  const {
    toast
  } = useToast();

  // Load real data from Supabase
  const loadData = async () => {
    try {
      // Fetch professionals via admin RPC (SECURITY DEFINER)
      const {
        data: profData,
        error: profError
      } = await (supabase as any).rpc('admin_get_professionals');

      // Fetch quote requests via admin RPC
      const {
        data: quoteData,
        error: quoteError
      } = await (supabase as any).rpc('admin_get_quote_requests');

      // Fetch contact requests
      const {
        data: contactData,
        error: contactError
      } = await supabase.from('contact_requests').select('*').order('created_at', {
        ascending: false
      }).limit(10);

      // Fetch reviews
      const {
        data: reviewData,
        error: reviewError
      } = await supabase.from('reviews').select('*').order('created_at', {
        ascending: false
      }).limit(10);

      // Fetch real visitor count from analytics
      const {
        data: analyticsData,
        error: analyticsError
      } = await supabase.from('analytics').select('*', {
        count: 'exact'
      });
      if (profError) {
        console.error('Error fetching professionals:', profError);
        toast({
          title: "Error",
          description: "Failed to load professionals data",
          variant: "destructive"
        });
      } else if (profData) {
        // Map the data to match our Professional type
        const mappedProfessionals: Professional[] = (profData as any[]).map((p: any) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          specialty: p.specialty,
          location: p.location,
          description: p.description,
          experience: p.experience,
          hourly_rate: p.hourly_rate,
          status: p.status || 'pending',
          created_at: p.created_at,
          updated_at: p.updated_at
        }));
        setProfessionals(mappedProfessionals);
      }
      if (quoteError) {
        console.error('Error fetching quotes:', quoteError);
        toast({
          title: "Error",
          description: "Failed to load quote requests",
          variant: "destructive"
        });
      } else if (quoteData) {
        // Map only the fields we use
        const mappedQuotes: QuoteRequest[] = (quoteData as any[]).map((q: any) => ({
          id: q.id,
          name: q.name,
          email: q.email,
          service: q.service,
          location: q.location,
          budget: q.budget,
          created_at: q.created_at
        }));
        setQuoteRequests(mappedQuotes);
      }
      if (contactError) {
        console.error('Error fetching contacts:', contactError);
      } else if (contactData) {
        setContactRequests(contactData);
      }
      if (reviewError) {
        console.error('Error fetching reviews:', reviewError);
      } else if (reviewData) {
        setReviews(reviewData);
      }

      // Update analytics with real data
      const profList = (profData ?? []) as any[];
      const profCount = profList.length;
      const newProfCount = profList.filter((p: any) => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
      const realVisitorCount = analyticsError ? 0 : analyticsData?.length || 0;
      setAnalyticsData({
        totalVisitors: realVisitorCount,
        professionals: profCount,
        newProfessionals: newProfCount,
        weeklyVisitors: [245, 198, 312, 287, 356, 423, 398] // Keep static for now
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      });
    }
  };
  const deleteProfessional = async (professionalId: string) => {
    try {
      const {
        error
      } = await (supabase as any).rpc('admin_delete_professional', {
        professional_id: professionalId
      });
      if (error) {
        console.error('Error deleting professional:', error);
        toast({
          title: "Error",
          description: "Failed to delete professional",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Professional deleted successfully"
        });
        // Reload data
        loadData();
      }
    } catch (error) {
      console.error('Error deleting professional:', error);
      toast({
        title: "Error",
        description: "Failed to delete professional",
        variant: "destructive"
      });
    }
  };
  const deleteAllProfessionals = async () => {
    try {
      const {
        data: deletedCount,
        error
      } = await (supabase as any).rpc('admin_delete_all_professionals');
      if (error) {
        console.error('Error deleting all professionals:', error);
        toast({
          title: "Error",
          description: "Failed to delete all professionals",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: `Successfully deleted ${deletedCount || 0} professionals`
        });
        // Reload data
        loadData();
      }
    } catch (error) {
      console.error('Error deleting all professionals:', error);
      toast({
        title: "Error",
        description: "Failed to delete all professionals",
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Welcome Admin",
        description: "Successfully logged into the admin dashboard."
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password. Please try again.",
        variant: "destructive"
      });
    }
  };
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center py-12">
        <Card className="w-full max-w-md shadow-elevated border-0">
          <CardHeader className="text-center">
            <div className="p-3 gradient-hero rounded-lg w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <p className="text-muted-foreground">
              Enter the admin password to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" className="mt-2" required />
              </div>
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
            
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor platform activity and manage the HireHand marketplace.
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card border-0 animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                  <p className="text-3xl font-bold text-foreground">{analyticsData.totalVisitors.toLocaleString()}</p>
                </div>
                <div className="p-3 gradient-hero rounded-lg shadow-construction">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 animate-slide-up animate-delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Professionals</p>
                  <p className="text-3xl font-bold text-foreground">{analyticsData.professionals}</p>
                </div>
                <div className="p-3 gradient-service rounded-lg shadow-card">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 animate-slide-up animate-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Professionals</p>
                  <p className="text-3xl font-bold text-foreground">{analyticsData.newProfessionals}</p>
                </div>
                <div className="p-3 bg-construction-yellow rounded-lg shadow-card">
                  <UserPlus className="h-6 w-6 text-construction-steel" />
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Visitors Chart */}
          <Card className="shadow-card border-0 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Weekly Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.weeklyVisitors.map((visitors, index) => <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 text-sm text-muted-foreground">
                      Day {index + 1}
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                      <div className="h-full gradient-hero transition-smooth" style={{
                    width: `${visitors / Math.max(...analyticsData.weeklyVisitors) * 100}%`
                  }}></div>
                    </div>
                    <div className="w-12 text-sm font-medium text-right">
                      {visitors}
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          {/* Newly Registered Professionals */}
          <Card className="shadow-card border-0 animate-slide-up animate-delay-100">
            <CardHeader>
              <CardTitle>Newly Registered Professionals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {professionals.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                    No professionals registered yet.
                  </div> : professionals.slice(0, 5).map(professional => <div key={professional.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">{professional.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {professional.email}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {professional.specialty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {new Date(professional.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>)}
              </div>
            </CardContent>
          </Card>

          {/* Recent Quote Requests */}
          <Card className="shadow-card border-0 animate-slide-up animate-delay-200">
            <CardHeader>
              <CardTitle>Recent Quote Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-medium text-muted-foreground">Service</th>
                      <th className="text-left py-3 font-medium text-muted-foreground">Location</th>
                      <th className="text-left py-3 font-medium text-muted-foreground">Budget</th>
                      <th className="text-left py-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteRequests.length === 0 ? <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No quote requests yet.
                        </td>
                      </tr> : quoteRequests.map(quote => <tr key={quote.id} className="border-b border-border">
                          <td className="py-4 font-medium text-foreground">{quote.service}</td>
                          <td className="py-4 text-muted-foreground">{quote.location}</td>
                          <td className="py-4 text-foreground font-medium">{quote.budget || "Not specified"}</td>
                          <td className="py-4 text-muted-foreground">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            <Badge variant="outline" className="text-construction-safety border-construction-safety">
                              New
                            </Badge>
                          </td>
                        </tr>)}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Contact Requests */}
          <Card className="shadow-card border-0 animate-slide-up animate-delay-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactRequests.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                    No contact requests yet.
                  </div> : contactRequests.map(contact => <div key={contact.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{contact.client_name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{contact.client_email}</span>
                            <Badge variant="outline" className="text-xs">
                              {contact.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground mt-2 line-clamp-2">{contact.message}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm text-muted-foreground">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>)}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="shadow-card border-0 animate-slide-up animate-delay-400">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Platform Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                    No reviews yet.
                  </div> : reviews.map(review => <div key={review.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-foreground">{review.client_name}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{review.client_email}</span>
                          </div>
                          <p className="text-sm text-foreground mt-2 line-clamp-2">{review.comment}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>)}
              </div>
            </CardContent>
          </Card>

          {/* Professional Management */}
          <Card className="shadow-card border-0 animate-slide-up animate-delay-500 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Professional Management
                </CardTitle>
                {professionals.length > 0 && <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete All Professionals</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <strong>all {professionals.length} professionals</strong>? 
                          This action cannot be undone and will permanently remove all professional data from the system.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteAllProfessionals} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete All Professionals
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {professionals.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                    No professionals registered yet.
                  </div> : professionals.map(professional => <div key={professional.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium text-foreground">{professional.name}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {professional.email}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {professional.specialty}
                              </Badge>
                              <Badge variant={professional.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                                {professional.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Professional Details Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Professional Details
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Personal Information</h4>
                                  <div className="space-y-2">
                                    <p className="text-sm"><span className="font-medium">Name:</span> {professional.name}</p>
                                    <p className="text-sm"><span className="font-medium">Email:</span> {professional.email}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Professional Details</h4>
                                  <div className="space-y-2">
                                    <p className="text-sm"><span className="font-medium">Specialty:</span> {professional.specialty}</p>
                                    {professional.location && <p className="text-sm flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {professional.location}
                                      </p>}
                                    {professional.hourly_rate && <p className="text-sm flex items-center">
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        {professional.hourly_rate}
                                      </p>}
                                    {professional.experience && <p className="text-sm">
                                        <span className="font-medium">Experience:</span> {professional.experience}
                                      </p>}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Status & Dates</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <Badge variant={professional.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                                        {professional.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Registered: {new Date(professional.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Updated: {new Date(professional.updated_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                
                                {professional.description && <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
                                      <FileText className="h-3 w-3 mr-1" />
                                      Description
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{professional.description}</p>
                                  </div>}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Professional Alert Dialog */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Professional</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete <strong>{professional.name}</strong>? 
                                This action cannot be undone and will permanently remove all their information from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProfessional(professional.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete Professional
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}