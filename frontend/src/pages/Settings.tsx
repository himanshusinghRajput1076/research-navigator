import { FormField } from '@/components/ui/FormField';

export default function Settings() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Profile Information</h3>
        <div className="space-y-4">
          <FormField label="Full Name" defaultValue="Himanshu" />
          <FormField label="Email" type="email" defaultValue="user@example.com" />
          <FormField label="Institution" defaultValue="University of Research" />
          <FormField label="Bio" as="textarea" defaultValue="Researcher focusing on ML and Optimization." />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
