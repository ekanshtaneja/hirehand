import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Eye, BarChart3, TrendingUp, Clock, Mail, Phone, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
const ADMIN_PASSWORD = "admin123"; // In real app, this would be properly secured

type Professional = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  created_at: string;
  status: string;
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
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalVisitors: 0,
    professionals: 0,
    newProfessionals: 0,
    weeklyVisitors: [0, 0, 0, 0, 0, 0, 0]
  });
  const { toast } = useToast();

  // Handle approve/reject professional
  const handleApproveReject = async (professionalId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('professionals')
        .update({ status })
        .eq('id', professionalId);

      if (error) throw error;

      toast({
        title: status === 'approved' ? "Professional Approved" : "Professional Rejected",
        description: `Professional has been ${status} successfully.`
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating professional status:', error);
      toast({
        title: "Error",
        description: "Failed to update professional status.",
        variant: "destructive"
      });
    }
  };

  // Fetch real data from Supabase
  const fetchData = async () => {
    try {
      // Fetch professionals
      const { data: profData } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch quote requests
      const { data: quoteData } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch analytics data
      const { data: analyticsCount } = await supabase
        .from('analytics')
        .select('id', { count: 'exact' });

      if (profData) setProfessionals(profData);
      if (quoteData) setQuoteRequests(quoteData);
      
      // Update analytics with real data
      setAnalyticsData({
        totalVisitors: analyticsCount?.length || 0,
        professionals: profData?.length || 0,
        newProfessionals: profData?.filter(p => 
          new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0,
        weeklyVisitors: [12, 8, 15, 20, 18, 25, 30] // Mock weekly data for now
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      
      // Set up real-time updates
      const professionalChannel = supabase
        .channel('professionals_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'professionals' }, () => {
          fetchData();
        })
        .subscribe();

      const quotesChannel = supabase
        .channel('quotes_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, () => {
          fetchData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(professionalChannel);
        supabase.removeChannel(quotesChannel);
      };
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
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-construction-safety mr-1" />
                <span className="text-construction-safety font-medium">+12%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
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
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-construction-safety mr-1" />
                <span className="text-construction-safety font-medium">+8%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
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
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-construction-safety mr-1" />
                <span className="text-construction-safety font-medium">+23%</span>
                <span className="text-muted-foreground ml-1">this week</span>
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

          {/* Professionals Pending Approval */}
          <Card className="shadow-card border-0 animate-slide-up animate-delay-100">
            <CardHeader>
              <CardTitle>Professionals Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {professionals.filter(p => p.status === 'pending').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No professionals pending approval.
                  </div>
                ) : (
                  professionals.filter(p => p.status === 'pending').slice(0, 5).map((professional) => (
                    <div key={professional.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
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
                        <div className="text-sm text-muted-foreground mt-1">
                          Registered: {new Date(professional.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveReject(professional.id, 'approved')}
                          className="bg-construction-safety hover:bg-construction-safety/90"
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleApproveReject(professional.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Quote Requests */}
          <Card className="shadow-card border-0 animate-slide-up animate-delay-200 lg:col-span-2">
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
                    {quoteRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No quote requests yet.
                        </td>
                      </tr>
                    ) : (
                      quoteRequests.map((quote) => (
                        <tr key={quote.id} className="border-b border-border">
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
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}