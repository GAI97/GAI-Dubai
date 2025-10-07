export const dynamic = "force-static";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white text-black">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-2xl font-semibold">This site is under maintenance.</h1>
        <p>
          Please email <a className="underline" href="mailto:info@globalallianceimmigration.com">info@globalallianceimmigration.com</a> if you have any inquries.
        </p>
      </div>
    </main>
  );
}


