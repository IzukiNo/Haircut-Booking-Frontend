# 💈 BARBERSHOP - Haircut Booking System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/deployed-Vercel-black.svg)](https://vercel.com)

A modern, full-featured barbershop booking system frontend with elegant UI/UX design. This web application allows customers to book haircut appointments, manage their profiles, and enables staff to manage services, appointments, and customer information.

## 🌟 Features

### 👥 Customer Features

- **User Authentication**: Secure login and registration system
- **Profile Management**: View and update personal information, track loyalty points
- **Service Booking**:
  - Browse available services (Haircut, Beard, Facial, Mustache)
  - Select preferred barber
  - Choose appointment date and time
  - View booking history
- **Appointment Management**: View, modify, and cancel appointments
- **Payment Integration**: QR code payment support
- **Service Review**: Rate and review services after completion

### 👨‍💼 Staff/Admin Features

- **Dashboard Overview**: Real-time statistics and analytics
  - Daily revenue tracking
  - Appointment metrics
  - Customer retention rate
  - Average ratings
- **Appointment Management**:
  - View all appointments
  - Filter by status (pending, confirmed, completed, cancelled)
  - Update appointment status
  - Process payments
- **Service Management**: Add, edit, and delete services
- **User Management**: Manage staff and customer accounts
- **Role-based Access Control**: Different permissions for Admin, Staff, Stylist, and Cashier

### 🎨 Design Features

- **Responsive Design**: Mobile-first approach, works on all devices
- **Modern UI**: Clean and professional design with smooth animations
- **Component-based Architecture**: Reusable components (header, footer, navigation)
- **Sticky Navigation**: Easy access to navigation on scroll
- **Interactive Elements**: Hamburger menu, dropdowns, modals
- **Custom Icons**: SVG assets for services and dashboard

## 🏗️ Project Structure

```
Haircut-Booking-Frontend/
├── index.html              # Landing page
├── about.html              # About us page
├── services.html           # Services showcase
├── contact.html            # Contact form
├── auth.html               # Login/Registration
├── assets/                 # Images and icons
│   ├── dashboard/          # Dashboard icons
│   ├── landing/            # Landing page images
│   └── profile/            # Profile assets
├── booking/                # Booking module
│   ├── index.html
│   ├── booking.js
│   ├── booking.css
│   └── dropdown.js
├── css/                    # Stylesheets
│   ├── base.css            # Base styles
│   ├── reset.css           # CSS reset
│   ├── variables.css       # CSS variables
│   ├── components/         # Component styles
│   │   ├── banner.css
│   │   ├── cards.css
│   │   ├── counter.css
│   │   ├── footer.css
│   │   ├── forms.css
│   │   ├── hero.css
│   │   ├── navigation.css
│   │   └── testimonials.css
│   └── pages/              # Page-specific styles
│       ├── about.css
│       ├── auth.css
│       ├── contact.css
│       ├── dashboard.css
│       ├── home.css
│       └── services.css
├── dashboard/              # Admin dashboard
│   ├── index.html
│   ├── dashboard-appointments.html
│   ├── dashboard-services.html
│   ├── dashboard-settings.html
│   ├── dashboard-users.html
│   └── js/
│       ├── dashboard.js
│       ├── appointmentHandler.js
│       ├── serviceHandler.js
│       ├── settingHandler.js
│       └── userHandler.js
├── html-components/        # Reusable components
│   ├── footer.html
│   ├── header.html
│   ├── mobile-nav.html
│   ├── promo-banner.html
│   └── testimonials.html
├── js/                     # JavaScript files
│   ├── main.js             # Main application logic
│   └── auth.js             # Authentication logic
├── payment/                # Payment module
│   ├── index.html
│   ├── payment.js
│   └── payment.css
├── profile/                # Customer profile
│   ├── index.html
│   ├── css/
│   │   └── profile.css
│   └── js/
│       └── profile.js
└── vercel.json             # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development)
- Internet connection (for CDN resources and API calls)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/IzukiNo/haircut-booking-frontend.git
   cd haircut-booking-frontend
   ```

2. **Serve the application**

   Using Python:

   ```bash
   python -m http.server 8000
   ```

   Using Node.js (http-server):

   ```bash
   npx http-server -p 8000
   ```

   Using VS Code Live Server:

   - Install Live Server extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🔧 Configuration

### API Integration

The application connects to a backend API at `https://api.izukino.tech/api`.

Key API endpoints:

- Authentication: `/auth/login`, `/auth/register`, `/auth/me`
- Services: `/services`
- Appointments: `/appointments`
- Users: `/users`
- Payments: `/payments`

To change the API base URL, update the fetch calls in:

