import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Eye, BarChart3, TrendingUp, Clock, Mail, Phone, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const ADMIN_PASSWORD = "admin123"; // In real app, this would be properly secured

// Mock data - starting with zeros for new website
const analyticsData = {
  totalVisitors: 0,
  professionals: 0,
  newProfessionals: 0,
  weeklyVisitors: [0, 0, 0, 0, 0, 0, 0]
};
const newProfessionals: Array<{
  name: string;
  email: string;
  specialty: string;
  date: string;
}> = [
  // Will populate when professionals register
];
const recentQuotes: Array<{
  service: string;
  location: string;
  budget: string;
  date: string;
}> = [
  // Will populate when quote requests come in
];
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const {
    toast
  } = useToast();
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

          {/* Newly Registered Professionals */}
          <Card className="shadow-card border-0 animate-slide-up animate-delay-100">
            <CardHeader>
              <CardTitle>Newly Registered Professionals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newProfessionals.map((professional, index) => <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
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
                      <div className="text-sm text-muted-foreground">{professional.date}</div>
                    </div>
                  </div>)}
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
                    {recentQuotes.map((quote, index) => <tr key={index} className="border-b border-border">
                        <td className="py-4 font-medium text-foreground">{quote.service}</td>
                        <td className="py-4 text-muted-foreground">{quote.location}</td>
                        <td className="py-4 text-foreground font-medium">{quote.budget}</td>
                        <td className="py-4 text-muted-foreground">{quote.date}</td>
                        <td className="py-4">
                          <Badge variant="outline" className="text-construction-safety border-construction-safety">
                            Active
                          </Badge>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}