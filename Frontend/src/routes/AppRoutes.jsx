import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Public Pages
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import ContactUs from '../pages/ContactUs';
import DestinationList from '../pages/DestinationList';
import DestinationDetails from '../pages/DestinationDetails';
import PackageList from '../pages/PackageList';
import PackageDetails from '../pages/PackageDetails';
import PlaceDetails from '../pages/PlaceDetails';

// Auth Pages
import Login from '../pages/Login';
import Register from '../pages/Register';

// Customer Protected Pages (No Sidebar)
import Profile from '../pages/Profile';
import MyTrips from '../pages/MyTrips';
import CreateBooking from '../pages/CreateBooking';
import Payment from '../pages/Payment';
import PaymentSuccess from '../pages/PaymentSuccess';

// Admin Protected Pages (Sidebar)
import Dashboard from '../pages/Dashboard';
import TourGuideDashboard from '../pages/guide/TourGuideDashboard';
import AssignedTrips from '../pages/guide/AssignedTrips';
import TripDetails from '../pages/guide/TripDetails';
import UpdateProgress from '../pages/guide/UpdateProgress';
import TripPhotos from '../pages/guide/TripPhotos';
import CustomersList from '../pages/guide/CustomersList';
import NotificationsPage from '../pages/guide/NotificationsPage';
import GuideProfile from '../pages/guide/GuideProfile';

import AssignedTours from '../pages/guide/AssignedTours';
import TodayTours from '../pages/guide/TodayTours';
import GuideUpcomingTours from '../pages/guide/UpcomingTours';
import InProgressTours from '../pages/guide/InProgressTours';
import GuideCompletedTours from '../pages/guide/CompletedTours';
import GuideCancelledTours from '../pages/guide/CancelledTours';

import TripSchedule from '../pages/TripSchedule';
import CreateDestination from '../pages/CreateDestination';
import CreatePackage from '../pages/CreatePackage';
import AdminBookings from '../pages/AdminBookings';
import AdminBookingDetails from '../pages/admin/AdminBookingDetails';
import AdminEditBooking from '../pages/admin/AdminEditBooking';

// Tour Manager New Pages
import TourManagerDashboard from '../pages/manager/TourManagerDashboard';
import Bookings from '../pages/manager/Bookings';
import TourAssignments from '../pages/manager/TourAssignments';
import Guides from '../pages/manager/Guides';
import Vehicles from '../pages/manager/Vehicles';
import Hotels from '../pages/manager/Hotels';
import Customers from '../pages/manager/Customers';
import Itinerary from '../pages/manager/Itinerary';
import Reports from '../pages/manager/Reports';
import ManagerProfile from '../pages/manager/ManagerProfile';
import UpcomingTours from '../pages/manager/UpcomingTours';
import OngoingTours from '../pages/manager/OngoingTours';
import CompletedTours from '../pages/manager/CompletedTours';
import CancelledTours from '../pages/manager/CancelledTours';

import RoleProtectedRoute from '../components/RoleProtectedRoute';
import Unauthorized from '../pages/Unauthorized';

const getDashboardRoute = (role) => {
  switch (role) {
    case 'SUPER_ADMIN': return '/super-admin/dashboard';
    case 'ADMIN': return '/admin/dashboard';
    case 'TOUR_MANAGER': return '/manager/dashboard';
    case 'TOUR_GUIDE': return '/guide/dashboard';
    case 'CUSTOMER': default: return '/';
  }
};

const AppRoutes = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const dashboardRoute = getDashboardRoute(role);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={token ? <Navigate to={dashboardRoute} replace /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to={dashboardRoute} replace /> : <Register />} />
      </Route>

      {/* Public & Customer Routes (Full Width, No Sidebar) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/destinations" element={<DestinationList />} />
        <Route path="/destinations/:id" element={<DestinationDetails />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/packages" element={<PackageList />} />
        <Route path="/packages/india" element={<DestinationList category="india" />} />
        <Route path="/packages/international" element={<DestinationList category="international" />} />
        <Route path="/packages/honeymoon" element={<DestinationList category="honeymoon" />} />
        <Route path="/packages/europe" element={<DestinationList category="europe" />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route path="/places/:placeId" element={<PlaceDetails />} />
        <Route path="/booking/:packageId" element={<CreateBooking />} />
        
        {/* Customer Protected */}
        <Route element={<RoleProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'TOUR_MANAGER', 'TOUR_GUIDE']} />}>
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Route>
        
        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Role-Based Admin Routes (With Sidebar) */}
      
      {/* SUPER ADMIN Namespace */}
      <Route path="/super-admin" element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="destinations/create" element={<CreateDestination />} />
          <Route path="packages/create" element={<CreatePackage />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="bookings/:id" element={<AdminBookingDetails />} />
          <Route path="bookings/:id/edit" element={<AdminEditBooking />} />
        </Route>
      </Route>

      {/* ADMIN Namespace */}
      <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="destinations/create" element={<CreateDestination />} />
          <Route path="packages/create" element={<CreatePackage />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="bookings/:id" element={<AdminBookingDetails />} />
          <Route path="bookings/:id/edit" element={<AdminEditBooking />} />
        </Route>
      </Route>

      {/* TOUR MANAGER Namespace */}
      <Route path="/manager" element={<RoleProtectedRoute allowedRoles={['TOUR_MANAGER']} />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<TourManagerDashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="assignments" element={<TourAssignments />} />
          <Route path="upcoming-tours" element={<UpcomingTours />} />
          <Route path="ongoing-tours" element={<OngoingTours />} />
          <Route path="completed-tours" element={<CompletedTours />} />
          <Route path="cancelled-tours" element={<CancelledTours />} />
          <Route path="guides" element={<Guides />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="customers" element={<Customers />} />
          <Route path="itinerary" element={<Itinerary />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<ManagerProfile />} />
        </Route>
      </Route>

      {/* GUIDE Namespace */}
      <Route path="/guide" element={<RoleProtectedRoute allowedRoles={['TOUR_GUIDE']} />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<TourGuideDashboard />} />
          <Route path="trips" element={<AssignedTrips />} />
          <Route path="assigned" element={<AssignedTours />} />
          <Route path="today" element={<TodayTours />} />
          <Route path="schedule" element={<TripSchedule />} />
          <Route path="upcoming" element={<GuideUpcomingTours />} />
          <Route path="in-progress" element={<InProgressTours />} />
          <Route path="completed" element={<GuideCompletedTours />} />
          <Route path="cancelled" element={<GuideCancelledTours />} />
          <Route path="customers" element={<CustomersList />} />
          <Route path="progress" element={<UpdateProgress />} />
          <Route path="photos" element={<TripPhotos />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<GuideProfile />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
