// app/[locale]/discover/page.tsx
import Search from "@/components/courts/Search";
export default function Courts() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Section 1 */}
      <Search /> 
      
      {/* Section 2 */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        {/* <CourtGrid /> */}
      </section>
    </main>
  );
}