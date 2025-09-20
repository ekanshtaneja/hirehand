import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-construction.jpg";
export const Hero = () => {
  return <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Professional construction workers" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="animate-slide-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Construction,{" "}
            <span className="text-transparent bg-clip-text gradient-hero">
              Your Choice
            </span>
            , Your Price
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with trusted construction professionals for any project. 
            From painting to major renovations, get quality work with transparent pricing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="xl" asChild className="animate-delay-100">
              <Link to="/quotes">
                Find Professionals <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild className="animate-delay-200">
              <Link to="/register-professional">
                Join as Professional
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center max-w-4xl mx-auto animate-delay-300">
            <div className="glass-effect rounded-xl p-6 shadow-elevated">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-8 w-8 text-construction-safety" />
              </div>
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-white/80">Satisfaction Guarantee</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <div className="w-16 h-16 gradient-hero rounded-full"></div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-float animate-delay-200">
        <div className="w-12 h-12 bg-construction-yellow rounded-full"></div>
      </div>
    </section>;
};