- `js/auth.js`
- `booking/booking.js`
- `dashboard/js/*.js`
- `profile/js/profile.js`

### Environment Variables

No environment variables are required for the frontend. All configurations are in the JavaScript files.

## 📱 Pages Overview

### Public Pages

- **Home (`index.html`)**: Landing page with hero section, services preview, stats counter, and testimonials
- **About (`about.html`)**: Company information and team introduction
- **Services (`services.html`)**: Detailed service catalog with pricing
- **Contact (`contact.html`)**: Contact form and location information
- **Auth (`auth.html`)**: Login and registration forms

### Protected Pages (Require Authentication)

- **Booking (`/booking`)**: Book new appointments
- **Profile (`/profile`)**: Customer profile and appointment history
- **Dashboard (`/dashboard`)**: Admin/Staff dashboard with analytics
- **Payment (`/payment`)**: Payment processing and review system

## 🎨 Styling

The project uses a modern CSS architecture:

- **CSS Variables**: Centralized color scheme and spacing in `css/variables.css`
- **Component-based**: Reusable component styles
- **Responsive**: Mobile-first design with breakpoints
- **Custom Fonts**:
  - Abril Fatface (headings)
  - Bebas Neue (titles)
  - Inter (body text)
  - Quicksand (special elements)

### Color Scheme

- Primary: `#d4af37` (Gold)
- Text Dark: `#1a1a1a`
- Text Light: `#ffffff`
- Background: Various shades of dark grays

## 🔐 Authentication & Security

- JWT token-based authentication
- Token stored in `localStorage`
- Protected routes redirect to auth page if not logged in
- Role-based access control for dashboard features
- Secure API communication over HTTPS

## 📦 Dependencies

### External Libraries

- **SweetAlert2** (`v11`): Beautiful alert and modal dialogs
- **Google Fonts**: Typography
- **jsDelivr CDN**: Image hosting

### Browser APIs Used

- Fetch API: HTTP requests
- LocalStorage: Token and data persistence
- DOM API: Dynamic content manipulation

## 🌐 Deployment

### Vercel (Recommended)

The project is configured for Vercel deployment with `vercel.json`:

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Manual Deployment

Simply upload all files to any static hosting service:

- GitHub Pages
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront

## 🧪 Features in Detail

### Component Loading System

The application uses a custom component loader (`main.js`) to dynamically load reusable HTML components:

```javascript
const loadComponents = async () => {
  const components = document.querySelectorAll("[data-component]");
  // Loads header, footer, mobile-nav, etc.
};
```

### Sticky Header

Implements performant scroll handling with `requestAnimationFrame`:

```javascript
const requestTick = () => {
  if (!ticking) {
    requestAnimationFrame(updateHeader);
    ticking = true;
  }
};
```

### Active Navigation Links

Automatically highlights current page in navigation menu.

### Appointment Booking Flow

1. Select barber
2. Choose service
3. Pick date and time
4. Add notes (optional)
5. Confirm booking
6. Receive confirmation

### Payment Flow

1. View appointment details
2. Confirm payment amount
3. Scan QR code or pay cash
4. Leave review
5. Receive thank you message

## 👥 User Roles

| Role         | Permissions                                           |
| ------------ | ----------------------------------------------------- |
| **Customer** | Book appointments, view profile, manage bookings      |
| **Cashier**  | View dashboard, manage appointments, process payments |
| **Stylist**  | View assigned appointments                            |
| **Staff**    | View dashboard, manage appointments                   |
| **Admin**    | Full access to all features                           |

## 📝 Best Practices

- All JavaScript uses async/await for API calls
- Error handling with try-catch blocks
- User feedback with SweetAlert2
- Clean code with comments
- Semantic HTML structure
- Accessible form elements
- Optimized images via CDN

## 🐛 Known Issues & Limitations

- No offline functionality (requires internet for API)
- Limited error recovery for network issues
- No real-time updates (requires manual refresh)
- Payment integration is demonstration only (not production-ready)

## 🔮 Future Enhancements

- [ ] Real-time appointment updates with WebSocket
- [ ] PWA support for offline functionality
- [ ] Multi-language support (i18n)
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Google Calendar integration
- [ ] Advanced analytics dashboard
- [ ] Customer loyalty program expansion
- [ ] Online payment gateway integration (Stripe, PayPal)
- [ ] Photo gallery for completed work

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Project Link: [https://github.com/IzukiNo/haircut-booking-frontend](https://github.com/IzukiNo/haircut-booking-frontend)

## 🙏 Acknowledgments

- Design inspiration from modern barbershop websites
- Icons from custom SVG assets
- Images from jsDelivr CDN
- SweetAlert2 for beautiful alerts
- Google Fonts for typography

---
