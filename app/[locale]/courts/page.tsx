// app/[locale]/discover/page.tsx
import CourtDiscovery from "@/components/courts/CourtDiscovery";
import Search from "@/components/courts/Search";
export default function Courts() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Section 1 */}
      <Search /> 
      
      {/* Section 2 */}
        <CourtDiscovery/>
    </main>
  );
}