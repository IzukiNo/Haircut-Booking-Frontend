# 💈 Barbershop Booking System - Frontend

A modern, responsive web application for a barbershop booking system built with vanilla HTML, CSS, and JavaScript. This frontend provides a complete user interface for customers to book appointments and for administrators to manage the barbershop operations.

## 🌟 Features

### 🏠 **Customer Features**

- **Landing Page** - Elegant homepage showcasing services and shop statistics
- **Service Catalog** - Detailed view of all available barbershop services
- **About Us** - Information about the barbershop and its story
- **Contact Page** - Contact form and shop location information
- **User Authentication** - Login and registration with animated forms
- **Customer Profile** - Personal profile management with booking history
- **Responsive Design** - Fully responsive across all devices

### 👨‍💼 **Admin Dashboard**

- **Overview Dashboard** - Key metrics and statistics
- **User Management** - Manage customer and staff accounts
- **Appointment Management** - View, filter, and manage all bookings
- **Service Management** - Add, edit, and manage barbershop services
- **Settings Panel** - System configuration and preferences
- **Barber Profiles** - Individual barber profile management

### 🎨 **Design & UX**

- **Modern UI/UX** - Clean, professional barbershop aesthetic
- **Component Architecture** - Modular HTML components for maintainability
- **Smooth Animations** - CSS transitions and hover effects
- **Mobile Navigation** - Hamburger menu for mobile devices
- **Sticky Header** - Navigation that stays accessible while scrolling

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with custom properties and flexbox/grid
- **Vanilla JavaScript** - Interactive functionality without frameworks
- **Component System** - Reusable HTML components loaded dynamically
- **Google Fonts** - Typography with Abril Fatface, Bebas Neue, and Inter

## 📁 Project Structure

```
barber-shop/
├── 📄 HTML Pages
│   ├── index.html              # Homepage
│   ├── services.html           # Service catalog
│   ├── about.html              # About page
│   ├── contact.html            # Contact page
│   ├── auth.html               # Login/Registration
│   ├── profile-customer.html   # Customer profile
│   ├── profile-barber.html     # Barber profile
│   └── dashboard-*.html        # Admin dashboard pages
│
├── 🎨 Styling
│   ├── css/
│   │   ├── reset.css           # CSS reset
│   │   ├── variables.css       # CSS custom properties
│   │   ├── base.css            # Base styles
│   │   ├── components/         # Component-specific styles
│   │   └── pages/              # Page-specific styles
│
├── 🧩 Components
│   ├── html-components/
│   │   ├── header.html         # Navigation header
│   │   ├── footer.html         # Site footer
│   │   ├── mobile-nav.html     # Mobile navigation
│   │   ├── testimonials.html   # Customer testimonials
│   │   └── promo-banner.html   # Promotional banner
│
├── ⚡ JavaScript
│   ├── js/
│   │   ├── main.js             # Main application logic
│   │   ├── auth.js             # Authentication handling
│   │   ├── dashboard.js        # Dashboard functionality
│   │   └── profile.js          # Profile management
│
└── 🖼️ Assets
    └── assets/                 # SVG icons and graphics
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (recommended for proper functionality)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/Haircut-Booking-Frontend.git
   cd Haircut-Booking-Frontend
   ```

2. **Navigate to the project directory**

   ```bash
   cd barber-shop
   ```

3. **Start a local server**

   **Option 1: Using Python**

   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -S SimpleHTTPServer 8000
   ```

   **Option 2: Using Node.js (with live-server)**

   ```bash
   npm install -g live-server
   live-server
   ```

   **Option 3: Using PHP**

   ```bash
   php -S localhost:8000
   ```

4. **Open your browser**
   Navigate to `http://localhost:8000` to view the application

## 📱 Pages Overview

### 🏠 **Homepage (`index.html`)**

- Hero section with barbershop branding
- Services preview with cards
- Statistics counter (2500 shaves, 4500 haircuts, 9 open shops)
- Customer testimonials
- Promotional banner

### ✂️ **Services (`services.html`)**

- Complete service catalog with pricing
- Detailed service descriptions
- Professional service imagery
- Booking call-to-action buttons

### ℹ️ **About (`about.html`)**

- Barbershop history and story
- Team information
- Mission and values
- Professional imagery

### 📞 **Contact (`contact.html`)**

- Contact form for inquiries
- Shop location and hours
- Contact information
- Interactive elements

### 🔐 **Authentication (`auth.html`)**

- Animated login/registration forms
- Form validation
- Responsive design
- Social login options (UI ready)

### 👤 **Profiles**

- **Customer Profile**: Booking history, loyalty points, account management
- **Barber Profile**: Schedule management, service specializations, statistics

### 📊 **Admin Dashboard**

- **Main Dashboard**: Overview statistics and quick actions
- **Appointments**: Filter and manage all bookings (pending, confirmed, completed, cancelled)
- **Users**: Manage customer and staff accounts
- **Services**: Add/edit services with pricing and duration
- **Settings**: System configuration

## 🎨 Design System

### Color Palette

- **Primary**: `#E9C664` (Golden yellow)
- **Dark**: `#212121` (Charcoal)
- **White**: `#FFFFFF`
- **Gray**: `#979799`
- **Black**: `#000000`

### Typography

- **Headings**: Abril Fatface (serif)
- **Accent Text**: Bebas Neue (sans-serif)
- **Body Text**: Inter (sans-serif)

### Components

- Modular CSS architecture
- Reusable component classes
- Consistent spacing and typography
- Hover states and transitions

## 🔧 JavaScript Functionality

### Core Features

- **Component Loading**: Dynamic HTML component injection
- **Navigation**: Sticky header and mobile hamburger menu
- **Authentication**: Form switching animations
- **Dashboard**: Sidebar toggle and filtering
- **Profile Management**: Tab switching and form handling

### Key Scripts

- `main.js`: Core application logic and component loading
- `auth.js`: Authentication form interactions
- `dashboard.js`: Admin dashboard functionality
- `profile.js`: User profile management

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Medium screen adaptations
- **Desktop**: Full-featured desktop experience
- **Touch Friendly**: Large tap targets and gestures

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**IzukiNo**

- GitHub: [@IzukiNo](https://github.com/IzukiNo)

## 🙏 Acknowledgments

- Icons and graphics from custom SVG designs
- Images hosted via CDN for optimal performance
- Google Fonts for typography
- Modern CSS techniques for animations and layouts

---
