import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Eye, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Mail, 
  Phone, 
  Shield, 
  LogOut,
  FileText,
  Star,
  MessageSquare,
  Calendar,
  MapPin,
  DollarSign,
  Activity,
  Database,
  Settings,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

const ADMIN_PASSWORD = "admin123"; // In real app, this would be properly secured

type Professional = {
  id: string;
  name: string;
  email: string;
  phone?: string;
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
  phone?: string;
  service: string;
  location: string;
  budget?: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

type ContactRequest = {
  id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  professional_id: string;
  message: string;
  status: string;
  created_at: string;
};

type Review = {
  id: string;
  professional_id: string;
  client_name: string;
  client_email: string;
  rating: number;
  comment?: string;
  created_at: string;
};

type Analytics = {
  id: string;
  page_path: string;
  visitor_ip?: string;
  user_agent?: string;
  created_at: string;
};

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAllData();
      setupRealTimeUpdates();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      // Fetch all data in parallel
      const [
        { data: profData },
        { data: quoteData },
        { data: contactData },
        { data: reviewData },
        { data: analyticsData }
      ] = await Promise.all([
        supabase.rpc('admin_get_professionals'),
        supabase.rpc('admin_get_quote_requests'),
        supabase.from('contact_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('analytics').select('*').order('created_at', { ascending: false })
      ]);

      if (profData) setProfessionals(profData);
      if (quoteData) setQuoteRequests(quoteData);
      if (contactData) setContactRequests(contactData);
      if (reviewData) setReviews(reviewData);
      if (analyticsData) setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch some data. Please refresh the page.",
        variant: "destructive"
      });
    }
  };

  const setupRealTimeUpdates = () => {
    // Set up real-time updates for all tables
    const channels = [
      supabase.channel('admin_professionals').on('postgres_changes', { event: '*', schema: 'public', table: 'professionals' }, fetchAllData),
      supabase.channel('admin_quotes').on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, fetchAllData),
      supabase.channel('admin_contacts').on('postgres_changes', { event: '*', schema: 'public', table: 'contact_requests' }, fetchAllData),
      supabase.channel('admin_reviews').on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, fetchAllData),
      supabase.channel('admin_analytics').on('postgres_changes', { event: '*', schema: 'public', table: 'analytics' }, fetchAllData)
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  };

  // Handle approve/reject professional
  const handleApproveReject = async (professionalId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase.rpc('admin_update_professional_status', {
        professional_id: professionalId,
        new_status: status
      });

      if (error) throw error;

      toast({
        title: status === 'approved' ? "Professional Approved" : "Professional Rejected",
        description: `Professional has been ${status} successfully.`
      });

      fetchAllData();
    } catch (error) {
      console.error('Error updating professional status:', error);
      toast({
        title: "Error",
        description: "Failed to update professional status.",
        variant: "destructive"
      });
    }
  };

  // Handle delete professional
  const handleDeleteProfessional = async (professionalId: string, professionalName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${professionalName}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.rpc('admin_delete_professional', {
        professional_id: professionalId
      });

      if (error) throw error;

      toast({
        title: "Professional Deleted",
        description: `${professionalName} has been permanently removed.`
      });

      fetchAllData();
    } catch (error) {
      console.error('Error deleting professional:', error);
      toast({
        title: "Error",
        description: "Failed to delete professional.",
        variant: "destructive"
      });
    }
  };


  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an error signing you out.",
        variant: "destructive",
      });
    }
  };

  // Statistics calculations
  const stats = {
    totalVisitors: analytics.length,
    totalProfessionals: professionals.length,
    pendingProfessionals: professionals.filter(p => p.status === 'pending').length,
    approvedProfessionals: professionals.filter(p => p.status === 'approved').length,
    totalQuotes: quoteRequests.length,
    totalContactRequests: contactRequests.length,
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0",
    recentActivity: analytics.filter(a => 
      new Date(a.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center py-12">
        <Card className="w-full max-w-md shadow-elevated border-0">
          <CardHeader className="text-center">
            <div className="p-3 gradient-hero rounded-lg w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <p className="text-muted-foreground">
              You need to be authenticated to access the admin dashboard.
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Complete overview and management of HireHand platform
            </p>
          </div>
          <Button variant="outline" onClick={signOut} className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="professionals">Professionals</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalVisitors}</p>
                    </div>
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Professionals</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalProfessionals}</p>
                      <p className="text-xs text-muted-foreground">{stats.pendingProfessionals} pending</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Quote Requests</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalQuotes}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                      <p className="text-2xl font-bold text-foreground">{stats.averageRating}</p>
                      <p className="text-xs text-muted-foreground">{stats.totalReviews} reviews</p>
                    </div>
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Recent Professionals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {professionals.slice(0, 5).map((prof) => (
                      <div key={prof.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{prof.name}</p>
                          <p className="text-sm text-muted-foreground">{prof.specialty}</p>
                        </div>
                        <Badge variant={prof.status === 'approved' ? 'default' : prof.status === 'pending' ? 'secondary' : 'destructive'}>
                          {prof.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Recent Quote Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quoteRequests.slice(0, 5).map((quote) => (
                      <div key={quote.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{quote.service}</p>
                          <p className="text-sm text-muted-foreground">{quote.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{quote.budget || "No budget"}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Professionals Tab */}
          <TabsContent value="professionals" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>All Professionals ({stats.totalProfessionals})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {professionals.map((prof) => (
                    <div key={prof.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium">{prof.name}</h4>
                            <p className="text-sm text-muted-foreground">{prof.email}</p>
                            <p className="text-sm text-muted-foreground">Phone: {prof.phone || 'Not provided'}</p>
                          </div>
                          <Badge variant="outline">{prof.specialty}</Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>Location: {prof.location || 'Not specified'}</p>
                          <p>Experience: {prof.experience || 'Not specified'}</p>
                          <p>Rate: {prof.hourly_rate || 'Not specified'}</p>
                          <p>Registered: {new Date(prof.created_at).toLocaleDateString()}</p>
                        </div>
                        {prof.description && (
                          <p className="mt-2 text-sm text-muted-foreground italic">{prof.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={prof.status === 'approved' ? 'default' : prof.status === 'pending' ? 'secondary' : 'destructive'}>
                          {prof.status}
                        </Badge>
                        <div className="flex space-x-2">
                          {prof.status === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => handleApproveReject(prof.id, 'approved')}>
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleApproveReject(prof.id, 'rejected')}>
                                Reject
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteProfessional(prof.id, prof.name)}
                            className="text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Quote Requests ({stats.totalQuotes})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Client</th>
                        <th className="text-left p-3">Service</th>
                        <th className="text-left p-3">Location</th>
                        <th className="text-left p-3">Budget</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteRequests.map((quote) => (
                        <tr key={quote.id} className="border-b">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{quote.name}</p>
                              <p className="text-sm text-muted-foreground">{quote.email}</p>
                              <p className="text-sm text-muted-foreground">{quote.phone || 'No phone'}</p>
                            </div>
                          </td>
                          <td className="p-3 font-medium">{quote.service}</td>
                          <td className="p-3">{quote.location}</td>
                          <td className="p-3">{quote.budget || 'Not specified'}</td>
                          <td className="p-3 text-sm">{new Date(quote.created_at).toLocaleString()}</td>
                          <td className="p-3 text-sm">{quote.description || 'No description'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Requests Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Contact Requests ({stats.totalContactRequests})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactRequests.map((contact) => (
                    <div key={contact.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{contact.client_name}</h4>
                          <p className="text-sm text-muted-foreground">{contact.client_email}</p>
                          <p className="text-sm text-muted-foreground">{contact.client_phone || 'No phone'}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{contact.status}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(contact.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm bg-muted/50 p-3 rounded">{contact.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Professional ID: {contact.professional_id}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Reviews ({stats.totalReviews})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{review.client_name}</h4>
                          <p className="text-sm text-muted-foreground">{review.client_email}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleString()}
                        </p>
                      </div>
                      {review.comment && (
                        <p className="text-sm bg-muted/50 p-3 rounded">{review.comment}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Professional ID: {review.professional_id}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Page Views Today</p>
                      <p className="text-2xl font-bold text-foreground">{stats.recentActivity}</p>
                    </div>
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.totalVisitors + stats.totalProfessionals + stats.totalQuotes + stats.totalContactRequests + stats.totalReviews}
                      </p>
                    </div>
                    <Database className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Platform Health</p>
                      <p className="text-2xl font-bold text-green-600">Excellent</p>
                    </div>
                    <Settings className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Recent Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Page</th>
                        <th className="text-left p-3">Visitor IP</th>
                        <th className="text-left p-3">User Agent</th>
                        <th className="text-left p-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.slice(0, 20).map((record) => (
                        <tr key={record.id} className="border-b">
                          <td className="p-3 font-medium">{record.page_path}</td>
                          <td className="p-3 text-sm">{record.visitor_ip || 'Unknown'}</td>
                          <td className="p-3 text-sm max-w-xs truncate">{record.user_agent || 'Unknown'}</td>
                          <td className="p-3 text-sm">{new Date(record.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}