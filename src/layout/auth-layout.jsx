import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import aurora from '../assets/aurora.svg'

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-6">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-center gap-2">
            <div className="flex justify-center flex-col items-center ">
              <img src={aurora} alt="DD" className="h-16" />
            </div>
          </div>
          {title && (
            <CardTitle className="text-lg text-center font-medium">
              {title}
            </CardTitle>
          )}
          {subtitle && (
            <CardDescription className="text-center text-xs">
              {subtitle}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

export default AuthLayout;
