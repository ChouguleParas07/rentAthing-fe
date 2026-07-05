import { useAppSelector } from "@/store/hooks";
import { User, Mail, MapPin, Phone, CheckCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings and preferences.</p>
        </div>

        <Card className="border-0 shadow-lg shadow-green-900/5 rounded-3xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-green-600 to-lime-500 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-full p-2 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center text-green-700">
                  <User className="w-10 h-10" />
                </div>
              </div>
            </div>
          </div>

          <CardHeader className="pt-16 pb-4 px-8 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {user.full_name || "User"}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                    {user.is_verified ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Verified</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Unverified</>
                    )}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {user.role.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-8 py-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-gray-900 font-medium">{user.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900 font-medium">{user.city || "Not provided"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
