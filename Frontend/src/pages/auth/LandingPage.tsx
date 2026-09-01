import { PublicNavbar } from "../../components/layout/PublicNavbar";
import { Footer } from "../../components/layout/Footer";

import { HeroSection } from "../../components/landing/HeroSection";
import { CategorySection } from "../../components/landing/CategorySection";
import { TrendingCoursesSection } from "../../components/landing/TrendingCoursesSection";
import { QaCommunitySection } from "../../components/landing/QaCommunitySection";


function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            <PublicNavbar />

            <main>

                <HeroSection />

                <CategorySection />

                <TrendingCoursesSection />

                <QaCommunitySection />

            </main>

            <Footer />

        </div>
    );
}


export default LandingPage;