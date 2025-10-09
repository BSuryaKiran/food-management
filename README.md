# 🌱 GreenBites

A modern web platform to track and reduce food waste, connecting food donors with seekers to improve food security.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.3.9-646CFF?logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)

## ✨ Features

- 🍽️ **Donor Dashboard** - List surplus food, coordinate donations, and track impact
- 🤝 **Seeker Dashboard** - Request food donations, manage logistics, and distribute to those in need
- 🔔 **Notifications System** - Real-time alerts for donations and requests
- 💬 **Messaging Center** - Communication between donors and seekers
- 📊 **Statistics Tracking** - Monitor food donated, people helped, and CO₂ saved
- 💾 **Data Persistence** - localStorage integration for offline data
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Clean Green UI** - Modern, intuitive interface with environmental theme

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/spiderman3137/greenbites.git

# Navigate to project directory
cd greenbites

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Demo Credentials

**Donor Account:**
- Email: `donor@example.com`
- Password: `donor123`

**Seeker Account:**
- Email: `seeker@example.com`
- Password: `seeker123`

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **Styling:** CSS3 with custom properties
- **State Management:** React Hooks (useState, useEffect)
- **Data Storage:** localStorage API
- **Language:** JavaScript (ES6+)

## 📁 Project Structure

```
greenbites/
├── index.html                  # Entry HTML file
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies and scripts
├── src/
│   ├── main.jsx              # Application entry point
│   ├── App.jsx               # Main app component with routing
│   ├── App.css               # Global app styles
│   ├── index.css             # Base styles and CSS variables
│   ├── components/
│   │   ├── Login.jsx         # Login page component
│   │   ├── Login.css         # Login page styles
│   │   ├── DonorDashboard.jsx      # Donor dashboard
│   │   ├── SeekerDashboard.jsx     # Seeker dashboard
│   │   ├── Dashboard.css           # Dashboard styles
│   │   ├── NotificationBell.jsx    # Notifications component
│   │   ├── NotificationBell.css    # Notification styles
│   │   ├── MessageCenter.jsx       # Messaging component
│   │   ├── MessageCenter.css       # Message styles
│   │   └── StatCard.jsx           # Reusable stat card
│   └── utils/
│       └── defaultData.js    # Default demo data
└── clear-storage.html        # Utility to clear localStorage
```

## 🎯 Key Concepts Demonstrated

### HTML5
- Semantic HTML tags (header, main, section, article, aside, footer)
- Form elements with validation
- Media queries for responsive design

### CSS3
- CSS Variables (Custom Properties)
- Flexbox and Grid layouts
- Transitions and animations
- Media queries
- Responsive design patterns

### JavaScript ES6+
- Arrow functions
- Destructuring
- Spread/rest operators
- Template literals
- Array methods (map, filter, reduce)
- Async/await
- localStorage API
- JSON manipulation

### React
- Functional components
- JSX syntax
- Props and state management
- useState and useEffect hooks
- Event handling
- Conditional rendering
- List rendering with keys
- Component composition
- React Router for navigation
- Controlled components (forms)

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌟 Features in Detail

### Donor Dashboard
- Add new food donations with details (type, quantity, expiry, location)
- View all donations with status badges
- Track statistics (total donations, weight, people helped, CO₂ saved)
- Receive notifications when donations are claimed
- Manage messages from seekers.

### Seeker Dashboard
- Browse available food donations
- Create food requests with urgency levels
- Track received food and people served
- Claim available donations
- Communicate with donors via messages

### Notification System
- Real-time alerts for important events
- Unread count badges
- Mark as read functionality
- Different notification types (success, info, warning, message)
- Relative time display

### Messaging Center
- Full messaging interface
- Message preview and detail views
- Sender avatars
- Delete messages
- Unread indicators

## 🔧 Configuration

### Vite Configuration
The project uses Vite for fast development and optimized builds. Configuration is in `vite.config.js`.

### Environment Variables
To add environment variables, create a `.env` file and prefix variables with `VITE_`:

```env
VITE_API_URL=your_api_url
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🐛 Troubleshooting

### Issue: Stuck on Dashboard Instead of Login
**Solution:** Clear localStorage
```javascript
// Open browser console (F12) and run:
localStorage.clear()
// Then refresh the page
```

Or visit: `http://localhost:3000/clear-storage.html`

### Issue: Port Already in Use
**Solution:** Change port in `vite.config.js`
```javascript
server: {
  port: 3001
}
```

### Issue: Module Not Found
**Solution:** Ensure all imports use `.jsx` extensions
```javascript
import Login from './components/Login.jsx';
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**spiderman3137**
- GitHub: [@spiderman3137](https://github.com/spiderman3137)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with React and Vite
- Icons: Emoji
- Design inspiration: Modern green/environmental themes

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with 💚 to reduce food waste and improve food security**
