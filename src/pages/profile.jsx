import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
  return (
    <form className="px-1 mt-4">
      <div className="mb-8 space-y-2 ">
        <img
          src="https://picsum.photos/200"
          className="w-20 h-20 rounded-xl border"
        ></img>
        <Button variant="outline">Replace</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="multi-step-personal-info-first-name">Full Name</Label>
          <Input id="multi-step-personal-info-first-name" placeholder="John" />
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="multi-step-personal-info-mobile">Mobile</Label>
          <Input
            id="multi-step-personal-info-mobile"
            placeholder="+91 96648 37593"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="multi-step-personal-info-first-name">Email</Label>
          <Input id="multi-step-personal-info-first-name" placeholder="John" />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit">Save Information</Button>
      </div>
    </form>
  );
};

export default Profile;
