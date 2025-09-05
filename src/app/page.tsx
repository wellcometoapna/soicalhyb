import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Bot,
  Calendar,
  Users,
  Image,
  BarChart3,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <Hero />

      {/* Core Features Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-600/30">
              AI-Powered Platform
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Everything You Need to Dominate Social Media
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-lg">
              SocialHub.ai combines cutting-edge AI with intuitive design to
              streamline your social media workflow across all platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="w-8 h-8" />,
                title: "AI Post Composer",
                description:
                  "Generate engaging captions, hashtag recommendations, and platform-optimized content with advanced AI",
                features: [
                  "Smart caption generation",
                  "Hashtag optimization",
                  "Live platform previews",
                ],
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Smart Scheduling",
                description:
                  "Drag-and-drop calendar with AI-recommended optimal posting times for maximum engagement",
                features: [
                  "Drag & drop interface",
                  "AI timing recommendations",
                  "Queue management",
                ],
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                description:
                  "Multi-user workspaces with role-based permissions and approval workflows for seamless teamwork",
                features: [
                  "Role-based access",
                  "Approval workflows",
                  "Team workspaces",
                ],
              },
              {
                icon: <Image className="w-8 h-8" />,
                title: "Media Library",
                description:
                  "Centralized media management with upload, tagging, and inline editing capabilities",
                features: [
                  "Smart organization",
                  "Inline editing",
                  "Asset tagging",
                ],
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Analytics Dashboard",
                description:
                  "Comprehensive insights with impressions, reach, clicks, and engagement rate tracking",
                features: [
                  "Real-time metrics",
                  "Performance insights",
                  "Custom reports",
                ],
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI Optimization",
                description:
                  "Continuous learning algorithms that improve your content performance over time",
                features: [
                  "Performance learning",
                  "Content optimization",
                  "Trend analysis",
                ],
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="text-purple-400 mb-4 group-hover:text-purple-300 transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-white">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-slate-300 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Support Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Supports All Major Platforms
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Manage your presence across Facebook, Instagram, LinkedIn, and
              Twitter/X from one unified dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Facebook", color: "bg-blue-600" },
              {
                name: "Instagram",
                color: "bg-gradient-to-r from-purple-600 to-pink-600",
              },
              { name: "LinkedIn", color: "bg-blue-700" },
              { name: "Twitter/X", color: "bg-slate-900" },
            ].map((platform, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-16 h-16 ${platform.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg`}
                >
                  {platform.name[0]}
                </div>
                <p className="text-slate-300 font-medium">{platform.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2 text-white">10x</div>
              <div className="text-purple-200">Faster Content Creation</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-white">85%</div>
              <div className="text-purple-200">Increase in Engagement</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-white">50+</div>
              <div className="text-purple-200">Hours Saved Per Month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Save Time",
                description: "Automate repetitive tasks and focus on strategy",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Boost Performance",
                description:
                  "AI-driven insights to maximize your reach and engagement",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Enterprise Ready",
                description:
                  "Secure, scalable, and built for teams of all sizes",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-purple-400 mb-4 flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {benefit.title}
                </h3>
                <p className="text-slate-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Social Media Strategy?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-lg">
            Join forward-thinking teams who are already using AI to dominate
            their social media presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-lg font-medium"
            >
              Start Free Trial
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center px-8 py-4 text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-lg font-medium"
            >
              View Demo
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
