![YliGood Reservation](./asserts/title.png)

# YliGood Reservation (Vue-based Rebuild)

An automation tool that helps users easily book sports facilities on the Nanjing University gym reservation system (ggtypt.nju.edu.cn).

## ✨ Features

- **Automatic Scanning**: Automatically detects available venues and makes reservations within specified time periods
- **Auto-click**: Intelligently clicks reservation buttons to simplify the booking process
- **CAPTCHA Auto-solve**: Automatically identifies and solves slider verification codes without manual intervention
- **Custom Booking Time**: Set preferred time slots for automatic reservation when matches are found
- **Auto Payment**: Automatically clicks payment buttons after successful reservation to reduce manual operations
- **Reservation Notifications**: Displays notifications with detailed order information upon successful booking
- **Draggable Control Panel**: Users can freely move the control panel to any position on the screen

## 🚀 Installation Guide

### Option 1: Browser Extension (Recommended)

Install directly from browser app stores:

#### [Chrome Extension](https://chrome.google.com/webstore)

#### [Edge Extension](https://microsoftedge.microsoft.com/addons)

### Option 2: Script Manager

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click [here](#) to install the user script
3. Visit [Nanjing University Gym Reservation System](https://ggtypt.nju.edu.cn/) to automatically enable the tool

### Option 3: Developer Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/YliGoodReservation.git

# Navigate to the project directory
cd YliGoodReservation

# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run build
```

## 📖 User Guide

1. Visit [Nanjing University Gym Reservation System](https://ggtypt.nju.edu.cn/)
2. The control panel will appear in the top-right corner of the page
3. Select a function mode:
   - **Auto-click**: Automatically completes the reservation process when you click on a venue
   - **Auto-scan**: Set scanning intervals and preferred time slots, and the system will automatically find and book available venues
   - **Off**: Stop all automation features

## ⚙️ Configuration Options

- **Scan Interval**: Adjust the time interval for automatic scanning (1-30 seconds)
- **Preferred Time Slots**: Set the time periods you wish to book, in the format "9:00-10:30,18:00-19:30"

## 🔒 Privacy Statement

- This plugin only runs on the Nanjing University gym reservation system website
- No personal data is collected or transmitted
- All operations are performed locally in your browser

## 🛠️ Tech Stack

- Vue 3
- TypeScript
- Pinia (State Management)
- Element Plus (UI Components)
- Vite (Build Tool)

## 📝 TODO List

### minmize the package we import

## ✅ Contribution Guidelines

Issues and feature requests are welcome! If you want to contribute code:

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License


## Contact

Questions or suggestions? Contact us through:

- Submit an [issue](https://github.com/yourusername/YliGoodReservation/issues) on GitHub

---

**Disclaimer**: This project is for learning and research purposes only. Please comply with the terms of service of the relevant platforms.
