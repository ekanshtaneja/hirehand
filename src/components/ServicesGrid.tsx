import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Paintbrush, 
  Hammer, 
  Zap, 
  Wrench, 
  Building2, 
  Palette,
  ArrowRight 
} from "lucide-react";

// Import service images
import paintingImg from "@/assets/service-painting.jpg";
import carpentryImg from "@/assets/service-carpentry.jpg";
import electricalImg from "@/assets/service-electrical.jpg";
import plumbingImg from "@/assets/service-plumbing.jpg";
import masonryImg from "@/assets/service-masonry.jpg";
import interiorImg from "@/assets/service-interior.jpg";

const services = [
  {
    id: "painting",
    name: "Painting",
    description: "Interior and exterior painting services with premium materials and expert craftsmanship.",
    icon: Paintbrush,
    image: paintingImg,
    price: "From $200",
  },
  {
    id: "carpentry",
    name: "Carpentry",
    description: "Custom woodwork, furniture, cabinets, and structural carpentry by skilled artisans.",
    icon: Hammer,
    image: carpentryImg,
    price: "From $300",
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Safe and certified electrical installations, repairs, and maintenance services.",
    icon: Zap,
    image: electricalImg,
    price: "From $150",
  },
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Professional plumbing services for repairs, installations, and emergency fixes.",
    icon: Wrench,
    image: plumbingImg,
    price: "From $120",
  },
  {
    id: "masonry",
    name: "Masonry",
    description: "Expert brickwork, stonework, and concrete services for durable construction.",
    icon: Building2,
    image: masonryImg,
    price: "From $400",
  },
  {
    id: "interior-design",
    name: "Interior Design",
    description: "Transform your space with professional interior design and decoration services.",
    icon: Palette,
    image: interiorImg,
    price: "From $500",
  },
];

export const ServicesGrid = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional Construction Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our wide range of construction and home improvement services. 
            All professionals are vetted, insured, and ready to deliver quality work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.id} 
              className="group overflow-hidden shadow-card hover:shadow-elevated transition-smooth animate-slide-up border-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 p-2 gradient-hero rounded-lg shadow-construction">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <div className="absolute bottom-4 right-4 text-white font-semibold text-lg">
                  {service.price}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {service.name}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-spring" 
                  asChild
                >
                  <Link to={`/get-quote/${service.id}`}>
                    Get Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="secondary" size="lg" asChild>
            <Link to="/quotes">
              View All Professionals <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};