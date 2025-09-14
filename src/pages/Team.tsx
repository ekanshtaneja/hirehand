import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Instagram, Mail, Phone } from "lucide-react";

const teamMembers = [
  {
    name: "Ekansh Taneja",
    role: "Founder & CEO",
    bio: "Passionate entrepreneur building the future of construction marketplace. Dedicated to connecting skilled professionals with homeowners who need quality work.",
    linkedin: "#",
    instagram: "https://www.instagram.com/ek_taneja/",
    email: "tanejas1000@gmail.com",
    phone: "7973180034"
  },
  {
    name: "Kaashvi Chhabra",
    role: "Co-Founder",
    bio: "Visionary co-founder committed to transforming the construction industry through innovative solutions and exceptional customer experiences.",
    linkedin: "#",
    instagram: "https://www.instagram.com/kaashvi_chhabra_?utm_source=ig_web_button_share_sheet&igsh=aXBpNXc3cXowYThp",
    email: "kaashvichhabra93@gmail.com",
    phone: ""
  }
];

export default function Team() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate about revolutionizing the construction industry by connecting skilled professionals with homeowners who need quality work.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="shadow-card border-0 mb-16 animate-slide-up">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              At HireHand, we believe that finding reliable construction professionals shouldn't be 
              a gamble. Our platform combines rigorous vetting, transparent pricing, and 
              technology-driven matching to create a marketplace where quality work meets 
              trusted professionals. We're building the future of home improvement, one project at a time.
            </p>
          </CardContent>
        </Card>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {teamMembers.map((member, index) => (
            <Card 
              key={index} 
              className="shadow-card border-0 group hover:shadow-elevated transition-smooth animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                {/* Profile Icon */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full gradient-hero shadow-construction flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex justify-center space-x-3">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`mailto:${member.email}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                  {member.phone && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`tel:${member.phone}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            ))}
        </div>

        {/* Company Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-card border-0 animate-slide-up">
            <CardContent className="p-8 text-center">
              <div className="p-4 gradient-hero rounded-lg w-fit mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Trust</h3>
              <p className="text-muted-foreground">
                Every professional is thoroughly vetted and verified to ensure 
                quality and reliability in every project.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 animate-slide-up animate-delay-100">
            <CardContent className="p-8 text-center">
              <div className="p-4 gradient-service rounded-lg w-fit mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We leverage cutting-edge technology to make finding and hiring 
                construction professionals easier than ever.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 animate-slide-up animate-delay-200">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-construction-yellow rounded-lg w-fit mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Quality</h3>
              <p className="text-muted-foreground">
                We're committed to connecting customers with professionals who 
                deliver exceptional workmanship and service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}